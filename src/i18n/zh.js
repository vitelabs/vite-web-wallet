module.exports = {
    lang: '中文',

    start: '开始',

    nav: {
        home: '首页',
        head: {
            title: '账户',
            create: '新建账户',
            imported: '导入账户',
            backup: '备份账户',
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
        txt1: 'Vite钱包是第一个预览版全节点钱包，可以生成基于DAG账本结构的账户、查询账户余额、对外发送交易、默认签收交易，以及获取测试代币等功能。',
        txt2: '目前账户暂不支持私钥导入，请妥善保管好您的账户密码和账户文件。',
        v: '当前版本：预览版'
    },

    // account list
    accList: {
        balance: '余额',
        addAcc: '新添加一个账户'
    },

    // create account
    create: {
        accName: '账户昵称',
        input: '请输入密码',
        again: '请再次输入密码',
        choose:'选择账户',
        hint: {
            nameInput: '请输入账户名称',
            nameLong: '账户不得超出32个字符',
            long: '密码限定1至32个字符',
            name: '用户名仅支持中英文、数字和下划线',
            consistency: '请输入相同的密码',
            pwFormat: '密码格式错误，密码仅支持英文、半角符号、数字',
            save: '您的私钥文件保存在 {0} 中，请谨慎保存，当前版本丢失密码账户不可找回'
        }
    },
    dragDrop: {
        text: '拖拽账户文件进入文本区域',
        err1: '导入的文件错误',
        err2: '只能导入一个文件',
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
        hint: {
            token: '系统已向您转入一笔测试代币，请注意接收',
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
        back: '返回'
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
        pwEmpty: '密码不可为空'
    }
};
