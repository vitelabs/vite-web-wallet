const STATUS = {
    'CLOSE': 'CLOSE',
    'CANCEL': 'CANCEL',
    'CONFIRMED': 'CONFRIMED'
};
export default {
    props: {
        destory: {
            type: Function,
            default: () => { }
        },
        showMask: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        showClose: {
            type: Boolean,
            default: false
        },
        lTxt: {
            type: String,
            default: ''
        },
        rTxt: {
            type: String,
            default: ''
        },
        sTxt: {
            type: String,
            default: ''
        },
        btnUnuse: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        },
        promise: {
            type: Object,
            required: true
        }
    },
    computed: {
        singleBtn() {
            return !!this.sTxt;
        }
    },
    methods: {
        lClick() {
            if (this.inspector) {
                this.inspector.then(data => {
                    this.promise.resolve({
                        status: STATUS.CONFIRMED,
                        data
                    });
                    this.destory();
                });
            } else {
                this.promise.resolve({
                    status: STATUS.CONFIRMED,
                    data: null
                });
                this.destory();
            }
        },
        rClick() {
            this.destory();
            this.promise.reject({
                status: STATUS.CANCEL,
                data: null
            });
        },
        close() {
            this.destory();
            this.promise.reject({
                status: STATUS.CLOSE,
                data: null
            });
        }
    }
};
