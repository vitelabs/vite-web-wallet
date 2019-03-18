var fs = require('fs');
var path = require('path');

// routeConfig > pageConfig
var routeConfig = require('./src/router/config.js');

var routesPath = path.join(__dirname, '/src/router/routes.js');

var result = fs.existsSync(routesPath);
// Not exists
if (result) {
    fs.unlinkSync(routesPath);
}

// Write routes file
let routesStr = '';
let routes = {};

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
        (name !== 'index') && pushRoute(fPath, tmpPath, name, name);
        return;
    }

    if (val !== 'index.vue') {
        return;
    }

    // pages/XXX/XXX/index.vue
    let path = tmpPath.replace(/\/index.vue$/, '');

    let nList = path.split('/');
    if (!nList || !nList.length || nList.length > 2) {
        return;
    }

    let name = '';
    nList.forEach((n) => {
        if (!name) {
            name += n;
            return;
        }
        name += (n ? n[0].toLocaleUpperCase() + n.slice(1) : '');
    });

    if (!name) {
        return;
    }
    
    pushRoute(fPath, tmpPath, name, nList[0]);
});

let _routes = '';
for(let key in routes) {
    let _k = routes[key];

    _routes += `{name: '${_k.name}', path: '${_k.path}', component: ${_k.component}`;

    let alias = routeConfig[key] && routeConfig[key].alias ? routeConfig[key].alias : _k.alias;
    alias && (_routes += `, alias: '${alias}'`);

    if (!_k.children || !_k.children.length) {
        _routes += '},';
        continue;
    }

    _routes += ', children: [';
    _k.children.forEach(_kr => {
        _routes += `{name: '${_kr.name}', path: '${_kr.path}', component: ${_kr.component}`;

        let alias = routeConfig[_kr.name] && routeConfig[_kr.name].alias ? routeConfig[_kr.name].alias : _kr.alias;
        alias && (_routes += `, alias: '${alias}'`);

        _routes += '},';
    });
    _routes += ']},';
}
routesStr += `export default { routes: [${_routes}] }`;

fs.writeFileSync(routesPath, routesStr);



function pushRoute(fPath, tmpPath, name, parent) {
    if (!name) {
        return;
    }

    let _route = {};

    routesStr += `import ${name} from \'pages/${tmpPath}\';`;
    _route.name = name;
    _route.path = `/${name}`;
    _route.component = name;

    // _route is children, push children
    if (parent !== name) {
        routes[parent] = routes[parent] || {};
        routes[parent].children = routes[parent].children || [];
        routes[parent].children.push(_route);
        return;
    }

    // _route is parent
    routes[parent] = Object.assign(routes[parent] || {}, _route);
    routes[parent].component = routes[parent].component || _route.component;
    routes[parent].children = routes[parent].children || [];
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
