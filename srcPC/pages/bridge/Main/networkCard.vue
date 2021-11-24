<template>
    <div class="bri__network__card">
        <div class="network__title">
            <div class="content">{{ type }}</div>
            <div class="status" v-show="status === 'CONNECTED'">
                <div class="dot"></div>
                <div>{{ status === "CONNECTED" ? "connected" : null }}</div>
            </div>
        </div>
        <div class="network__content">
            <vite-select
                @input="oninput"
                :options="netList"
                :searchable="false"
                :clearable="false"
                :class="'net-selector'"
                :value="value"
            ></vite-select>
        </div>
        <img class="network__icon" :src="icon" />
    </div>
</template>
<script>
import downCircle from 'assets/imgs/downCircle.svg.vue';
import viteSelect from 'src/uiKit/viteSelect.vue';

export default {
    props: [ 'type', 'status', 'value', 'icon', 'netList' ],
    components: { downCircle, viteSelect },
    methods: {
        oninput(val) {
            console.log(99999);
            if (val.value === this.value) return;
            this.$emit('input', val.value);
        }
    }
};
</script>
<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "pcComponents/confirm/confirmRow.scss";
@import "~pc/styles/form.scss";
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
        .content {
            @include font-family-bold();
        }
        .status {
            color: #6bd100;
            font-size: 11px;
            display: flex;
            align-items: center;
            .dot {
                height: 4px;
                width: 4px;
                border-radius: 50%;
                background-color: #6bd100;
                margin-right: 4px;
            }
        }
    }
    .network__content {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }
    .network__icon {
        margin-top: 20px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
    }
    .net-selector {
        width: 100%;
        border: none;
        background: none;
        height: 16px;
        padding: 0;
        /deep/ .vs__selected {
            padding: 0;
            margin: 0;
        }
        /deep/ .vs__search {
            display: none;
        }
    }
}
</style>
