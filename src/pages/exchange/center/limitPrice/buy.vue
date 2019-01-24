<template>
    <div>
        <div class="order-title">
            {{ $ }}
        </div>

        <div class="order-row-title"></div>
        <vite-input class="search-input" v-model="searchText" :placeholder="$t('exchange.search')">

        </vite-input>

        <div class="order-row-title"></div>
        <vite-input class="search-input" v-model="searchText" :placeholder="$t('exchange.search')">

        </vite-input>

        <div class="order-row-title"></div>
        <vite-input class="search-input" v-model="searchText" :placeholder="$t('exchange.search')">

        </vite-input>

        <div class="order-btn"></div>
    </div>
</template>

<script>
export default {
    
};
</script>

<style lang="scss" scoped>
@import './order.scss';

</style>

