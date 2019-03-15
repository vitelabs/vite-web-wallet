<template>
    <div class="head">
        <ul class="tab-list-wrapper">
            <li v-for="(tab, index) in tabList" :key="index" 
                class="tab __pointer" :class="{ 
                    'active': active === tab,
                    'dex': active.indexOf('exchange') === 0
            }" @click="go(tab)" >
                {{ $t(`${tab}.title`) }}
            </li>
        </ul>
        
        <go-net-btn class="go-net-wrapper"></go-net-btn>
        <change-lang class="menu change-lang-wrapper" 
                     :class="{'dex': active.indexOf('exchange') === 0}"></change-lang>
        <ul class="right-lab-list">
            <div v-show="!isLogin" @click="go('start')" class="tab __pointer" 
                 :class="{'dex': active.indexOf('exchange') === 0}">{{ $t('login') }}</div>  
            <div v-show="!isLogin" @click="go('startCreate')" class="tab __pointer"
                 :class="{'dex': active.indexOf('exchange') === 0}">{{ $t('regAcc') }}</div>  
            <div v-show="active === 'exchange'" @click="showToken" 
                 class="tab dex __pointer">{{ $t('dexToken') }}</div>
        </ul>

        <confirm v-show="isShowDexTokenConfirm" class="exchange" 
                 :showMask="true" :singleBtn="true"
                 :title="$t('exchange.dexToken.title')" :closeIcon="true"
                 :close="closeToken" :leftBtnTxt="$t('exchange.dexToken.btn')">

            <div class="__row">
                <div class="__row-t">{{ $t('exchange.dexToken.market') }}</div>
                <vite-input v-model="market" :valid="validMarket">
                    <span class="down-icon" slot="after"></span>
                </vite-input>
            </div>

            <div class="__row">
                <div class="__row-t">
                    {{ $t('exchange.dexToken.name') }}
                    <!-- <span v-show="!isValidAddress" class="__err __hint">{{ $t('hint.addrFormat') }}</span> -->
                </div>
                <vite-input v-model="tokenName" :valid="validTokenName">
                    <span class="down-icon" slot="after"></span>
                </vite-input>
            </div>

            <div class="__row">
                <div class="__row-t">
                    {{ $t('exchange.dexToken.id') }}
                    <!-- <span v-show="amountErr" class="__err __hint">{{ amountErr }}</span> -->
                </div>
                <vite-input v-model="tokenId" :valid="validTokenId">
                    <span class="down-icon" slot="after"></span>
                </vite-input>
            </div>

            <div class="__row">
                <div class="__row-t">{{ $t('exchange.dexToken.fee') }}</div>
                <div class="no-input">{{ spend }} VITE</div>
            </div>
            <div class="hint"><span>{{ $t('exchange.dexToken.hint') }}</span></div>
        </confirm>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';
import confirm from 'components/confirm';
import viteInput from 'components/viteInput';
import goNetBtn from './goNetBtn.vue';

const spend = 1000;

export default {
    components: {
        goNetBtn, changeLang, confirm, viteInput
    },
    props: {
        tabList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        go: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
        this.isLogin = !!this.$wallet.isLogin;
        this.$wallet.onLogin(() => {
            this.isLogin = true;
        });
        this.$wallet.onLogout(() => {
            this.isLogin = false;
        });
    },
    data() {
        return {
            active: this.$route.name,
            isLogin: false,
            isShowDexTokenConfirm: false,
            spend,
            market: '',
            tokenId: '',
            tokenName: ''
        };
    },
    methods: {
        validMarket() {

        },
        validTokenName() {

        },
        validTokenId() {

        },
        showToken() {
            this.isShowDexTokenConfirm = true;
        },
        closeToken() {
            this.isShowDexTokenConfirm = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "~assets/scss/confirmInput.scss";

.head {
    box-sizing: border-box;
    padding-left: 10px;
    line-height: 43px;
    margin: 0 10px;
    border-bottom: 1px solid rgba(198, 203, 212, 0.3);
    .tab-list-wrapper {
        display: block;
        display: flex;
        flex-wrap: wrap;
        float: left;
    }
    .right-lab-list {
        float: right;
    }
    .tab {
        font-size: 14px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: rgba(29,32,36,0.6);
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        white-space: nowrap;
        margin-right: 28px;
        text-align: center;
        &.dex {
            color: rgba(189,193,209,1);
        }
        &.active {
            position: relative;
            color: rgba(0,122,255,1);;
            border-bottom: 2px solid rgba(0,122,255,1);
            &:after {
                content: '';
                display: inline-block;
                border: 6px solid transparent;
                border-bottom: 6px solid rgba(0,122,255,1);
                position: absolute;
                bottom: 0px;
                left: 50%;
                margin-left: -6px;
            }
        }
    }
    .go-net-wrapper {
        float: right;
        margin-top: 8px;
    }
    .change-lang-wrapper {
        float: right;
    }
}

@media only screen and (max-width: 940px) {
    .head .tab-list-wrapper {
        width: 100%;
    }
    .head .change-lang-wrapper {
        float: left;
        margin-left: 20px;
    }
    .head {
        .go-net-wrapper {
            float: left;
        }
        .right-lab-list {
            float: left;
        }
    }
}

@media only screen and (max-width: 900px) {
    .head .tab-list-wrapper .tab {
        box-sizing: border-box;
        padding: 0 10px;
    }
}
</style>
