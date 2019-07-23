<template>
    <confirm v-show="isShowConfirm" class="small"
             type="description" :title="$t('assets.notice.title')"
             :close="closeConfirm" :closeIcon="true"
             :singleBtn="true" :btnUnuse="!isAgree"
             :leftBtnTxt="$t('btn.next')" :leftBtnClick="next">
        <div class="notice-content">
            {{ $t('assets.notice.contentBefore', { gate: gateInfo.gateway }) }}
            <span @click="goLink" class="link __pointer">{{ $t('assets.notice.agreeList') }}</span>
            {{ $t('assets.notice.contentAfter', { gate: gateInfo.gateway }) }}
        </div>
        <div class="agreement __pointer" :class="{ 'active': isAgree }"
             @click="toogleAgree">{{ $t('assets.notice.agree') }}</div>
        <div class="__hint"><span>{{ $t('assets.notice.hint', { gate: gateInfo.gateway }) }}</span></div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';

export default {
    components: { confirm },
    data() {
        return {
            isShowConfirm: false,
            tokenInfo: {},
            successCallback: null,
            isAgree: false
        };
    },
    computed: {
        gateInfo() {
            if (!this.tokenInfo || !this.tokenInfo.gateInfo) {
                return {};
            }
            return this.tokenInfo.gateInfo;
        }
    },
    methods: {
        toogleAgree() {
            this.isAgree = !this.isAgree;
        },
        showConfirm(tokenInfo, callback) {
            this.isShowConfirm = true;
            this.tokenInfo = tokenInfo;
            this.successCallback = callback;
        },
        closeConfirm() {
            this.isAgree = false;
            this.tokenInfo = {};
            this.successCallback = null;
            this.isShowConfirm = false;
        },
        next() {
            this.closeConfirm();
            this.successCallback && this.successCallback();
        },
        goLink() {
            window.alert('Where??');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.__hint {
    margin-top: 16px;
}
.link {
    color: #007aff;
    text-decoration: underline;
}
.notice-content {
    line-height: 18px;
}
.agreement {
    text-align: left;
    margin-top: 18px;
    font-size: 12px;
    line-height: 18px;
    color: rgba(29,32,36,1);
    &.active {
        &::before {
            background: url('~assets/imgs/agree.svg');
            background-size: 100% 100%;
        }
    }
    &:before {
        display: inline-block;
        content: ' ';
        width: 14px;
        height: 14px;
        margin-bottom: -3px;
        margin-right: 6px;
        background: url('~assets/imgs/unagree.svg');
        background-size: 100% 100%;
    }
}
</style>
