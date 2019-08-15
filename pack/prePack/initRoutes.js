const fs = require('fs');
const path = require('path');
const { traversingDir, cleanFile } = require('../tools.js');


module.exports = function (ProjectPath, routeConfig) {
    const PagesPath = path.join(ProjectPath, '/pages');
    const RouterPath = path.join(ProjectPath, '/router');
    const RoutesPath = path.join(RouterPath, '/routes.js');

    cleanFile(RoutesPath);

    const { pagePaths, routes } = getRoutes(PagesPath);

    // Write vue-router config file
    const routesStr = getRoutesFile(pagePaths, routes, routeConfig);
    fs.writeFileSync(RoutesPath, routesStr);
};


function getRoutes(PagesPath) {
    const pagePaths = {};
    const routes = {};

    traversingDir(PagesPath, (pagePath, next, val) => {
        const stats = fs.statSync(pagePath);

        if (stats.isDirectory()) {
            next(pagePath);
            return;
        }

        if (!stats.isFile()) {
            return;
        }

        // `pagePath` is a file, now.
        const tmpPath = pagePath.split('pages/')[1];

        // pages/XXX.vue
        if (tmpPath === val && val.indexOf('.vue') === val.length - 4) {
            const name = val.replace('.vue', '');
            (name !== 'index') && pushRoute({ pagePath, name }, { pagePaths, routes });
            return;
        }

        if (val !== 'index.vue') {
            return;
        }

        // pages/XXX/XXX/index.vue
        const path = tmpPath.replace(/\/index.vue$/, '');
        const nList = path.split('/');

        // Max: secondary route
        if (!nList || !nList.length || nList.length > 2) {
            return;
        }

        // Camel-Case
        let name = '';
        nList.forEach(n => {
            if (!name) {
                name += n;
                return;
            }
            name += (n ? n[0].toLocaleUpperCase() + n.slice(1) : '');
        });

        pushRoute({
            pagePath,
            name,
            parent: nList[0]
        }, { pagePaths, routes });
    });

    return { pagePaths, routes };
}

function pushRoute({ pagePath, name, parent }, { pagePaths, routes }) {
    if (!name) {
        return;
    }

    pagePaths[name] = pagePath;

    const _route = {
        name,
        pagePath,
        path: `/${ name }`,
        component: name
    };

    // _route is children, push children
    if (parent && parent !== name) {
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

function getRoutesFile(pagePaths, routes, routeConfig) {
    let routesStr = '';

    // Import page files
    for (const key in pagePaths) {
        routesStr += `import ${ key } from \'${ pagePaths[key] }\';`;
    }

    // Write router config
    let _routes = '';
    for (const key in routes) {
        const _k = routes[key];

        _routes += `{${ getARouterStr(key, _k, routeConfig) }`;
        if (!_k.children || !_k.children.length) {
            _routes += '},';
            continue;
        }

        // if have children router
        _routes += ', children: [';

        _k.children.forEach(_kr => {
            _routes += `{name: '${ _kr.name }', path: '${ routeConfig.prePath || '' }${ _kr.path }', component: ${ _kr.component }`;
            let alias = routeConfig[_kr.name] && routeConfig[_kr.name].alias ? routeConfig[_kr.name].alias : _kr.alias;
            if (typeof alias === 'string') {
                alias = `${ routeConfig.prePath || '' }${ alias }`;
            } else if (alias) {
                alias.forEach((_a, i) => {
                    alias[i] = `${ routeConfig.prePath || '' }${ _a }`;
                });
            }
            alias && (_routes += `, alias: ${ JSON.stringify(alias) }`);
            _routes += '},';
        });

        _routes += ']},';
    }

    _routes += `{ path: \'/${ routeConfig.prePath || '' }\', redirect: \'/${ routeConfig.prePath || '' }/index\' },{ path: \'*\', redirect: \'${ routeConfig.prePath || '' }/notFound\' }`;

    routesStr += `export default { routes: [${ _routes }] }`;
    return routesStr;
}

function getARouterStr(key, router, routeConfig) {
    let str = `name: '${ router.name }', path: '${ routeConfig.prePath || '' }${ router.path }', component: ${ router.component }`;

    let alias = routeConfig[key] && routeConfig[key].alias ? routeConfig[key].alias : router.alias;
    if (typeof alias === 'string') {
        alias = `${ routeConfig.prePath || '' }${ alias }`;
    } else if (alias) {
        alias.forEach((_a, i) => {
            alias[i] = `${ routeConfig.prePath || '' }${ _a }`;
        });
    }
    alias && (str += `, alias: ${ JSON.stringify(alias) }`);

    return str;
}
