module.exports = {
    lang: 'English',

    start: 'Start',
    logout: 'Logout',

    firstNotice: {
        title: 'Read Before Use',
        text1: 'Please be sure to backup your seed phrase when creating account. We cannot guarantee to restore your assets in case of you visit scam sites or lose your backups.',
        text2: 'Noted that our site don\'t reserve your private key or seed phrase. Therefore, you need to restore your account via seed phrase if you decide to change browser, clear local cookies or even replace your PC.',
        text3: 'Please make sure that the seed phrase is a hundred percent correct if you choose to restore address with it. Otherwise, any tiny little difference will lead to the result that your address cannot be restored successfully.',
        text4: 'The current version of wallet is preview version, the Vite test tokens you obtained is only for testing and has no any actual value. Meanwhile, the official will occasionally clear test tokens.'
    },
    test: { // [TODO]
        t: 'Preview Version',
        txt1: 'Vite’s Web wallet is a lightweight-node wallet.',
        txt2: 'Now, it can generate account based on DAG ledger, check account balance, send and receive transactions in default mode, acquire test tokens, check tokens issued by system and etc.',
        txt3: 'Support finding the mnemonic seed phrase of account and login by importing keystore file.',
        v: 'Current version: 1.0.2'
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
            token: 'VV test tokens have be sent to your account, please check your account!',
            tErr: 'Get test token failed!',
            low: 'Insufficient account balance',
            wrong: 'Wrong Password!',
            amount: 'Amount must be greater than 0',
            punctuation: 'Punctuations are not allowed!',
            rename: 'Rename failed',
            copy: 'Successfully copied'
        },
        quota: {
            title: 'Insufficient Quota',
            describe: 'Not available to send a transaction due to lack of quota, please delete descriptive text and run PoW, or gain quota by staking token to resume.',
            left: 'Run PoW',
            right: 'Stake VITE'
        },
        trans: {
            powErr: 'Error occurs when running PoW, please try again',
            powTransErr: 'Insufficient quota of PoW, we\'d recommend that you stake VITE to obtain quota.',
            err: 'Error occurs in transaction, please try again'
        }
    },


    quota: {
        title: 'Get Quota',
        help: {
            title: 'Quick understanding of quota'
        },
        myQuota: 'My Quota',
        maxTxNum: 'Maximum number of Txs',
        beneficialAddr: 'Profit Address',
        fromAddr: 'Deduction address',
        amount: 'Staking amount',
        time: 'Staking frozen duration',
        aboutDays: 'About 3 days',
        btn: 'Submit Staking',
        myQuotaList: 'My Staking List',
        amountPlaceholder: 'Please input staking amount, minimum 10 VITE',
        addrPlaceholder: 'Please input quota receiving address',
        cancelAmount: 'Please input withdraw amount',
        pledgeSuccess: 'Successfully Submitted',
        pledgeFail: 'Failed to Submit',
        canclePledgeSuccess: 'Successful',
        canclePledgeFail: 'Failed',
        limitAmt: 'Staking amount should not be less than 10.',
        maturity: 'Staking has expired!',
        maxAmt: 'Receiving amount between 0~{amount}”, the current maximum amount is {amount}',
        confirm: {
            help: {
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
            total: 'Staking {amount} VITE in total',
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
        valid: {
            addr: 'Address format error',
            bal: 'Insufficient balance',
            pswd: 'Password error',
            amt: 'Amount format error',
            succ: 'Transaction successful!'
        },
        timestamp: 'Timestamp',
        tAddress: 'Address',
        tAddr: 'Address',
        sum: 'Amount',
        tDetail: 'Transaction Detail'
    },

    // SBP
    SBP: { // [TODO]
        title: 'SBP Registration',
        edit: '编辑',
        reward: '提取奖励',
        register: '注册SBP',
        cancel: '撤销注册SBP',
        help: {
            title: 'About SBP',
            text: 'SBP（Snapshot Block Producer）is a node that packs snapshot block, each round  是打包快照块的节点，每一轮75秒时间内25个SBP轮流出块。SBP经过投票产生，打包一个快照块将获得0.9482 VITE。'
        },
        confirm: {
            title: '注册SBP候选节点',
            describe: '提交注册后，当前地址的 {amount} VITE将被锁定约90天，解锁后金额将退回抵押地址',
            leftBtn: '暂不注册',
            rightBtn: '确认注册',
            edit: {
                title: '更换出块地址',
                placeholder: '请输入新的出块地址',
                btn: '确认修改'
            },
            reward: {
                title: '提取出块奖励',
                placeholder: '请输入接收出块奖励地址',
                btn: '提取奖励'
            }
        },
        section1: {
            title: '提交注册',
            nodeName: '节点名称',
            producerAddr: '出块地址',
            quotaAddr: '抵押地址',
            quotaTime: '抵押周期',
            allReward: '全部可提取的出块奖励',
            time: '7776000个快照块（约90天）',
            quotaAmount: '抵押金额',
            confirmBtn: '提交注册',
            namePlaceholder: '请输入节点名称',
            nameHint: '40个字符以内, 支持大小写英文字母、数字、\'_\'、\'.',
            nameErr: '节点名称不合法',
            nameUsed: '此节点名称已被注册',
            addrPlaceholder: '请输入快照块出块地址',
            addrHint: '出块地址必须是全节点地址且保持运行状态',
            addrErr: '出块地址不合法',
            addrUsed: '此出块地址已被使用',
            registerSuccess: '注册请求已发出',
            registerFail: '注册请求失败'
        },
        section2: {
            title: '注册信息',
            updateSuccess: '修改请求已发送',
            updateFail: '修改请求发送失败',
            rewardSuccess: '提取奖励请求已发送',
            rewardFail: '提取奖励请求发送失败',
            allReward: '全部可提取的出块奖励',
            nowReward: '本次可提取的快照块高度范围及奖励金额',
            rewardAddr: '提取奖励地址',
            section2: {
                title: '注册信息',
                cancelSuccess: '撤销请求已发送',
                cancelFail: '撤销请求发送失败'
            },
            cancelConfirm: {
                title: '撤销注册SBP',
                describe: '撤销后您的抵押金额将退回抵押地址；若想成为SBP，您需重新提交注册申请'
            }
        }
    },

    // vote
    vote: { // [TODO]
        title: '投票',
        help: {
            title: '了解投票与投票收益',
            text: '您可以参与投票选出共25个SBP（Snapshot Block Producer），每轮投票时间共75秒，您的投票数为投票地址所拥有的VITE数量，默认为您保持上一轮的投票意向；得票量排名前25名的候选节点将当选SBP。',
        },
        section1: {
            title: '我的投票',
            head: ['节点名称', '节点状态', '当前投票数', '投票状态', '操作'],
            nodeStatusMap: {
                1: '注册中',
                2: '取消注册'
            },
            voteStatusMap: {
                voted: '已投票',
                voting: '正在投票中',
                canceling: '撤销中',
                voteNoWork: '投票作废'
            },
            hoverHelp: '您投票的{nodeName}已经取消注册，您可以直接重新投票、或者撤销投票；如果您不重新投票或撤销投票，{nodeName}重新注册后，您原来的投票将恢复生效。',
            confirm: {
                title: '撤销投票',
                cancelText: '确认撤销',
                submitText: '暂不撤销'
            },
            toast: '撤销投票请求已发送',
            quotaConfirm: {
                title: '配额不足',
                content: '当前配额不足，无法进行撤销，您需要抵押vite配额获取配额才可以投票',
                cancelText: '暂不投票',
                submitText: '获取配额'
            },
            operate:'撤销投票',
            operateBtn:'撤销'
        },

        section2: {
            title: '候选节点列表',
            head: ['节点名称', '出块地址', '当前投票数', '操作'],
            confirm: {
                normal: {
                    title: '投票',
                    cancelText: '暂不投票',
                    submitText: '确认投票',
                    content: ''
                },
                cover: {
                    title: '投票',
                    content: '您已经投过票，再次投票将会覆盖上一次投票',
                    cancelText: '取消覆盖',
                    submitText: '确认覆盖'
                }
            },
            toast: '投票请求已发送',
            quotaConfirm: {
                title: '配额不足',
                content: '当前配额不足，无法进行投票，您需要抵押vite配额获取配额才可以投票',
                cancelText: '暂不投票',
                submitText: '获取配额'
            },
            noSearchData:'无结果，换个输入试试',
            noData:'暂无数据',
            operate:'投票',
            operateBtn:'投票'
        }
    },


    pwdConfirm: {   // [TODO]
        conf: '开启5分钟内免密操作',
        title: '输入钱包密码',
        placeholder: '请输入钱包密码'
    },

    quotaConfirm: {
        title: '配额不足',
        describe: '当前配额不足，无法进行{operate}，您需要抵押VITE获取配额才可以{operate}',
        leftBtn: '暂不{operate}',
        rightBtn: '获取配额'
    },

    //common
    pow: 'Running PoW...',
    btn: {
        create: 'Create',
        cancel: 'Cancel',
        login: 'Login',
        imported: 'Import Account',
        back: 'Back',
        submit: 'Submit',
        next: 'Next Step',
        understand: 'I understand'
    },
    paging: {
        pre: 'Prev',
        next: 'Next',
        first: 'First',
        last: 'Last',
    },
    hint: {
        create: 'Creation failed',
        logoutErr: 'Logout Error!',
        pwErr: 'Incorrect password!',
        acEmpty: 'Account cannot be empty!',
        pwEmpty: 'Password cannot be empty!',
        noData: 'No Data',
        err: 'Oops, error occurs'
    }
};
