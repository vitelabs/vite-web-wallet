<template>
    <div ref="lottieContainer" class="lottie__container"/>
</template>


<script>
import lottie from 'lottie-web';

const getData = {
    plugAndPinCode: async theme => {
        if (!theme) {
            return import('./plugAndPinCode/light.json');
        }
        return import('./plugAndPinCode/dark.json');
    },
    openApp: async theme => {
        if (!theme) {
            return import('./openApp/light.json');
        }
        return import('./openApp/dark.json');
    },
    validate: async theme => {
        if (!theme) {
            return import('./validate/light.json');
        }
        return import('./validate/dark.json');
    }
};

export default {
    props: {
        type: { required: true },
        speed: {
            type: Number,
            required: false,
            default: 1
        },
        width: {
            type: Number,
            required: false,
            default: -1
        },
        height: {
            type: Number,
            required: false,
            default: -1
        },
        loop: {
            type: Boolean,
            required: false,
            default: true
        },
        autoPlay: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data: () => {
        return { data: null };
    },
    computed: {
        theme() {
            return +this.$store.state.env.theme;
        }
    },
    mounted() {
        this.init();
    },
    watch: {
        type: function (newValue, oldValue) {
            this.init();
        },
        theme: function (newValue, oldValue) {
            this.init();
        }
    },
    methods: {
        async init() {
            const data = await getData[this.type](this.theme);

            if (this.lottie) this.lottie.destroy();

            this.lottie = lottie.loadAnimation({
                container: this.$refs.lottieContainer,
                renderer: 'svg',
                loop: this.loop,
                autoplay: this.autoPlay,
                animationData: data
            });

            this.lottie.setSpeed(this.speed);
        }
    }
};
</script>

<style lang="scss" scoped>
    .lottie__container {
        width: 100%;
    }
</style>
