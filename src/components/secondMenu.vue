<template>
    <div class="head">
        <ul class="tab-list-wrapper">
            <li v-for="(tab, index) in tabList" :key="index" 
                class="tab __pointer" :class="{ 'active': active === tab }"
                @click="goTab(tab)" >
                {{ $t(`${tab}.title`) }}
            </li>
        </ul>
        <go-net-btn class="go-net-wrapper"></go-net-btn>
        <change-lang class="menu change-lang-wrapper"></change-lang>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';
import goNetBtn from './goNetBtn.vue';

export default {
    components: {
        goNetBtn, changeLang
    },
    props: {
        tabList: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    mounted() {
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
    },
    data() {
        return {
            active: this.$route.name
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

.head {
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 43px;
    margin: 0 10px;
    border-bottom: 1px solid rgba(198, 203, 212, 0.3);
    .tab-list-wrapper {
        display: block;
        font-size: 14px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: rgba(94, 104, 117, 1);
        display: flex;
        flex-wrap: wrap;
        float: left;
        .tab {
            display: inline-block;
            box-sizing: border-box;
            height: 100%;
            min-width: 112px;
            padding: 0 28px;
            text-align: center;
            white-space: nowrap;
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
    .go-net-wrapper {
        float: right;
        margin-top: 8px;
    }
    .change-lang-wrapper {
        float: right;
    }
}

@media only screen and (max-width: 900px) {
    .head .tab-list-wrapper .tab {
        box-sizing: border-box;
        padding: 0 10px;
        flex-basis: 130px;
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
    .head .go-net-wrapper {
        float: left;
    }
}
</style>

<style lang="scss">

</style>
