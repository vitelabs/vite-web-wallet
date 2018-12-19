module.exports = {
    lang: 'English',

    start: 'Start',
    logout: 'Logout',

    errCode: {
        35003: '{name} ID conflict occurs, please re-submit later',
        35004: 'Built-in contract error, please try again later（35004）',
        35005: 'Transactions are sent too frequent, please try again later',
        35006: 'Built-in contract method not exist, please try again later（35006）',
        36001: 'You cannot make any transfer until you receive a transaction',
        36002: 'System verify failed, please try again later（36002）',
        36003: 'System verify failed, please try again later（36003）',
        36004: 'System verify failed, please try again later（36004）',
        36005: 'napshot block height is illegal, please try again later'
    },

    txType: {
        0: 'SBP Registration',
        1: 'Update Registration',
        2: 'Revoke Registration',
        3: 'Retrieve Reward',
        4: 'Voting',
        5: 'Revoke Voting',
        6: 'Get TPS Quota',
        7: 'Withdrawal of Staking Quota',
        8: 'Token Issuance',
        9: 'Withdrawal of Staking Token',
        10: 'Transfer',
        11: 'Transfer',
        12: 'Transfer',
        13: 'Transfer',
        14: 'Transfer',
        15: 'Transfer'
    },
    
    firstNotice: {
        title: 'Read Before Use',
        text1: 'Please be sure to backup your seed phrase when creating account. We cannot guarantee the restoration of your assets in the instance that you visit a scam site or lose your private keys or seed phrase.',
        text2: 'Please note that our websites do not store your private keys or seed phrase. Therefore, you will need to restore your account via seed phrase if you decide to change browsers, clear local cookies, or change PCs.',
        text3: 'Please take proper precautions in ensuring that you accurately record and safely store your seed phrase. Even the slightest error will result in you not being able to successfully restore your address.',
    },

    test: {
        t: 'Preview Version',
        txt1: 'The preview version of wallet is a lightweight-node wallet officially issued by VITE.',
        txt2: 'The current version supports functions of checking account balance, sending transactions, receiving transactions in default, acquiring test tokens, staking VITE tokens for TPS quota, SBP registration, vote and etc.',
        txt3: 'Support acquiring test tokens and experiencing the product by using them, the test tokens issued by VITE official can be only used for testing and with no actual value, it will be cleared by VITE official sporadically',
        v: 'Current version: {version}'
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
        netErr: 'The full node is abnormal, please try again later.',
        change: 'Switch to {len} Mnemonic Words'
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
        addAcc: 'Add Address',
        addr: 'Addresses of Accounts',
        addrList: 'Addresses',
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
    account: {
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
            remarksLong: '{len} bytes left'
        },
        hint: {
            token: 'VTT test tokens have be sent to your account, please check your account!',
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
            describe: 'your left quotas turn out to be insufficient, you can acquire more quotas by running PoW or staking VITE',
            left: 'Stake VITE',
            right: 'Run PoW'
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
            title: 'Quick Understanding of Quota'
        },
        myQuota: 'My Quota',
        maxTxNum: 'Maximum number of Txs',
        beneficialAddr: 'Quota Recipient Address',
        fromAddr: 'Deduction address',
        amount: 'Staking Amount',
        time: 'Staking Freeze Duration',
        aboutDays: 'Approx 3 days',
        btn: 'Submit Staking',
        myQuotaList: 'My Staking List',
        amountPlaceholder: 'Please input staking amount, minimum 10 VITE',
        addrPlaceholder: 'Please input quota recipient address',
        cancelAmount: 'Please input withdraw amount',
        pledgeSuccess: 'Successfully Submitted',
        pledgeFail: 'Failed to Submit',
        canclePledgeSuccess: 'Success',
        canclePledgeFail: 'Failed',
        limitAmt: 'Staking amount should not be less than 10.',
        maturity: 'Staking has expired!',
        maxAmt: 'Withdraw amount should be in (0, {amount}]',
        confirm: {
            help: {
                t1: 'What is Quota?',
                txt1: 'In the Vite system, users do not purchase the gas required for a transaction by paying a fee, but acquire the computing resource through a quota-based model. Required quota for sending a transaction = the basic quota (request) + quota (the attached text data), quota required to accept a transaction = the basic quota (response). This quota-based resource configuration protocol allows users to obtain higher resource quotas in two ways: Staking VITE to obtain quota and running PoW.',
                t2: 'What is Staking?',
                txt2: 'In the Vite system, the user can stake VITE to obtain a certain amount of quota. The minimum value for staking is 10 VITE, and there is no maximum limit; meanwhile, Vite system also supports that the A-address stakes a part of the VITE and allocates the obtained quota to the B address. When users apply to stake, VITE will be sent to the smart contract address instead of another user, and only the user who applies for staking has access to manage the staking amount.',
                t3: 'What is PoW?',
                txt3: 'Proof of Work (PoW), is a protocol to confirm that you have done a certain amount of work, and is also an economic measure to deter DDoS attacks and other service abuse. It requires the initiator to conduct a certain amount of computing, which means that it may take some time for the computer. In the Vite system, users can obtain a free quota by running the PoW, and also can send a transaction without any annotated information through obtained quota.'
            },
            cancel: {
                title: 'Withdrawal of Staked Token',
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
            withdrawHeight: 'Expected Snapshot Height',
            withdrawTime: 'Expected Due Date',
            cancel: 'Withdrawal of staked token',
            operate: 'Action',
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
    SBP: {
        title: 'SBP Registration',
        edit: 'Edit',
        reward: 'Retrieval of SBP rewards',
        register: 'SBP Registration',
        cancel: 'SBP Cancellation',
        cancelBtn: 'Cancel',
        help: {
            title: 'About SBP',
            text: 'SBP（Snapshot Block Producer）is a node that has right to create blocks, you can register to become a SBP candidate by staking a certain amount of VITE, each round (about 75 seconds) will elect 25 SBPs, the SBPs will be elected from random 23 out of top 25 candidate nodes, plus random 2 out of the candidate nodes ranking 26th-100th on the list. The 50% of block creation rewards will be allocated to the block creation node, the other 50% will be allocated to nodes that are ranked on top 100 as voting rewards. <br/><br/> One registration address (staking address) can register multiple block creation nodes (node names), a node name cannot be used if the node name has been registered by a registration address. A node name can switch block creation address, however, block creation address cannot be reused by other node names.'
        },
        confirm: {
            title: 'Registration of SBP candidates',
            describe: 'The {amount} VITE of current address will be locked about 90 days when you submit the registration,  the amount will be returned to staking address after being unlocked',
            leftBtn: 'Not register yet',
            rightBtn: 'Ready to register',
            edit: {
                title: 'Change block creation address',
                placeholder: 'please input new block creation address',
                btn: 'Confirm to change'
            },
            reward: {
                title: 'Retrieve block creation rewards',
                placeholder: 'Please input rewards recipient address',
                btn: 'Retrieval of Rewards'
            }
        },
        section1: {
            title: 'Registration Form',
            nodeName: 'Node Name',
            producerAddr: 'Block Creation Address',
            quotaAddr: 'Staking Address',
            quotaTime: 'Staking Period',
            allReward: 'All of the retrievable block creation rewards',
            time: '7776000 snapshot blocks（approximately 90 days）',
            quotaAmount: 'Staking Amount',
            confirmBtn: 'Submit',
            namePlaceholder: 'Please input node name',
            nameHint: 'Within 40 characters, support English letters (both upper and lower cases), numbers, \'_\'、\'.\'',
            nameErr: 'This node name is illegal',
            nameUsed: 'This node name is occupied',
            addrPlaceholder: 'Please input snapshot block creation address',
            addrHint: 'The block creation address must be a full node and keep up running',
            addrErr: 'Illegal address',
            addrUsed: 'This address has been occupied',
            registerSuccess: 'Registration request has sent',
            registerFail: 'Registration request failed'
        },
        section2: {
            title: 'Registration Information',
            updateSuccess: 'Modify request has sent',
            updateFail: 'Failed to send modify request',
            rewardSuccess: 'Request of Rewards retrieval has sent',
            rewardFail: 'Failed to send the request of rewards retrieving',
            cancelSuccess: 'Revoking request has sent',
            cancelFail: 'Failed to send revoking request',
            nowReward: 'The range of snapshot block height and reward that can be requested at this time',
            rewardAddr: 'Retrieval Address',
            expireDate: 'Expire Date: {time}',
            cancelConfirm: {
                title: 'Revoke registration of SBP',
                describe: 'The staking amount will be returned back to your staking address after revoking, you have to re-submit the registration to become a SBP'
            }
        }
    },

    // vote
    vote: {
        toReward: 'View my rewards',
        title: 'Voting',
        search: 'Please input node name or block creation address',
        help: {
            title: 'About Voting',
            text: 'You can join and vote for 25 SBPs （Snapshot Block Producer), each round of voting lasts 75s, the polls you can use for voting are equivalent to the amount of VITE tokens owned by voting address, the default selection is the choice of previous round, the SBPs will be chosen from random 23 out of top 25 candidate nodes, plus random 2 out of the candidate nodes ranking 26th-100th on the list, 25 SBPs in total.',
        },
        addrNoExistErr:'You aren\'t able to vote for now as your address has no transaction record before',
        section1: {
            title: 'My Voting',
            head: ['Name', 'Status', 'My Voting', 'Status of Voting', 'Action'],
            nodeStatusMap: {
                1: 'Active',
                2: 'Inactive'
            },
            voteStatusMap: {
                voted: 'Voting Successful',
                voting: 'Voting',
                canceling: 'Under revoking',
                voteNotWork: 'Revoked voting'
            },
            hoverHelp: 'The node {nodeName} you are voted for has been revoked, you may vote again directly or revoke your voting, If you do not do so, your original voting result will be recovered after the {nodeName} re-registering',
            confirm: {
                title: 'Revoke voting',
                cancelText: 'Confirm',
                submitText: 'Not yet'
            },
            toast: 'Revoking request has sent',
            quotaConfirm: {
                title: 'Insufficient Quota',
                content: 'your left quota turn out to be insufficient, you can acquire more quota by running PoW or staking VITE',
                leftBtn: {text:'Stake Quota'},
                rightBtn: {text:'Run POW'}
            },
            operate:'Revoke Voting',
            operateBtn:'Revoke',
            cancelVoteErr:'Failed to revoke voting, please try again'
        },
    
        section2: {
            title: 'SBP candidates',
            head: ['Rank','Node Name', 'Address', 'Votes', 'Action'],
            confirm: {
                normal: {
                    title: 'Voting',
                    cancelText: 'Not yet',
                    submitText: 'Ready to vote',
                    content: 'You can vote for only one SBP, are you sure you want to vote for {name}?'
                },
                cover: {
                    title: 'Voting',
                    content: 'You\'ve already voted for {nodeName}, are you sure to overwrite current voting record?',
                    cancelText: 'Confirm',
                    submitText: 'Cancel'
                }
            },
            toast: 'The voting request has sent',
            quotaConfirm: {
                title: 'Insufficient Quota',
                content: 'your left quota turn out to be insufficient, you can acquire more quota by running PoW or staking VITE',
                leftBtn: {text:'Stake for quota'},
                rightBtn: {text:'Run POW'}
            },
            noSearchData:'No content found, please try another input',
            noData:'No data',
            operate:'Voting',
            operateBtn:'Vote',
            voteErr:'Failed to vote, please try again'
        }
    },

    // exchangeVite
    exchangeVite: {
        title: '置换VITE',
        gas: '矿工费用',
        help: {
            title: '快速理解置换VITE',
            text: '通过VITE置换功能，可以将以太网络上的ERC20 VITE代币置换到VITE网络中，在置换过程中，你的ERC20 VITE将被转入黑洞地址：{blackAddr}，当黑洞地址收到交易并被确认后，VITE将为您发放等值的VITE至您的VITE地址中'
        },
        exchange: {
            vite: '置换VITE',
            viteAddr: '接收VITE地址',
            viteAmount: '置换VITE金额',
            gas: '矿工费用',
            btn: '确认置换',
            success: '置换请求成功，预计以太网交易被确认后20分钟到账'
        }
    },
    
    pwdConfirm: {
        conf: 'Open password-free mode within 5 minutes',
        title: 'Password',
        placeholder: 'Please input password of wallet'
    },

    quotaConfirm: {
        title: 'Insufficient Quota',
        describe: 'You cannot {operate} due to insufficient TPS quota. You need to stake VITE for quota to {operate}',
        leftBtn: 'Not {operate} yet',
        rightBtn: 'Get Quota'
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
        understand: 'I understand',
        edit: 'Edit',
        copy: 'Copy',
        reReg: 'Re-register',
        otherProd: 'Use Other Products of Vite'
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
        err: 'Oops, error occurs',
        request: '{name} request has sent, please wait'
    }
};
