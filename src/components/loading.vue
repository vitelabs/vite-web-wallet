<template>
    <div class="loading-wrapper">
        <div v-if="loadingType === 'ring'" class="loading-ring"> <div></div> </div>
        <div v-if="loadingType === 'dot'" class="dot">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        loadingType: {
            type: String,
            default: 'ring'
        }
    }
};
</script>

<style lang="scss" scoped>
.loading-wrapper {
    display: inline-block;
}

.loading-ring {
    box-sizing: border-box;
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -60px;
    margin-left: -60px;
    width: 120px;
    height: 120px;
    border: 6px solid #dfdfdf;
    border-radius: 50%;
}

.loading-ring div {
    display: block;
    position: absolute;
    top: -6px;
    right: -6px;
    width: 100%;
    height: 100%;
    border: 6px solid #195add;
    border-radius: 50%;
    animation: lds-ring 1.2s linear infinite;
    border-color: #195add #195add #195add transparent;
}

@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.dot {
    display: inline-block;
}

.dot > div {
    width: 8px;
    height: 8px;
    background-color: #fff;
    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.dot .bounce1 {
    animation-delay: -0.32s;
}

.dot .bounce2 {
    animation-delay: -0.16s;
}

@keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
        opacity: 0.1;
        transform: scale(0.3);
    }

    40% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
