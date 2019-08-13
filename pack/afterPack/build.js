const fs = require('fs');
const path = require('path');

console.log(`Write netlifyConf ${ process.env.NODE_ENV }`);

let redirect;
if (process.env.NODE_ENV === 'test') {
    redirect = path.join(__dirname, '../../netlifyConf/_redirects_test');
} else {
    redirect = path.join(__dirname, '../../netlifyConf/_redirects');
}

const staticPath = path.join(__dirname, '../../dist');
const chartPath = path.join(__dirname, '../../charting_library');
const chartStaticPath = path.join(__dirname, '../../dist/charting_library');
const staticPagesPath = path.join(__dirname, '../../staticPages');

const result = fs.existsSync(staticPath);
// Not exists
if (!result) {
    console.error(new Error(`${ staticPath } is not exists.`));
    return ;
}

fs.writeFileSync(path.join(staticPath, '_redirects'), fs.readFileSync(redirect));

copyFolder(staticPagesPath, staticPath);
copyFolder(chartPath, chartStaticPath);


function copyFolder(currentPath, targetPath) {
    if (!fs.existsSync(currentPath)) {
        console.error(new Error(`${ currentPath } is not exist.`));
        return;
    }
    !fs.existsSync(targetPath) && fs.mkdirSync(targetPath);

    traversing(currentPath, (fPath, next, val, targetPath) => {
        const stats = fs.statSync(fPath);
        const toPath = path.join(targetPath, val);

        if (stats.isDirectory()) {
            !fs.existsSync(toPath) && fs.mkdirSync(toPath);
            next(fPath, toPath);

            return;
        }

        if (stats.isFile()) {
            const file = fs.readFileSync(fPath);
            fs.writeFileSync(toPath, file);
        }
    }, targetPath);
}

function traversing(startPath, cb, folderLevel) {
    function readdirSync(startPath, folderLevel) {
        const files = fs.readdirSync(startPath);

        files.forEach(val => {
            const fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val, folderLevel);
        });
    }

    readdirSync(startPath, folderLevel);
}
