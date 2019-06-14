<template>
    <div class="qrcode" ref="qrcode"></div>
</template>

<script>
import { qrcode, modes, ecLevel } from 'qrcode.es';
import logo from 'assets/imgs/qrcode_addr.png';

const defaultOpt = {
    size: 300,
    ecLevel: ecLevel.QUARTILE,
    minVersion: 4,
    background: '#fff',
    mode: modes.DRAW_WITH_IMAGE_BOX,
    radius: 0,
    image: logo,
    mSize: 0.24
};

export default {
    props: {
        options: {
            type: Object,
            default: () => defaultOpt
        },
        text: ''
    },
    data() {
        return { qrcode: '' };
    },
    mounted() {
        this.genCode();
    },
    methods: {
        genCode() {
            if (!this.text) {
                return;
            }

            // Initializing the QrCode
            this.$refs.qrcode.innerHTML = '';
            const q = new qrcode(this.$refs.qrcode);

            // Function that generates the QrCode
            q.generate(this.text, Object.assign({}, defaultOpt, this.options)).then(() => {
                this.image = q.getImage();
                this.$emit('genImage', this.image);
            });
        }
    },
    watch: {
        text() {
            this.genCode();
        }
    }
};
</script>
