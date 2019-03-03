var fs = require('fs');
var path = require('path');

console.log(`Write netlifyConf ${process.env.NODE_ENV}`);

var redirect = process.env.NODE_ENV.indexOf('test') === 0 ? 
    path.join(__dirname, 'netlifyConf/_redirects_test') :
    path.join(__dirname, 'netlifyConf/_redirects');

var staticPath = path.join(__dirname, 'dist');
var chartPath = path.join(__dirname, 'charting_library');
var chartStaticPath = path.join(__dirname, 'dist/charting_library');

var result = fs.existsSync(staticPath);
// Not exists
if (!result) {
    console.error(new Error(`${staticPath}     is not exists.`));
    return ;
}

fs.writeFileSync(path.join(staticPath, '_redirects'), fs.readFileSync(redirect));
copyFolder(chartPath, chartStaticPath);



function copyFolder (currentPath, targetPath) {
    if ( !fs.existsSync(currentPath) ) {
        console.error(new Error(`${currentPath}     is not exist.`));
        return;
    }
    !fs.existsSync(targetPath) && fs.mkdirSync(targetPath);
    
    traversing(currentPath, (fPath, targetPath, next, val) => {
        let stats = fs.statSync(fPath);
        let toPath = path.join(targetPath, val);

        if (stats.isDirectory()) {
            !fs.existsSync(toPath) && fs.mkdirSync(toPath);
            next(fPath, toPath);
            return;
        }

        if (stats.isFile()) {
            let file = fs.readFileSync(fPath);
            fs.writeFileSync(toPath, file);
        }
    }, targetPath);
}
function traversing (startPath, cb, folderLevel) {
    function readdirSync (startPath, folderLevel) {
        let files = fs.readdirSync(startPath);

        files.forEach((val) => {
            let fPath = path.join(startPath, val);
            cb && cb(fPath, folderLevel, readdirSync, val);
        });

    }

    readdirSync(startPath, folderLevel);
}