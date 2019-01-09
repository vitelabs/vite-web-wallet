<template>
    <ul>
        <li v-for="(tab, index) in tabList" :key="index" 
            class="tab" :class="{ 'active': active === tab }"
            @click="goTab(tab)" >
            {{ tab }}
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
.tab {
    &.active {
        color: blue;
    }
}
</style>
