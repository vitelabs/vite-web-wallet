import start from 'pages/start.vue';
import login from 'pages/login.vue';
import importAccount from 'pages/importAccount.vue';
import createAccount from 'pages/createAccount.vue';
import restore from 'pages/restore.vue';
import record from 'pages/record.vue';
import account from 'pages/account/index.vue';
import transaction from 'pages/transaction.vue';

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
        path: '/record:entropy',
        component: record
    },
    {
        name: 'importAccount',
        path: '/importAccount:from',
        component: importAccount
    },
    {
        name: 'createAccount',
        path: '/createAccount:from',
        component: createAccount
    },
    {
        name: 'account',
        path: '/account',
        component: account
    },
    {
        name: 'transaction',
        path: '/transaction/:address',
        component: transaction
    }
];