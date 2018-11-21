var fs = require('fs');
var path = require('path');

var routesPath = path.join(__dirname, 'routes.js');

try {
    var result = fs.existsSync(routesPath);
    // Not exists
    if (result) {
        fs.unlinkSync(routesPath);
    }
} catch(err) {
    console.warn(err);
}


// Write routes file
var routesStr = '';
var routes = 'export default { routes: [';
var indexRoutes = [];

try {
    traversing('./src/pages/', (fPath, next, val) => {
        var stats = fs.statSync(fPath);
    
        if (stats.isDirectory()) {
            next(fPath);
            return;
        }
    
        if (!stats.isFile()) {
            return;
        }
    
        var tmpPath = fPath.replace(/src\/pages\//, '');
    
        // pages/XXX.vue
        if (tmpPath === val && val.indexOf('.vue') === val.length - 4) {
            var name = val.replace('.vue', '');
            pushRoute(fPath, tmpPath, name);
            return;
        }
    
        // pages/XXX/XXX/XXX/index.vue
        if (val === 'index.vue') {
            var path = '/' + tmpPath.replace(/\/index.vue$/, '');
    
            var nList = path.split('/');
            var pageName = '';
            nList.forEach((n) => {
                if (!n) {
                    return;
                }
                if (!pageName) {
                    name += n;
                    return;
                }
                pageName += (n ? n[0].toLocaleUpperCase() + n.slice(1) : '');
            });
    
            if (!pageName) {
                return;
            }
            
            pushRoute(fPath, tmpPath, pageName);
        }
    }, './');
} catch(err) {
    console.warn(err);
}

routes += '],';
routesStr += routes;
routesStr += `indexLayoutRoutes: ${JSON.stringify(indexRoutes)}}`;

fs.writeFileSync(routesPath, routesStr);

function pushRoute(fPath, tmpPath, name) {
    var file = fs.readFileSync(fPath);
    if (file.indexOf('/**  vite-wallet index-layout */') !== -1) {
        indexRoutes.push(name);
    }
    routesStr += `import ${name} from \'pages/${tmpPath}\';`;
    routes += `{name:'${name}',path:'/${name}',component:${name}},`;
}

function traversing (startPath, cb) {
    function readdirSync (startPath) {
        var files = fs.readdirSync(startPath);

        files.forEach((val) => {
            var fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val);
        });
    }
    readdirSync(startPath);
}