const StartTime = new Date().getTime();

const fs = require('fs');
const path = require('path');
const { staticPath, mobileStaticPath } = require('./config.js');
const { copyDir, buildLog } = require('./tools.js');

const isH5 = process.env.isH5 === 'true';
const _staticPath = isH5 ? mobileStaticPath : staticPath;

// StaticDir is not exists
const result = fs.existsSync(_staticPath);
if (!result) {
    console.error(new Error(`${ _staticPath } is not exists. \n`));
    return;
}


// 1. Netlify config File => dist
const netlifyConfFileName = `_redirects${ process.env.NODE_ENV === 'test' ? '_test' : '' }`;

buildLog(`Start packing ${ netlifyConfFileName }`);

const redirect = path.join(__dirname, `./netlifyConf/${ netlifyConfFileName }`);
fs.writeFileSync(path.join(_staticPath, '_redirects'), fs.readFileSync(redirect));

buildLog(`Finish packing ${ netlifyConfFileName }`);


// 2. TradingView File (charting_library) => dist
!isH5 && copyChart();


// 3. Static Pages => dist
!isH5 && copyStaticPages();

const FinishTime = new Date().getTime();
console.log(`\n Finish AfterPack, Time: ${ FinishTime - StartTime }ms \n`);


function copyChart() {
    buildLog('Start packing charting_library');

    const chartPath = path.join(__dirname, '../charting_library');
    const chartStaticPath = path.join(_staticPath, '/charting_library');
    copyDir(chartPath, chartStaticPath);

    buildLog('Finish packing charting_library');
}

function copyStaticPages() {
    buildLog('Start packing staticPages');

    const staticPagesPath = path.join(__dirname, '../staticPages');
    copyDir(staticPagesPath, staticPath);

    buildLog('Finish packing staticPages');
}
