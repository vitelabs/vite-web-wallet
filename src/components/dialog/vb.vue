<template lang="pug">
extends /components/dialog/base.pug
block content
    div 正在发送交易
</template>

<script>

export default {
    data(){
        return {
            dShowClose:false
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

</style>

