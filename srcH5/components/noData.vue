<template>
    <div class="no-data-wrapper">
        <div class="no-data">
            <img src="~assets/imgs/dexEmpty.svg"/>
            <div>{{ $t('hint.noData') }}</div>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.no-data-wrapper {
    flex: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
}

.no-data {
    width: 100%;
    padding: 55px 0;
    text-align: center;
    font-size: 14px;
    @include font-normal();
    color: rgba(62,74,89,0.45);
    line-height: 18px;
    img {
        width: 80px;
        height: 80px;
        margin-bottom: 10px;
    }
}
</style>
