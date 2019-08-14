const path = require('path');
const initRoutes = require('./initRoutes');
const { buildLog } = require('../tools.js');

const StartTime = new Date().getTime();


// 1. Init Web Router
buildLog('Start Init Web Router');

const WebRouterConfig = require('../../srcWeb/router/config.js');
const WebProjectPath = path.resolve(__dirname, '../../srcWeb');
initRoutes(WebProjectPath, WebRouterConfig);

buildLog('Finish Init Web Router');


// 2. Init Mobile Router
buildLog('Start Init Mobile Router');

const MobileRouterConfig = require('../../srcMobile/router/config.js');
const MobileProjectPath = path.resolve(__dirname, '../../srcMobile');
initRoutes(MobileProjectPath, MobileRouterConfig);

buildLog('Finish Init Mobile Router');


// Finish PrePack
const FinishTime = new Date().getTime();
console.log(`\n Finish PrePack, Time: ${ FinishTime - StartTime }ms \n`);
