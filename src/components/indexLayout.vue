<template>
    <div class="index-layout-wrapper">
        <div class="header">
            <img class="header-logo __pointer" src="../assets/imgs/ViteLogo1.svg" />
            <change-lang class="change-lang __pointer"></change-lang>
        </div>
        <div class="confirm-wrapper">
            <div class="confirm">
                <slot></slot>
                <process class="process"></process>
            </div>
        </div>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';
import process from 'components/process';

export default {
    components: {
        changeLang, process
    }
};
</script>

<style lang="scss" scoped>
.index-layout-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: url('../assets/imgs/bg.svg') rgba(255, 255, 255, 0.1) no-repeat;
    background-size: cover;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        padding: 40px;
        .header-logo {
            display: inline-block;
            width: 90px;
        }
        .change-lang {
            float: right;
        }
    }

    .confirm-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .confirm {
            position: relative;
            width: 390px;
            text-align: center;
            .process {
                margin-top: 60px;
            }
        }
    }
}
</style>
