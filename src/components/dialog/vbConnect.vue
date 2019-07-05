<template lang="pug">
extends /components/dialog/base.pug
block content
    qrcode(:options="qrcodeOpt" :text="uri" class="code_container" )
</template>

<script>
import { initVB, vbInstance } from 'wallet/vb';
import qrcode from 'components/qrcode';
import icon from 'assets/imgs/start_qrcode_icon.svg';

export default {
    components: { qrcode },
    data() {
        return {
            qrcodeOpt: {
                size: 140,
                image: icon,
                mSize: 0.3
            }
        };
    },
    beforeMount() {
        initVB().on('connect', () => {
            this.close();
        });
    },
    computed: {
        uri() {
            return vbInstance && vbInstance.uri;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
</style>

