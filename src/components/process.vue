<template>
    <div class="process-wrapper">
        <div class="process-line">
            <span class="icon" :class="{
                'active': active === 'createAccount',
                'finish': active !== 'createAccount'
            }"></span><span class="line" :class="{'finish': active !== 'createAccount'}"></span><span
                class="icon" :class="{
                    'active': active === 'record',
                    'default': active !== 'record'
            }"></span>
        </div>
        <div class="words">
            <span class="setting">{{ $t('settingAcc') }}</span>
            <span class="record">{{ $t('mnemonic.record') }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        active: {
            type: String,
            default: ''
        }
    }
};
</script>


<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.process-wrapper {
    position: relative;
    display: inline-block;
    margin-top: 60px;
}

@media only screen and (max-width: 500px) {
    .process-wrapper {
        margin-top: 20px;
    }
}

.process-line {
    .icon {
        display: inline-block;
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        border-radius: 24px;
        margin-bottom: 19px;
        margin-right: 0;
    }

    .default {
        border: 2px solid #68d2ff;
    }

    .finish {
        background: url('../assets/imgs/complete.svg');
    }

    .active {
        background: #007aff;
        border: 8px solid #fff;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
    }

    .line {
        display: inline-block;
        position: relative;
        top: -30px;
        width: 185px;
        height: 2px;
        background: #68d2ff;

        &.finish {
            background: #007aff;
        }
    }
}

.words {
    font-family: $font-bold, arial, sans-serif;
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    opacity: 0.9;

    .setting {
        float: left;
        transform: translateX(-35%);
    }

    .record {
        float: right;
        transform: translateX(35%);
    }
}
</style>

