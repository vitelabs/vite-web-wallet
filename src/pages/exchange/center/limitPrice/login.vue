<template>
    <div class="ex-center-login">
        <order orderType="buy"></order>
        <div class="order-border"></div>
        <order orderType="sell" class="order-wrapper"></order>
    </div>
</template>

<script>
import order from './order.vue';

export default {
    components: {
        order
    }
};
</script>


<style lang="scss" scoped>
.ex-center-login {
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 8px 0 10px;
    .order-border {
        height: 100%;
        opacity: 0.136;
        border: 1px solid rgba(212,222,231,1);
    }
}
</style>
