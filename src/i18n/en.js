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
            // [TODO] 备注请勿超出180个英文字符（或标点符号，一个汉字=6个英文字符）
            remarksLong: 'Notes do not exceed 180 English characters (or punctuations, 1 Chinese character = 6 English character)'
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
        quota: {  // [TODO]
            title: '配额不足',
            describe: '配额不足，无法进行交易，您需要删除描述文字并运行pow 或 抵押配额才可以继续转账',
            left: '运行pow',
            right: '抵押配额'
        },
        trans: {    // [TODO]
            powErr: '运行POW错误，请重新发起转账',
            powTransErr: 'pow获取的配额不足，建议您进行抵押VITE获取配额',
            err: '转账发生错误，请重新发起转账'
        }
    },

    pow: '运行POW...',  // [TODO]

    quota: {  // [TODO]
        title: '获取配额',
        Q1: '快速理解配额',
        myQuota: '我的当前配额',
        maxTxNum: '最大交易数',
        toAddr: '配额收益地址',
        fromAddr: '抵押金额扣除地址',
        amount: '抵押金额',
        time: '抵押锁定时长',
        aboutDays: '约3天',
        btn: '提交抵押',
        myQuotaList: '我的抵押列表',
        amountPlaceholder: '请输入抵押金额，最小10vite',
        addrPlaceholder: '请输入获取配额地址',
        cancelAmount: '请输入取回金额',
        pledgeSuccess: '抵押成功',
        pledgeFail: '抵押失败',
        canclePledgeSuccess: '取消成功',
        canclePledgeFail: '取消失败',
        limitAmt: '抵押金额需填写大于等于10的数字',
        maturity: '抵押已到期',
        maxAmt: '取回金额在0~{amount}之间”，{amount}为当前可取回最大金额',
        confirm: {
            help: {
                btn: '我已了解',
                t1: '什么是配额',
                txt1: '在Vite系统中，用户不是通过支付手续费的方式来购买一次交易所需的燃料，而是通过一种基于配额的模型来获取计算资源，发送交易所需配额=基础配额(请求)+配额(附带的文本资料)，接受交易所需配额=基础配额(响应)。这个基于配额的资源配置协议允许用户通过两种方式来获取更高的资源配额：抵押Vite获取配额、运行Pow',
                t2: '什么是抵押',
                txt2: '在Vite系统中，用户可以抵押vite获取一定数量的配额，抵押最小值为10vite，没有最大抵押上限；同时支持A地址抵押一部分vite并将获得的配额分配给B地址；用户申请抵押后，会将这笔vite发送到智能合约地址而不是某一个用户，且只有申请抵押用户有权限支配抵押的金额；',
                t3: '什么是POW',
                txt3: '工作量证明(Proof Of Work，简称POW)，简单理解就是一份证明，用来确认你做过一定量的工作，应对拒绝服务攻击和其他服务滥用的经济对策。它要求发起者进行一定量的运算，也就意味着需要消耗计算机一定的时间；在VITE系统中，用户可以通过运行POW获得免费的配额，用户可以通过获得的配额进行一次不带任何备注信息的交易；'
            },
            cancel: {
                title: '取回抵押',
                describe: '目前抵押金额为 {amount} VITE，请确认取回金额',
                placeholder: '请输入取回金额',
                rightBtn: '确认取回',
                leftBtn: '暂不取回'
            },
            submit: {
                title: '提交抵押',
                describe: '确认是否抵押 {amount} VITE 获取配额，抵押生效约3天之后才可取回',
                rightBtn: '确认抵押',
                leftBtn: '再等会儿'
            }
        },
        list: {
            title: '我的抵押列表',
            total: '总计抵押 {amount} VITE',
            beneficialAddr: '配额受益地址',
            amount: '抵押金额',
            withdrawHeight: '到期快照高度',
            withdrawTime: '预计到期时间',
            cancel: '取回抵押',
            operate: '操作',
            unexpired: '还未到达取回时间，暂时无法取回抵押'
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
        pwErr: 'Password Error!',
        acEmpty: 'Account cannot be empty!',
        pwEmpty: 'Password cannot be empty!'
    }
};
