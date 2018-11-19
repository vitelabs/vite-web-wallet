import start from 'pages/start.vue';
import login from 'pages/login/index.vue';
import importAccount from 'pages/importAccount.vue';
import createAccount from 'pages/createAccount.vue';
import restore from 'pages/restore.vue';
import record from 'pages/record.vue';
import account from 'pages/account/index.vue';
import transList from 'pages/transList.vue';
import setting from 'pages/setting/index.vue';
import quota from 'pages/quota/index.vue';
import SBP from 'pages/SBP/index.vue';
import vote from 'pages/vote/index.vue';

export default [
    {
        name: 'start',
        path: '/start',
        component: start
    },
    {
        name: 'login',
        path: '/login',
        component: login
    },
    {
        name: 'restore',
        path: '/restore',
        component: restore
    },
    {
        name: 'record',
        path: '/record',
        component: record
    },
    {
        name: 'importAccount',
        path: '/importAccount',
        component: importAccount
    },
    {
        name: 'createAccount',
        path: '/createAccount',
        component: createAccount
    },
    {
        name: 'account',
        path: '/account',
        component: account
    },
    {
        name: 'transList',
        path: '/transList',
        component: transList
    },
    {
        name: 'setting',
        path: '/setting',
        component: setting
    },
    {
        name: 'quota',
        path: '/quota',
        component: quota
    },
    {
        name: 'SBP',
        path: '/SBP', 
        component: SBP
    },
    {
        name: 'vote',
        path: '/vote',
        component: vote
    }
];