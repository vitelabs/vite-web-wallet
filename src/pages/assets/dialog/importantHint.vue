<template>
    <confirm v-show="isShowConfirm" class="small"
             type="description" :title="$t('assets.notice.title')"
             :close="closeConfirm" :closeIcon="true" :singleBtn="true"
             :leftBtnTxt="$t('assets.notice.next')" :leftBtnClick="next">

        <div class="notice-content">
            {{ $t('assets.notice.contentProvider', { gate: gateInfo.gateway }) }}
            <span v-show="gateInfo.gateway !== 'Vite Labs'">
                {{ $t('assets.notice.contentOther', { gate: gateInfo.gateway }) }}
            </span>
            {{ $t('assets.notice.contentAgree', { gate: gateInfo.gateway }) }}
            <span @click="goLink(gateInfo.privacy)" class="link __pointer">{{ $t('assets.notice.agreement') }}</span>
            {{ $t('assets.notice.contentUngree', { gate: gateInfo.gateway }) }}
        </div>

        <div class="__hint">
            <span>
                {{ $t('assets.notice.hint', { gate: gateInfo.gateway }) }}
                <a v-show="gateInfo.customer">
                    --<a class="link __pointer" @click="goLink(gateInfo.customer)">{{ gateInfo.customer }}</a>
                </a>
            </span>
        </div>

    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import openUrl from 'utils/openUrl';

export default {
    components: { confirm },
    props: {
        tokenInfo: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            isShowConfirm: false,
            successCallback: null
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
        showConfirm(callback) {
            this.isShowConfirm = true;
            this.successCallback = callback;
        },
        _close() {
            this.closeConfirm();
            this.clear();
        },
        closeConfirm() {
            this.isShowConfirm = false;
        },
        next() {
            this.closeConfirm();
            this.successCallback && this.successCallback();
            this.clear();
        },
        clear() {
            this.successCallback = null;
        },
        goLink(url) {
            url && openUrl(url);
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
