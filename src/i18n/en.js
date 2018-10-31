module.exports = {
    lang: 'English',

    start: 'Start',
    logout: 'Logout',

    firstNotice: {
        title: 'Read Before Use',
        text1: 'Please be sure to backup your seed phrase when creating account. We cannot guarantee to restore your assets in case of you visit scam sites or lose your backups.',
        text2: 'Noted that our site don\'t reserve your private key or seed phrase. Therefore, you need to restore your account via seed phrase if you decide to change browser, clear local cookies or even replace your PC.',
        text3: 'Please make sure that the seed phrase is a hundred percent correct if you choose to restore address with it. Otherwise, any tiny little difference will lead to the result that your address cannot be restored successfully.',
        text4: 'The current version of wallet is preview version, the Vite test tokens you obtained is only for testing and has no any actual value. Meanwhile, the official will occasionally clear test tokens.',
        btn: 'I understand'
    },

    mnemonic: {
        title: 'Mnemonic',
        restore: 'Restore Account by Seed Phrase',
        record: 'Backup Seed Phrase',
        prompt: 'Mnemonic seed phrase is used to restore your wallet, better write it down and keep it in a safe place where only you can access, otherwise your assets will be at tremendous risks.',
        placeholder: 'Please input your mnemonic seed phrase',
        empty: 'The input of seed phrase cannot be empty',
        error: 'Incorrect seed phrase. Try again',
        hint: 'Mnemonic format: words, spaces, words... spaces, words.',
        netErr: 'The full node is abnormal, please try again later.'
    },

    setting: {
        title: 'Settings',
        unlock: 'Unlock Secure Information',
        lang: 'Language',
        block: 'Current Height',
        version: 'Version',
        service: 'Customer Service',
        site: 'Official Website of Vite',
        sys: 'System Portal',
        open: 'Vite Github'
    },

    nav: {
        home: 'Home',
        head: {
            title: 'Account',
            create: 'Create',
            imported: 'Import',
            backup: 'Back Up',
            setting: 'Setting Account',
            reset: 'Account Reset',
            login: 'Log in'
        },
        sync: 'Wallet initializing, transactions cannot be made temporarily.',
        noNet: 'No network detected',
        noP2P: 'Unable to connect to other nodes',
        firstDone: 'Init Done',
        firstDoing: 'Initializing',
        blockHeight: 'Snapshot Block Height'
    },
    test: {
        t: 'Preview Version',
        txt1: 'Vite’s Web wallet is a lightweight-node wallet.',
        txt2: 'Now, it can generate account based on DAG ledger, check account balance, send and receive transactions in default mode, acquire test tokens, check tokens issued by system and etc.',
        txt3: 'Support finding the mnemonic seed phrase of account and login by importing keystore file.',
        v: 'Current version: Preview Version'
    },

    // account list
    accList: {
        balance: 'Balance',
        addAcc: 'Add Account',
        addr: 'Address Lists of Accounts',
        addrList: 'Address List',
        default: 'Select Default User'
    },

    //create account
    create: {
        accName: 'Account name',
        input: 'Please input password',
        again: 'Please input password again!',
        choose: 'Choose account',
        finish: 'Done',
        hint: {
            nameInput: 'Please input account name',
            nameLong: 'Account name cannot exceed 32 characters!',
            long: 'Your input cannot exceed 32 characters!',
            name: 'Account name only supports Chinese, English, numbers and underscores',
            consistency: 'Please enter the same password!',
            pwFormat: 'Wrong password format. The password only supports English, half-width symbols, numbers.',
            save: 'Your private key stored in {0}，please keep it carefully，your account and password cannot be retrieved at current version!'
        }
    },
    dragDrop: {
        text: 'Drag and drop files there',
        err1: 'Imported illegal file!',
        err2: 'Only one file can be imported!',
        guide: 'Open folder to import',
        hint: 'Noted that login by importing keystore file cannot support creating multi addresses, using mnemonic seed phrase is recommended in cross-platform situations.'
    },

    // account detail
    accDetail: {
        title: 'Account Detail',
        transfer: 'Transfer',
        getTestToken: 'Get Test Tokens',
        transDetail: 'More Transaction Details',
        name: 'Account Name',
        address: 'My Address',
        balance: 'Balance',
        fundFloat: 'Unreceived',
        pend: 'Pending',
        copy: 'Copy Address',
        outAddress: 'My Address',
        inAddress: 'Receive Address',
        sum: 'Amount',
        password: 'Password',
        saveQrcode: 'Save QR code image',
        sendTrans: 'Send Transaction',
        remarks: 'Comment',
        placeholder: {
            amount: 'Please input amount',
            remarks: 'Please input comments',
            addr: 'Please input address'
        },
        valid: {
            remarksFormat: 'Format error! Remarks can only contain Chinese, English and punctuations.',
            remarksLong: 'Notes do not exceed 180 English characters (or punctuations, 1 Chinese character = 6 English characters)'
        },
        hint: {
            token: 'VITE test tokens have be sent to your account, please check your account!',
            tErr: 'Get test token failed!',
            low: 'Insufficient account balance',
            wrong: 'Wrong Password!',
            amount: 'Amount must be greater than 0',
            punctuation: 'Punctuations are not allowed!',
            rename: 'Rename failed',
            copy: 'Successfully copied'
        },
        quota: {
            title: 'Insufficient TPS Quota',
            describe: 'Not available to send a transaction due to lack of quota, please delete descriptive text and run PoW, or gain quota by staking token to resume.',
            left: 'Run PoW',
            right: ' Token staking for TPS quota'
        },
        trans: {
            powErr: 'Error occurs when running PoW, please try again',
            powTransErr: 'Insufficient quota of PoW, we\'d recommend that you stake VITE to obtain quota.',
            err: 'Error occurs in transaction, please try again'
        }
    },

    pow: 'Running PoW...',

    quota: {
        title: 'Get Quota',
        Q1: 'Quick understanding of quota',
        myQuota: 'My Quota',
        maxTxNum: 'Maximum number of Txs',
        toAddr: 'Profit address',
        fromAddr: 'Deduction address',
        amount: 'Staking amount',
        time: 'Staking frozen duration',
        aboutDays: 'About 3 days',
        btn: 'Submit staking',
        myQuotaList: 'My Staking List',
        amountPlaceholder: 'Please input staking amount, minimum 10 VITE',
        addrPlaceholder: 'Please input quota receiving address',
        cancelAmount: 'Please input withdraw amount',
        pledgeSuccess: 'Staking Successful',
        pledgeFail: 'Staking Failed',
        canclePledgeSuccess: 'Cancel Successful',
        canclePledgeFail: 'Cancel Failed',
        limitAmt: 'Staking amount should not be less than 10.',
        maturity: 'Staking has expired!',
        maxAmt: 'Receiving amount between 0~{amount}”, the current maximum amount is {amount}',
        confirm: {
            help: {
                btn: 'I understand',
                t1: 'What is quota? ',
                txt1: 'In the Vite system, users do not purchase the gas required for a transaction by paying a fee, but acquire the computing resource through a quota-based model. Required quota for sending a transaction = the basic quota (request) + quota ( The attached text data), Quota required to accept a transaction = the basic quota (response). This quota-based resource configuration protocol allows users to obtain higher resource quotas in two ways: Staking VITE to obtain quotas and run PoW.',
                t2: 'What is staking?',
                txt2: 'In the Vite system, the user can stake VITE to obtain a certain amount of quota, the minimum value of the staking is 10 VITE, there is no maximum limit; meanwhile, Vite system also support that the A-address stakes a part of the VITE and allocates the obtained quota to the B address; When users apply to stake, The VITE will be sent to the smart contract address instead of some user, and only the user who apply for staking has access to manage the staking amount.',
                t3: 'What is PoW?',
                txt3: 'Proof of Work (PoW), to be brief is a protocol to confirm that you have done a certain amount of work, also it is an economic measure to deter DDoS attacks and other service abuse. It requires the initiator to conduct a certain amount of computing, which means that it may take some time for the computer; in the Vite system, Users can obtain a free quota by running the PoW, and also can send a transaction without any annotated information through obtained quota.'
            },
            cancel: {
                title: 'Withdrawal of staked token',
                describe: 'Your current staked amount is {amount} VITE, please confirm to withdraw.',
                placeholder: 'Please input withdraw amount',
                rightBtn: 'Ready to go',
                leftBtn: 'Cancel withdraw'
            },
            submit: {
                title: 'Submit Staking',
                describe: 'Make sure to stake {amount} VITE to obtain quota, you cannot withdraw until about 3 days after staking comes into effect.',
                rightBtn: 'Confirm',
                leftBtn: 'Cancel'
            }
        },
        list: {
            title: 'My Staking List',
            total: 'Staked {amount} VITE in total',
            beneficialAddr: 'Profit Address',
            amount: 'Amount',
            withdrawHeight: 'Matured snapshot height',
            withdrawTime: 'Expected due date',
            cancel: 'Withdrawal of staked token',
            operate: 'Operation',
            unexpired: 'Temporarily cannot make withdrawal of staked token until due date'
        }
    },

    // Transaction List
    transList: {
        title: 'Transactions',
        tType: {
            title: 'Type',
            symbol: 'Type',
            send: 'Send',
            receive: 'Receive',
        },
        status: {
            title: 'Status',
            unconfirmed: 'Unconfirmed',
            confirms: 'Confirming',
            confirmed: 'Confirmed',
        },
        valid:{
            addr:'Address format error',
            bal:'Insufficient balance',
            pswd:'Password error',
            amt:'Amount format error',
            succ:'Transaction successful!',
            err: 'Oops, error occurs'
        },
        timestamp: 'Timestamp',
        tAddress: 'Address',
        tAddr: 'Address',
        sum: 'Amount',
        tDetail: 'Transaction Detail'
    },

    tabel: {
        noData: 'No Data'
    },

    //common
    btn: {
        create: 'Create',
        cancel: 'Cancel',
        login: 'Login',
        imported: 'Import Account',
        back: 'Back',
        submit: 'Submit',
        next: 'Next Step',
    },
    paging: {
        pre: 'Prev',
        next: 'Next',
        first: 'First',
        last: 'Last',
    },
    hint:{
        create: 'Creation failed',
        logoutErr: 'Logout Error!',
        pwErr: 'Incorrect password!',
        acEmpty: 'Account cannot be empty!',
        pwEmpty: 'Password cannot be empty!'
    }
};
