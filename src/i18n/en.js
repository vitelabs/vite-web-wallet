module.exports = {
    lang: 'English',

    start: 'Start',
    logout: 'Logout',

    firstNotice: {
        text1: '创建账户时，请务必备份您的助记词，如果您访问了一个钓鱼网站或者丢失了您的备份，本站无法为您恢复资金。',
        text2: '由于本站不存储你的私钥或助记词，如果您更换浏览器、电脑或者清除浏览器缓存，需要通过备份助记词恢复账号。',
        text3: '如果使用了从助记词恢复地址的方式，请保证助记词绝对正确，如果有细微的不同都可能无法恢复您的地址。',
        text4: '当前版本钱包为预览版，您获得的VITE测试代币仅用于测试，无任何实际价值，同时官方会不定期对测试代币进行清零。',
        btn: 'I understand it'
    },

    mnemonic: {
        title:'Mnemonic',
        restore: 'Restore Account by Seed Phrase',
        record: 'Backup Seed Phrase',
        prompt: 'Mnemonic seed phrase is used to restore your wallet, better write it down and keep it in a safe place where only you can access, otherwise your assets will be at tremendous risks.',
        placeholder: 'Please input your mnemonic seed phrase',
        empty: 'The input of seed phrase cannot be empty',
        error: 'Incorrect seed phrase. Try again',
        hint: 'Mnemonic format: words, spaces, words... spaces, words.',
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
        open: 'Vite Github',
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
            login: 'Login Account'
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
        hint: 'PS Login by loading keystore file doesn’t support creating address, using mnemonic word is recommended when login in multi-platform.'
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
            remarksLong: 'Comment is too long! The input length should be within 180 English characters (or punctuations, 1 Chinese character = 6 English character)'
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
        tAddr: 'Transaction Side',
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
