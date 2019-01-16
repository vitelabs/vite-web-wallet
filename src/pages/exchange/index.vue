/**  vite-wallet name-exchange-index */

<template>
    <div class="exchange-center-wrapper">
        <div class="head">
            <ul class="tab-list-wrapper">
                <li v-for="(tab, index) in tabList" :key="index" 
                    class="tab __pointer" :class="{ 'active': active === tab }"
                    @click="goTab(tab)" >
                    {{ $t(`${tab}.title`) }}
                </li>
            </ul>

            <change-lang class="exchange change-lang"></change-lang>
        </div>

        <div class="router-wrapper">
            <center v-if="active === 'exchange'"></center>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';
import center from './center/center.vue';

export default {
    components: {
        center, changeLang
    }, 
    mounted() {
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
    },
    data() {
        return {
            active: this.$route.name,
            tabList: ['exchange', 'exchangeAssets', 'exchangeOpenOrders', 'exchangeOrderHistory']
        };
    },
    methods: {
        goTab(tab) {
            if (tab === this.active) {
                return;
            }

            this.$router.push({ 
                name: tab
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.exchange-center-wrapper {
    min-width: 1300px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .router-wrapper {
        flex: 1;
        overflow: auto;
    }
}

.head {
    flex-basis: 47px;
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 43px;
    margin: 0 10px;
    border-bottom: 1px solid rgba(198, 203, 212, 0.3);
    .change-lang {
        float: right;
        margin-top: 0;
    }
}

.tab-list-wrapper {
    display: inline-block;
    font-size:14px;
    font-family: $font-bold, arial, sans-serif;
    font-weight: 600;
    color: rgba(94, 104, 117, 1);
    .tab {
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        min-width: 112px;
        padding: 0 28px;
        text-align: center;
        &.active {
            position: relative;
            color: rgba(29, 32, 36, 1);
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
}
</style>
