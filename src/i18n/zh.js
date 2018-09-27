module.exports = {
    lang: '中文',

    start: '开始',

    mnemonic: {
        title: '助记词',
        restore: '助记词恢复账户',
        record: '记录助记词',
        prompt: '助记词是您恢复账户的重要手段，如给予他人，您的资产会被他人获取。请谨慎记录，以防丢失。',
        placeholder: '请输入您的助记词',
        empty: '助记词输入为空',
        error: '助记词错误',
        hint: '助记词格式：单词、空格、单词...空格、单词'
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
            login: '登录账户'
        },
        sync: '钱包初始化中，暂时无法发送交易',
        noNet: '未检测到网络',
        noP2P: '无法连接其他节点',
        firstDone: '初始化已完成',
        firstDoing: '初始化中',
        blockHeight: '快照块高度'
    },
    test: {
        t: '预览版',
        txt1: 'Vite的Web版钱包是轻节点钱包，目前可以生成基于DAG账本结构的账户、查询账户余额、对外发送交易、默认签收交易，以及获取测试代币、查看目前系统铸造的多种代币等功能。',
        txt2: '支持账户的助记词找回和加密文件的加载登录。',
        v: '当前版本：预览版'
    },

    // account list
    accList: {
        balance: '余额',
        addAcc: '新添加一个账户',
        addr: '账户地址列表',
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
            name: '账户名仅支持中英文、数字和下划线',
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
        fundFloat: '在途资金',
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
            remarksFormat: '备注限制中英文和标点符号，格式输入错误',
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
        }
    },

    // Transaction List
    transList: {
        title: '交易记录',
        tType: {
            title: '交易类型',
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
            succ:'转账成功',
            err: '发生错误'
        },
        timestamp: '时间戳',
        tAddress: '交易方地址',
        sum: '金额',
        tDetail: '交易详情',
        noData: '暂无数据'
    },

    //common
    btn: {
        create: '创建',
        cancel: '取消',
        login: '登录',
        imported: '导入账号',
        back: '返回',
        submit: '确定',
        next: '下一步',
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
        pwEmpty: '密码不能为空'
    }
};
