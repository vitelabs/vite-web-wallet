var fs = require('fs');
var path = require('path');

var redirect = path.join(__dirname, '_redirects');
var staticPath = path.join(__dirname, 'static');

var result = fs.existsSync(staticPath);
// Not exists
if (!result) {
    console.error(new Error(`${staticPath}     is not exists.`));
    return ;
}

fs.writeFileSync(path.join(staticPath, '_redirects'), fs.readFileSync(redirect));
