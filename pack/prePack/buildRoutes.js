const fs = require('fs');
const path = require('path');

const srcWebPath = path.resolve(__dirname, '../../srcWeb/');

// RouteConfig > pageConfig
const routeConfig = require('../../srcWeb/router/config.js');

const routesPath = path.join(__dirname, '../../srcWeb/router/routes.js');
const result = fs.existsSync(routesPath);
// Not exists
if (result) {
    fs.unlinkSync(routesPath);
}

// Write routes file
let routesStr = '';
const routes = {};

traversing(path.join(srcWebPath, '/pages'), (fPath, next, val) => {
    // console.log(fPath);
    const stats = fs.statSync(fPath);

    if (stats.isDirectory()) {
        next(fPath);
        return;
    }

    if (!stats.isFile()) {
        return;
    }

    const tmpPath = fPath.split('srcWeb/pages/')[1];

    // Pages/XXX.vue
    if (tmpPath === val && val.indexOf('.vue') === val.length - 4) {
        const name = val.replace('.vue', '');
        (name !== 'index') && pushRoute(fPath, tmpPath, name, name);
        return;
    }

    if (val !== 'index.vue') {
        return;
    }

    // Pages/XXX/XXX/index.vue
    const path = tmpPath.replace(/\/index.vue$/, '');

    const nList = path.split('/');
    if (!nList || !nList.length || nList.length > 2) {
        return;
    }

    let name = '';
    nList.forEach(n => {
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
for (const key in routes) {
    const _k = routes[key];

    // [TODO] Async Route
    // _routes += `{name: '${ _k.name }', path: '${ _k.path }', component: ()=>import(\'${ _k.pagePath }\')`;
    _routes += `{name: '${ _k.name }', path: '${ _k.path }', component: ${ _k.component }`;

    const alias = routeConfig[key] && routeConfig[key].alias ? routeConfig[key].alias : _k.alias;
    alias && (_routes += `, alias: ${ JSON.stringify(alias) }`);

    if (!_k.children || !_k.children.length) {
        _routes += '},';
        continue;
    }

    _routes += ', children: [';
    _k.children.forEach(_kr => {
        // [TODO] Async Route
        // _routes += `{name: '${ _kr.name }', path: '${ _kr.path }', component: ()=>import(\'${ _kr.pagePath }\')`;
        _routes += `{name: '${ _kr.name }', path: '${ _kr.path }', component: ${ _kr.component }`;
        const alias = routeConfig[_kr.name] && routeConfig[_kr.name].alias ? routeConfig[_kr.name].alias : _kr.alias;
        alias && (_routes += `, alias: ${ JSON.stringify(alias) }`);
        _routes += '},';
    });
    _routes += ']},';
}
_routes += '{ path: \'/\', redirect: \'/index\' },{ path: \'*\', redirect: \'/notFound\' }';
routesStr += `export default { routes: [${ _routes }] }`;

fs.writeFileSync(routesPath, routesStr);


function pushRoute(fPath, tmpPath, name, parent) {
    if (!name) {
        return;
    }

    const _route = {};

    // [TODO] Async Route
    routesStr += `import ${ name } from \'pages/${ tmpPath }\';`;
    _route.pagePath = `pages/${ tmpPath }`;
    _route.name = name;
    _route.path = `/${ name }`;
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

function traversing(startPath, cb) {
    function readdirSync(startPath) {
        const files = fs.readdirSync(startPath);
        files.forEach(val => {
            const fPath = path.join(startPath, val);
            cb && cb(fPath, readdirSync, val);
        });
    }
    readdirSync(startPath);
}
