module.exports = {
    lang: '中文',

    start: '开始',
    logout: '退出登录',
    
    firstNotice: {
        title: '使用前必读',
        text1: '创建账户时，请务必备份您的助记词，如果您访问了一个钓鱼网站或者丢失了您的备份，本站无法为您恢复资金。',
        text2: '由于本站不存储你的私钥或助记词，如果您更换浏览器、电脑或者清除浏览器缓存，需要通过备份助记词恢复账号。',
        text3: '如果使用了从助记词恢复地址的方式，请保证助记词绝对正确，如果有细微的不同都可能无法恢复您的地址。',
        text4: '当前版本钱包为预览版，您获得的VITE测试代币仅用于测试，无任何实际价值，同时官方会不定期对测试代币进行清零。'
    },
    test: {
        t: '预览版',
        txt1: 'Vite的Web版钱包是轻节点钱包。',
        txt2: '目前可以生成基于DAG账本结构的账户、查询账户余额、对外发送交易、默认签收交易，以及获取测试代币、查看目前系统铸造的多种代币等功能。支持账户的助记词找回和加密文件的加载登录。',
        txt3: 'VITE测试代币仅用于测试，无任何实际价值，同时官方会不定期对测试代币进行清零。',
        v: '当前版本：预览版'
    },

    mnemonic: {
        title: '助记词',
        restore: '助记词恢复账户',
        record: '记录助记词',
        prompt: '助记词是您恢复账户的重要手段，如给予他人，您的资产会被他人获取。请谨慎记录，以防丢失。',
        placeholder: '请输入您的助记词',
        empty: '助记词输入为空',
        error: '助记词错误',
        hint: '助记词格式：单词、空格、单词...空格、单词',
        netErr: '节点异常，请您稍后重试'
    },

    setting: {
        title: '设置',
        unlock: '解锁安全信息',
        lang: '语言',
        block: '当前区块高度',
        version: '版本',
        service: '客户服务',
        site: 'Vite官方网站',
        sys: '系统门户网站',
        open: 'Vite项目开源代码',
    },

    nav: {
        home: '首页',
        head: {
            title: '账户',
            create: '新建账户',
            imported: '导入账户',
            backup: '备份账户',
            setting: '设置账户',
            reset: '重新设置账号',
            login: '登录账户'
        },
        sync: '钱包初始化中，暂时无法发送交易',
        noNet: '网络无法连接',
        noP2P: '无法连接其他节点',
        firstDone: '初始化已完成',
        firstDoing: '初始化中',
        blockHeight: '快照块高度'
    },

    // account list
    accList: {
        balance: '余额',
        addAcc: '新添加一个账户',
        addr: '账户地址列表',
        addrList: '账户地址列表',
        default: '选择默认用户'
    },

    // create account
    create: {
        accName: '账户昵称',
        input: '请输入密码',
        again: '请再次输入密码',
        choose: '选择账户',
        finish: '完成',
        hint: {
            nameInput: '请输入账户名称',
            nameLong: '账户不得超出32个字符',
            long: '密码不能大于32个字符',
            name: '账户名称仅支持中英文、数字和下划线',
            consistency: '请输入相同的密码',
            pwFormat: '密码格式错误，密码仅支持英文、半角符号、数字',
            save: '您的私钥文件保存在 {0} 中，请谨慎保存，当前版本丢失密码账户不可找回'
        }
    },
    dragDrop: {
        text: '拖拽账户文件进入文本区域',
        err1: '导入的文件错误',
        err2: '只能导入一个文件',
        guide: '打开文件夹导入',
        hint: '注：导入加密文件的方式仅支持单地址，不支持派生地址。推荐通过助记词进行跨平台操作。'
    },

    // account detail
    accDetail: {
        title: '账户详情',
        transfer: '转账',
        getTestToken: '获取VITE测试代币',
        transDetail: '查看账户更多交易详情',
        name: '账户名称',
        address: '我的地址',
        balance: '账户余额',
        fundFloat: '待接收',
        pend: '笔交易待确认',
        copy: '复制账户地址',
        outAddress: '我的账户地址',
        inAddress: '接收账户地址',
        sum: '金额',
        password: '密码',
        saveQrcode: '保存二维码图片',
        sendTrans: '发送交易',
        remarks: '备注',
        placeholder: {
            amount: '请输入金额',
            remarks: '请输入备注',
            addr: '请输入地址'
        },
        valid: {
            remarksFormat: '格式输入错误，备注仅支持中英文和标点符号',
            remarksLong: '备注请勿超出180个英文字符（或标点符号，一个汉字=6个英文字符）'
        },
        hint: {
            token: '系统已向您转入一笔VITE测试代币，请注意接收',
            tErr: '获取测试代币失败！',
            low: '账户余额不足',
            wrong: '密码错误',
            amount: '金额必须大于0',
            punctuation: '不可以出现标点符号',
            rename: '重命名失败',
            copy: '复制成功'
        },
        quota: {
            title: '配额不足',
            describe: '配额不足，无法进行交易，您需要删除描述文字并运行PoW 或 抵押VITE才可以继续转账',
            left: '运行PoW',
            right: '抵押VITE'
        },
        trans: {
            powErr: '运行PoW错误，请重新发起转账',
            powTransErr: 'PoW获取的配额不足，建议您进行抵押VITE获取配额',
            err: '转账发生错误，请重新发起转账'
        }
    },

    // quota
    quota: {
        title: '获取配额',
        help: {
            title: '快速理解配额'
        },
        myQuota: '我的当前配额',
        maxTxNum: '最大交易笔数',
        beneficialAddr: '配额受益地址',
        fromAddr: '抵押金额扣除地址',
        amount: '抵押金额',
        time: '抵押锁定时长',
        aboutDays: '约3天',
        btn: '提交抵押',
        myQuotaList: '我的抵押列表',
        amountPlaceholder: '请输入抵押金额，最小10vite',
        addrPlaceholder: '请输入获取配额地址',
        cancelAmount: '请输入取回金额',
        pledgeSuccess: '提交成功',
        pledgeFail: '提交失败',
        canclePledgeSuccess: '操作成功',
        canclePledgeFail: '操作失败',
        limitAmt: '抵押金额需填写大于等于10的数字',
        maturity: '抵押已到期',
        maxAmt: '取回金额在0~{amount}之间”，{amount}为当前可取回最大金额',
        confirm: {
            help: {
                t1: '什么是配额',
                txt1: '在Vite系统中，用户不是通过支付手续费的方式来购买一次交易所需的燃料，而是通过一种基于配额的模型来获取计算资源，发送交易所需配额=基础配额(请求)+配额(附带的文本资料)，接受交易所需配额=基础配额(响应)。这个基于配额的资源配置协议允许用户通过两种方式来获取更高的资源配额：抵押Vite获取配额、运行PoW',
                t2: '什么是抵押',
                txt2: '在Vite系统中，用户可以抵押vite获取一定数量的配额，抵押最小值为10vite，没有最大抵押上限；同时支持A地址抵押一部分vite并将获得的配额分配给B地址；用户申请抵押后，会将这笔vite发送到智能合约地址而不是某一个用户，且只有申请抵押用户有权限支配抵押的金额',
                t3: '什么是PoW',
                txt3: '工作量证明(Proof of Work，简称PoW)，简单理解就是一份证明，用来确认你做过一定量的工作，同样也是应对拒绝服务攻击和其他服务滥用的经济对策。它要求发起者进行一定量的运算，也就意味着需要消耗计算机一定的时间；在VITE系统中，用户可以通过运行PoW获得免费的配额，用户可以通过获得的配额进行一次不带任何备注信息的交易'
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
        title: '交易记录',
        tType: {
            title: '交易类型',
            symbol: '类型',
            send: '发送',
            receive: '接收',
        },
        status: {
            title: '状态',
            unconfirmed: '待确认',
            confirms: '确认数',
            confirmed: '已确认',
        },
        valid:{
            addr:'账户地址格式错误',
            bal:'余额不足',
            pswd:'密码错误',
            amt:'金额格式错误',
            succ:'转账成功'
        },
        timestamp: '时间戳',
        tAddress: '交易方地址',
        tAddr: '交易方',
        sum: '金额',
        tDetail: '交易详情',
    },

    // SBP
    SBP: {
        title: '注册SBP',
        edit: '编辑',
        reward: '提取奖励',
        register: '注册SBP',
        cancel: '撤销注册SBP',
        help: {
            title: '关于SBP',
            text: 'SBP（Snapshot Block Producer）为具有出块权利的节点，您可以通过抵押一定数量的VITE注册成为SBP候选节点；每轮（时长75秒）会选举出25个SBP，每轮得票数前25名中随机选出23个作为SBP，得票数26-100名中随机选出2个作为SBP；出块奖励的50%将作为按块奖励分配给该块的出块节点，另外50%将作为按票奖励分配给该轮次得票数排名前100的节点。'
        },
        confirm: {
            title: '注册SBP候选节点',
            describe: '提交注册后，当前地址的{amount} VITE将被锁定约90天，解锁后金额将退回抵押地址',
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
    vote: {
        title: '投票',
        help: {
            title: '了解投票与投票收益',
            text: '您可以参与投票选出共25个SBP（Snapshot Block Producer），官方SBP获得的出块奖励的70%会分发给那些将票投给官方SBP的地址。', 
        },
        section1:{
            title:'我的投票',
            head:['节点名称', '节点状态', '当前投票数', '投票状态', '操作'],
            nodeStatusMap:{
                cancelRegister:'取消注册',
                registering:'注册中'
            },
            voteStatusMap:{
                cancelVote:'取消投票',
                voting:'投票中'
            },
            hoverHelp:'您投票的“SBP2”已经取消注册，您可以直接重新投票、或者撤销投票；如果您不重新投票或撤销投票，“SBP2”重新注册后，您原来的投票立即恢复生效。',
            confirm:{
                title:'撤销投票',
                cancelText:'确认撤销',
                submitText:'暂不撤销'
            }
        },

        section2:{
            title:'候选节点列表',
            head:['节点名称', '出块地址', '当前投票数', '操作'],
            confirm:{
                normal:{
                    title:'投票',
                    cancelText:'暂不投票',
                    submitText:'确认投票'
                },
                cover:{
                    title:'投票',
                    content:'您已经投过票，再次投票将会覆盖上一次投票',
                    cancelText:'确认覆盖上次投票',
                    submitText:'取消保持原投票'
                }
            }
        }
    },

    pwdConfirm: {
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

    // common
    pow: '运行PoW...',    
    btn: {
        create: '创建',
        cancel: '取消',
        login: '登录',
        imported: '导入账号',
        back: '返回',
        submit: '确定',
        next: '下一步',
        understand: '我已了解'
    },
    paging: {
        pre: '上一页',
        next: '下一页',
        first: '首页',
        last: '末页',
    },
    hint:{
        create: '创建失败',
        logoutErr: '退出有错误',
        pwErr: '密码错误',
        acEmpty: '账号不可为空',
        pwEmpty: '密码不能为空',
        noData: '暂无数据',
        err: '发生错误'
    }
};
