module.exports = {
    lang: 'English',

    start: 'Start',

    mnemonic: {
        title:'Mnemonic',
        restore: 'Restore Account by Seed Phrase',
        record: 'Backup Seed Phrase',
        prompt: 'Mnemonic seed phrase is used to restore your wallet, better write it down and keep it in a safe place where only you can access, otherwise your assets will be at tremendous risks',
        placeholder:'Please input your mnemonic seed phrase',
        empty: 'The input of seed phrase cannot be empty',
        error: 'Incorrect seed phrase. Try again'
    },

    setting: {
        title: 'Settings',
        unlock: 'Unlock Secure Information',
        lang: 'Language',
        block: 'Latest Block Height',
        version: 'Version',
        service: 'Customer Service',
        site: 'Official Website of Vite',
        sys: 'System Portal',
        open: 'Open source projects of Vite',
    },

    nav: {
        home: 'Home',
        head: {
            title: 'Account',
            create: 'Create',
            imported: 'Import',
            backup: 'Back Up',
            setting: 'Setting Account',
            login: 'Login Account'
        },
        sync: 'Wallet initializing, transactions cannot be made temporarily.',
        noNet: 'No network detected',
        noP2P: 'Unable to connect to other nodes',
        firstDone: 'Init Done',
        firstDoing: 'Initializing',
        blockHeight: 'Snapshot Block Height'
    },
    test:{  // [TODO] Need to update ?????
        t: 'Preview Version',
        txt1: 'Vite wallet is full node wallet in preview version, it achieves the functions of generating accounts in DAG ledger structure, searching balance, sending and receiving default transactions as well as getting test token.',
        txt2: 'Accounts are not supported importing private keys for now, please kindly keep your account files and passwords',
        v: 'Current version: Preview Version'
    },

    // account list
    accList: {
        balance: 'Balance',
        addAcc: 'Add Account',
        addr: 'Address Lists of Accounts',
        default: 'Select Default User'
    },

    //create account
    create: {
        accName: 'Account name',
        input: 'Please input password',
        again: 'Please input password again!',
        choose: 'Choose account',
        finish: 'Finish',
        hint: {
            nameInput: 'Please input account name',
            nameLong: 'Account name cannot exceed 32 characters!',
            long: 'Your input must between 1-32 characters!',
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
        guide: 'Open folder to import'
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
        fundFloat: 'Fund in Float',
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
            remarksLong: 'Comment is too long! The input length should be within 180 English characters (or punctuations, 1 Chinese character = 6 English character)'
        },
        hint: {
            token: 'Test tokens have be sent to your account, please check your account!',
            tErr: 'Get test token failed!',
            low: 'Insufficient account balance',
            wrong: 'Wrong Password!',
            amount: 'Amount must be greater than 0',
            punctuation: 'Punctuations are not allowed!',
            rename: 'Rename failed',
            copy: 'Successfully copied'
        }
    },

    // Transaction List
    transList: {
        title: 'Transaction Records',
        tType: {
            title: 'Transaction Type',
            send: 'Send',
            receive: 'Receive',
        },
        status: {
            title: 'Status',
            unconfirmed: 'Unconfirmed',
            confirms: 'Confirms',
            confirmed: 'Confirmed',
        },
        valid:{
            addr:'Address format error',
            bal:'Insufficient balance',
            pswd:'Password error',
            amt:'Amount format error',
            succ:'Transaction success!',
            err: 'Oops, error occurs'
        },
        timestamp: 'Timestamp',
        tAddress: 'Transaction Side Address',
        sum: 'Amount',
        tDetail: 'Transaction Detail',
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
        pwErr: 'Password Error!',
        acEmpty: 'Account cannot be empty!',
        pwEmpty: 'Password cannot be empty!'
    }
};
