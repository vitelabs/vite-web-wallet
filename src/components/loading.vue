<template>
    <div class="loading-ring"> <div></div> </div>    
</template>

<style lang="scss" scoped>
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
    border: 6px solid #195ADD;
    border-radius: 50%;
    animation: lds-ring 1.2s linear infinite;
    border-color: #195ADD #195ADD #195ADD transparent;
}
@keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
