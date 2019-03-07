var fs = require('fs');
var path = require('path');

var routesPath = path.join(__dirname, '/src/router/routes.js');

var result = fs.existsSync(routesPath);
// Not exists
if (result) {
    fs.unlinkSync(routesPath);
}

// Write routes file
let routesStr = '';
let routes = {};
let indexRoutes = [];
let loginRoutes = [];

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

    // pages/XXX/XXX/index.vue
    if (val === 'index.vue') {
        let path = '/' + tmpPath.replace(/\/index.vue$/, '');
        let nList = path.split('/');
        if (!nList || !nList.length || nList.length > 3) {
            return;
        }

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
        
        let parent = nList[1];
        pushRoute(fPath, tmpPath, name, parent);
    }
});


let _routes = '';
for(let key in routes) {
    let _k = routes[key];
    _routes += `{name: '${_k.name}', path: '${_k.path}', component: ${_k.component}`;
    _k.alias && (_routes += `, alias: '${_k.alias}'`);

    if (!_k.children || !_k.children.length) {
        _routes += '},';
        continue;
    }

    _routes += ', children: [';
    _k.children.forEach(_kr => {
        _routes += `{name: '${_kr.name}', path: '${_kr.path}', component: ${_kr.component}`;
        _kr.alias && (_routes += `, alias: '${_kr.alias}'`);
        _routes += '},';
    });
    _routes += ']},';
}

routesStr += `export default { routes: [${_routes}],`;
routesStr += `indexLayoutRoutes: ${JSON.stringify(indexRoutes)}, loginRoutes: ${JSON.stringify(loginRoutes)}}`;

fs.writeFileSync(routesPath, routesStr);



function pushRoute(fPath, tmpPath, name, parent) {
    let file = fs.readFileSync(fPath);

    if (file.indexOf('/**  vite-wallet ') === 0) {
        let settingStrArr = file.toString().match(/^\/\*\*\s{2}vite-wallet (\w*\-*\w*\s*)* \*\//);

        if (settingStrArr && settingStrArr.length) {
            let setting = settingStrArr[0].split(' ');
            setting.forEach((item) => {
                if (item === 'index-layout') {
                    indexRoutes.push(name);
                } else if (item === 'login') {
                    loginRoutes.push(name);
                } else if (item.indexOf('name') === 0) {
                    let _n = item.slice(5);
                    name = _n || name;
                }
            });
        }        
    }

    let list = name.split('-');
    if (!list || !list.length) {
        return;
    }

    let pageComName;
    let _route = {};
    list = list.splice(0, 2);

    list.forEach((n) => {
        if (pageComName) {
            _route.alias = `/${n}`;
            return;
        }

        pageComName = n;
        routesStr += `import ${pageComName} from \'pages/${tmpPath}\';`;
        _route.name = pageComName;
        _route.path = `/${pageComName}`;
        _route.component = pageComName;
    });

    // children
    if (parent !== pageComName) {
        routes[parent] = routes[parent] || {};
        routes[parent].children = routes[parent].children || [];
        routes[parent].children.push(_route);
        return;
    }

    // parent
    if (routes[parent]) {
        routes[parent].name = routes[parent].name || _route.name;
        routes[parent].path = routes[parent].path || _route.path;
        routes[parent].alias = routes[parent].alias || _route.alias;
        routes[parent].component = routes[parent].component || _route.component;
    } else {
        routes[parent] = _route;
    }
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