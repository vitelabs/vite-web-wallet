<template>
    <div class="address-title">
        <span>{{ title }}</span>
        <img
            src="../assets/imgs/copy_default.svg"
            @click="copy"
            class="title_icon copy __pointer"
        />
        <copyOK :copySuccess="copySuccess"></copyOK>
    </div>
</template>

<script>
import qrcode from 'components/qrcode';
import copyOK from 'components/copyOK';
import copy from 'utils/copy';

export default {
    components: { qrcode, copyOK },
    props: {
        title: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        }
    },
    data() {
        return { copySuccess: false };
    },
    methods: {
        copy() {
            copy(this.address);
            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.address-title {
    position: relative;
    display: block;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    letter-spacing: 0.35px;
    padding-bottom: 11px;
    font-family: $font-bold, arial, sans-serif;
}

.title_icon {
    float: right;
    &.copy {
        margin-right: 10px;
    }
}
</style>
