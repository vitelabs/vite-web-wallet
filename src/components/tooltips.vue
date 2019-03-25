<template>
    <div class="tool-tips">
        <div class="trigle"></div>
        {{content}}
    </div>
</template>
<script>
export default {
    props: {
        content: {
            type: String,
            default: ''
        }
    }
};
</script>
<style lang="scss" scoped>
.tool-tips {
    position: absolute;
    display: flex;
    align-content: center;
    left: calc(100% + 7px);
    top: 50%;
    transform: translateY(-50%);
    background: #fff;
    box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    box-sizing: border-box;
    line-height: 20px;
    padding: 10px;

    .trigle {
        border-top: 7px solid transparent;
        border-bottom: 7px solid transparent;
        border-right: 7px solid #fff;
        height: 0;
        width: 0;
        position: absolute;
        box-sizing: border-box;
        top: 50%;
        transform: translateY(-50%);
        left: -7px;
    }
}
</style>
