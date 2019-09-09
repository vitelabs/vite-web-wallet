const path = require('path');
const initRoutes = require('./initRoutes');
const { buildLog } = require('../tools.js');

const StartTime = new Date().getTime();


// 1. Init PC Router
buildLog('Start Init PC Router');

const PCRouterConfig = require('../../srcPC/router/config.js');
const PCProjectPath = path.resolve(__dirname, '../../srcPC');
initRoutes(PCProjectPath, PCRouterConfig);

buildLog('Finish Init PC Router');


// 2. Init Mobile Router
buildLog('Start Init H5 Router');

const H5RouterConfig = require('../../srcH5/router/config.js');
const H5ProjectPath = path.resolve(__dirname, '../../srcH5');
initRoutes(H5ProjectPath, H5RouterConfig);

buildLog('Finish Init H5 Router');


// Finish PrePack
const FinishTime = new Date().getTime();
console.log(`\n Finish PrePack, Time: ${ FinishTime - StartTime }ms \n`);
