<template>
    <div class="bri__network__card">
        <div class="network__title">
            <div class="content">{{ type }}</div>
            <div class="status">{{ status }}</div>
        </div>
        <div class="network__content">
            <div>{{ network }}</div>
            <downCircle style="height:14;width:14;" />
        </div>
        <img class="network__icon" :src="icon" />
    </div>
</template>
<script>
import downCircle from 'assets/imgs/downCircle.svg.vue';

export default {
    props: [ 'type', 'status', 'network', 'icon' ],
    components: { downCircle }
};
</script>
<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import 'pcComponents/confirm/confirmRow.scss';
@import '~pc/styles/form.scss';
.bri__network__card {
    display: flex;
    flex-direction: column;
    width: 244px;
    height: 136px;
    @include common_border();
    border-radius: 2px;
    padding: 20px 12px;
    box-sizing: border-box;
    @include box_shadow();
    .network__title {
        display: flex;
        justify-content: space-between;
    }
    .network__content {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .network__icon {
        margin-top: 20px;
        height: 35px;
    }
}
</style>
