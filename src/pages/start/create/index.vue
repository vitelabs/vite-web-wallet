<template>
    <div class="create-account-wrapper">
        <div class="__title">{{ $t('settingAcc')}}</div>

        <create ref="createDom" :submit="createAccount"></create>

        <div @click="toogleAgree" class="agreement __pointer" :class="{
            'active': isAgree
        }">{{ $t('startCreate.agreementPre') }}
            <span @click.stop="openLink" class="link">{{ $t('startCreate.agreement') }}</span>
        </div>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="back" >
                {{ $t('btn.back') }}
            </span>
            <div class="__btn __btn_all_in __pointer" :class="{
                'unuse': !isAgree
            }" @click="valid">
                {{ $t('btn.next')}}
            </div>
        </div>

        <process class="process" active="createAccount"></process>
    </div>
</template>

<script>
import create from '../create.vue';
import process from 'components/process';

export default {
    components: { create, process },
    mounted() {
        this.$onKeyDown(13, () => {
            this.valid();
        });
    },
    data() {
        return {
            name: '',
            pass1: '',
            pass2: '',
            inputItem: '',
            isAgree: false
        };
    },
    methods: {
        valid() {
            if (!this.isAgree) {
                return;
            }
            this.$refs.createDom && this.$refs.createDom.valid();
        },
        back() {
            this.$router.go(-1);
        },
        createAccount(name, pass) {
            this.$wallet.create(name, pass);
            this.$router.push({ name: 'startRecord' });
        },
        toogleAgree() {
            this.isAgree = !this.isAgree;
        },
        openLink() {
            window.open(`${ location.origin }/privacy.html`);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.agreement {
    text-align: left;
    margin-top: 20px;
    font-size: 14px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
    color: rgba(255,255,255,1);
    line-height: 18px;
    .link {
        text-decoration: underline;
    }
    &.active {
        &::before {
            background: url('~assets/imgs/agree.svg');
            background-size: 100% 100%;
        }
    }
    &:before {
        display: inline-block;
        content: ' ';
        width: 18px;
        height: 18px;
        margin-bottom: -5px;
        margin-right: 6px;
        background: url('~assets/imgs/unagree.svg');
        background-size: 100% 100%;
    }
}

.__btn.__btn_all_in.unuse {
    background: rgba(191,191,191,1);
    color: #fff;
}

.__btn_list {
    margin-top: 20px;
}
</style>
