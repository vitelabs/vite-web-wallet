<template>
    <div>
        <div class="__title">{{ $t('settingAcc')}}</div>

        <create ref="createDom" :submit="createAccount"></create>

        <div @click="toogleAgree" class="agreement agree-list __pointer" :class="{
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
    </div>
</template>

<script>
import create from '../create.vue';

export default {
    components: { create },
    props: {
        toNext: {
            type: Function,
            default: () => {}
        }
    },
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
            this.toNext && this.toNext(name, pass);
        },
        toogleAgree() {
            this.isAgree = !this.isAgree;
        },
        openLink() {
            window.open('/privacy.html');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "../agree.scss";

.__btn.__btn_all_in.unuse {
    background: rgba(191,191,191,1);
    color: #fff;
}

.__btn_list {
    margin-top: 20px;
}
</style>
