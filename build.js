var fs = require('fs');
var path = require('path');

console.log(`Write _redirects ${process.env.NODE_ENV}`);

var redirect = process.env.NODE_ENV === 'test' ? 
    path.join(__dirname, 'redirects/_redirects_test') :
    path.join(__dirname, 'redirects/_redirects');
var staticPath = path.join(__dirname, 'static');

var result = fs.existsSync(staticPath);
// Not exists
if (!result) {
    console.error(new Error(`${staticPath}     is not exists.`));
    return ;
}

fs.writeFileSync(path.join(staticPath, '_redirects'), fs.readFileSync(redirect));
