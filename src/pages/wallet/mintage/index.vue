<template>
    <div class="mintage-wrapper">
        <sec-title :isShowHelp="false"></sec-title>
        <mintage></mintage>
        <tokenList></tokenList>
    </div>
</template>

<script>
import tokenList from './tokenList';
import mintage from './mintage';
import secTitle from 'components/secTitle';

export default { components: { tokenList, secTitle, mintage } };
</script>

<style lang="scss" scoped>
.mintage-wrapper {
    width: 100%;
}

.list-wrapper {
    margin-top: 20px;
}
</style>
