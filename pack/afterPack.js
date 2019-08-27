const StartTime = new Date().getTime();

const fs = require('fs');
const path = require('path');
const { staticPath } = require('./config.js');
const { copyDir, buildLog } = require('./tools.js');

// StaticDir is not exists
const result = fs.existsSync(staticPath);
if (!result) {
    console.error(new Error(`${ staticPath } is not exists. \n`));
    return;
}


// 1. Netlify config File => dist
const netlifyConfFileName = `_redirects${ process.env.NODE_ENV === 'test' ? '_test' : '' }`;

buildLog(`Start packing ${ netlifyConfFileName }`);

const redirect = path.join(__dirname, `./netlifyConf/${ netlifyConfFileName }`);
fs.writeFileSync(path.join(staticPath, '_redirects'), fs.readFileSync(redirect));

buildLog(`Finish packing ${ netlifyConfFileName }`);


// 2. TradingView File (charting_library) => dist
buildLog('Start packing charting_library');

const chartPath = path.join(__dirname, '../charting_library');
const chartStaticPath = path.join(staticPath, '/charting_library');
copyDir(chartPath, chartStaticPath);

buildLog('Finish packing charting_library');


// 3. Static Pages => dist
buildLog('Start packing staticPages');

const staticPagesPath = path.join(__dirname, '../staticPages');
copyDir(staticPagesPath, staticPath);

buildLog('Finish packing staticPages');


const FinishTime = new Date().getTime();
console.log(`\n Finish AfterPack, Time: ${ FinishTime - StartTime }ms \n`);
