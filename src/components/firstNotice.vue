<template>
    <div class="first-notice-wrapper" v-show="isFirst">
        <div class="wrapper">
            <div class="title">{{ $t('firstNotice.title') }}</div>
            <ul class="first-notice">
                <li>{{ $t('firstNotice.text1') }}</li>
                <li>{{ $t('firstNotice.text2') }}</li>
                <li>{{ $t('firstNotice.text3') }}</li>
                <li>{{ $t('firstNotice.text4') }}</li>
            </ul>
            <div class="__btn __btn_all_in" @click="close">{{ $t('firstNotice.btn') }}</div>
        </div>
    </div>
</template>

<script>
import localStorage from 'utils/localStorage';

export default {
    mounted() {
        this.isFirst = !localStorage.getItem('first');
    },
    data() {
        return {
            isFirst: false
        };
    },
    methods: {
        close() {
            this.isFirst = false;
            localStorage.setItem('first', 'true');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.first-notice-wrapper {
    position: fixed;
    top: 80px;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0);
    z-index: 100;
}
.wrapper { 
    background: #fff;
    width: 90%;
    max-height: 500px;
    max-width: 600px;
    border-radius: 2px;
    padding: 25px 15px;
    box-sizing: border-box;
    margin-top: -40px;
    .title {
        font-size: 16px;
        font-family: $font-bold;
        text-align: center;
    }
    .first-notice {
        padding: 20px;
        font-size: 14px;
        li {
            margin-top: 10px;
            line-height: 20px;
            word-wrap: break-word;
            list-style-type: disc;
            &:first-child {
                margin-top: 0;
            }
        }
    }
    .btn {
        width: 200px;
        height: 60px;
        line-height: 60px;
    }
}
</style>
