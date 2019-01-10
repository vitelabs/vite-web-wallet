<template>
    <ul class="tab-list-wrapper">
        <li v-for="(tab, index) in tabList" :key="index" 
            class="tab" :class="{ 'active': active === tab }"
            @click="goTab(tab)" >
            {{ $t(`${tab}.title`) }}
        </li>
    </ul>
</template>

<script>
export default {
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
.tab-list-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.tab {
    min-width: 100px;
    background: #000;
    color: #fff;
    margin-right: 20px;
    padding: 10px;
    margin-top: 10px;
    text-align: center;
    &.active {
        color: blue;
    }
}
</style>
