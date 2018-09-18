<template>
    <div v-show="showPro" class="process-wrapper">
        <div class="around __pointer">
            <span class="icon" :class="{
                'active': active === 'createAccount',
                'finish': active !== 'createAccount'
            }"></span>
            <br/>
            <span>{{$t('nav.head.setting')}}</span>
        </div>
        <div class="line" :class="{'finish': active !== 'createAccount'}"></div>
        <div class="around __pointer">
            <div class="icon" :class="{
                'active': active === 'record',
                'default': active !== 'record'
            }"></div>
            <div>{{$t('mnemonic.record')}}</div>
        </div>
    </div>
</template>

<script>
export default {
    mounted() {
        let showList = ['createAccount', 'record'];

        this.$router.afterEach((to)=>{
            this.showPro = showList.indexOf(to.name) >= 0;
            this.active = to.name;
        });
    },
    data() {
        return {
            showPro: false,
            active: ''
        };
    }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.process-wrapper {
    position: relative;
    display: inline-block;
    .line {
        position: absolute;
        top: 11px;
        left: 39px;
        width: 185px;
        height: 2px;
        background: #68D2FF;
        &.finish {
            background: #007AFF;
        }
    }
    .around {
        opacity: 0.9;
        font-family: $font-bold;
        font-size: 14px;
        line-height: 20px;
        color: #FFFFFF;
        display: inline-block;
        text-align: center;
        &:first-child {
            margin-right: 140px; 
        }
    }
    .icon {
        display: inline-block;
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        border-radius: 24px;
        margin-bottom: 19px;
    }
    .default {
        border: 2px solid #68D2FF;
    }
    .finish {
        background: url('../assets/imgs/complete.svg')
    }
    .active {
        background: #007AFF;
        border: 8px solid #FFFFFF;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,0.16);
    }
}
</style>

