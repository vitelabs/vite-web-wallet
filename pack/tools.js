const fs = require('fs');
const path = require('path');

module.exports = {
    traversingDir,
    copyDir: function (currentPath, targetPath) {
        if (!fs.existsSync(currentPath)) {
            console.error(new Error(`${ currentPath } is not exist.`));
            return;
        }
        !fs.existsSync(targetPath) && fs.mkdirSync(targetPath);

        traversingDir(currentPath, (fPath, next, val, targetPath) => {
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
    },
    buildLog: function (msg) {
        console.log(`\n ==> ${ msg }, ${ new Date().getTime() }`);
    },
    cleanFile: function (filePath) {
        const result = fs.existsSync(filePath);
        result && fs.unlinkSync(filePath);
    }
};

function traversingDir(startPath, cb, folderLevel) {
    function readdirSync(startPath, folderLevel) {
        const files = fs.readdirSync(startPath);

        files.forEach(val => {
            const fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val, folderLevel);
        });
    }

    readdirSync(startPath, folderLevel);
}
