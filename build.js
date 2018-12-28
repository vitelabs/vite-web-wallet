var fs = require('fs');
var path = require('path');

console.log(`Write netlifyConf ${process.env.NODE_ENV}`);

var redirect = process.env.NODE_ENV === 'test' ? 
    path.join(__dirname, 'netlifyConf/_redirects_test') :
    path.join(__dirname, 'netlifyConf/_redirects');
var staticPath = path.join(__dirname, 'static');

var result = fs.existsSync(staticPath);
// Not exists
if (!result) {
    console.error(new Error(`${staticPath}     is not exists.`));
    return ;
}

fs.writeFileSync(path.join(staticPath, '_redirects'), fs.readFileSync(redirect));
