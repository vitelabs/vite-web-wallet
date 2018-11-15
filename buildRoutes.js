var fs = require('fs');
var path = require('path');

var routesPath = path.join(__dirname, 'routes.js');

var result = fs.existsSync(routesPath);
// Not exists
if (result) {
    fs.unlinkSync(routesPath);
}

// Write routes file
let routesStr = '';
let routes = 'export default { routes: [';
let indexRoutes = [];

traversing('./src/pages/', (fPath, next, val) => {
    let stats = fs.statSync(fPath);

    if (stats.isDirectory()) {
        next(fPath);
        return;
    }

    if (!stats.isFile()) {
        return;
    }

    let tmpPath = fPath.replace(/src\/pages\//, '');

    // pages/XXX.vue
    if (tmpPath === val && val.indexOf('.vue') === val.length - 4) {
        let name = val.replace('.vue', '');
        if (name === 'index') {
            return;
        }
        pushRoute(fPath, tmpPath, name);
    }

    // pages/XXX/XXX/XXX/index.vue
    if (val === 'index.vue') {
        let path = '/' + tmpPath.replace(/\/index.vue$/, '');

        let nList = path.split('/');
        let name = '';
        nList.forEach((n) => {
            if (!n) {
                return;
            }
            if (!name) {
                name += n;
                return;
            }
            name += (n ? n[0].toLocaleUpperCase() + n.slice(1) : '');
        });

        if (!name) {
            return;
        }
        
        pushRoute(fPath, tmpPath, name);
    }
}, './');

routes += '],';
routesStr += routes;
routesStr += `indexLayoutRoutes: ${JSON.stringify(indexRoutes)}}`;

fs.writeFileSync(routesPath, routesStr);

function pushRoute(fPath, tmpPath, name) {
    let file = fs.readFileSync(fPath);
    if (file.indexOf('/**  vite-wallet index-layout */') !== -1) {
        indexRoutes.push(name);
    }
    routesStr += `import ${name} from \'pages/${tmpPath}\';`;
    routes += `{name:'${name}',path:'/${name}',component:${name}},`;
}

function traversing (startPath, cb) {
    function readdirSync (startPath) {
        let files = fs.readdirSync(startPath);

        files.forEach((val) => {
            let fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val);
        });
    }
    readdirSync(startPath);
}