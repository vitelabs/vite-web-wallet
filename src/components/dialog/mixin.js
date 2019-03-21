export default{
    props: {
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
        close: {
            type: Function,
            default: ()=>{}
        },
        lTxt: {
            type: String,
            default: ''
        },
        rTxt: {
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
        lClick: {
            type: Function,
            default: ()=>{}
        },
        rClick: {
            type: Function,
            default: ()=>{}
        },
    },
    computed:{
        singleBtn(){
            return !!this.sTxt;
        }
    }
};