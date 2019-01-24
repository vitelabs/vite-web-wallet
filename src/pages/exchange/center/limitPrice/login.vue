<template>
    <div class="ex-center-login">
        <buy class="order-wrapper"></buy>
        <div class="order-border"></div>
        <sell class="order-wrapper"></sell>
    </div>
</template>

<script>
import buy from './buy';
import sell from './sell';

export default {
    components: {
        buy, sell
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
    padding: 10px 0;
    .order-wrapper {
        flex: 1;
        padding: 0 22px;
    }
    .order-border {
        width: 1px;
        height: 100%;
        opacity: 0.136;
        border: 1px solid rgba(212,222,231,1);
    }
}
</style>
