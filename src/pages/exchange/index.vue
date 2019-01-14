/**  vite-wallet name-exchange-index */

<template>
    <div :class="{'full-screen': isFullScreen}" class="__wrapper">
        <div class="head">
            <ul class="tab-list-wrapper">
                <li v-for="(tab, index) in tabList" :key="index" 
                    class="tab __pointer" :class="{ 'active': active === tab }"
                    @click="goTab(tab)" >
                    {{ $t(`${tab}.title`) }}
                </li>
            </ul>
            <div v-if="active === 'exchange'" class="full-btn __pointer"
                 :class="{'full': isFullScreen}" 
                 @click="fullScreen" ></div>
            <change-lang class="change-lang __pointer"></change-lang>
        </div>

        <center class="center-wrapper" v-if="active === 'exchange'"></center>
        <router-view></router-view>
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
        this.initFullScreen();
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
    },
    data() {
        return {
            isFullScreen: false,
            active: this.$route.name,
            tabList: ['exchange', 'exchangeAssets', 'exchangeOpenOrders', 'exchangeOrderHistory']
        };
    },
    watch: {
        active: function() {
            this.initFullScreen();
        }
    },
    methods: {
        initFullScreen() {
            if (this.active !== 'exchange') {
                return;
            }
            this.$onKeyDown(27, () => {
                this.isFullScreen = false;
            });
        },
        fullScreen() {
            this.isFullScreen = !this.isFullScreen;
        },
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
.tab-list-wrapper {
    display: inline-block;
    .tab {
        display: inline-block;
        min-width: 100px;
        background: #000;
        color: #fff;
        margin-right: 20px;
        padding: 10px;
        text-align: center;
        &.active {
            color: blue;
        }
    }
}
.full-screen {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    z-index: 900;
}
.change-lang {
    background: #000;
    float: right;
    margin-top: 0;
}
.full-btn {
    float: right;
    width: 20px;
    height: 20px;
    background: #000;
    margin-left: 10px;
    &.full {
        background: blue;
    }
}
</style>
