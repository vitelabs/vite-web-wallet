<template>
    <div class="mintage-wrapper">
        <sec-title :isShowHelp="false"></sec-title>
        <mintage @fetchTokenList="fetchTokenList"></mintage>
        <tokenList ref="tokenListDom"></tokenList>
    </div>
</template>

<script>
import tokenList from './tokenList';
import mintage from './mintage';
import secTitle from 'components/secTitle';

export default {
    components: { tokenList, secTitle, mintage },
    methods: {
        fetchTokenList() {
            const dom = this.$refs.tokenListDom;
            dom && dom.getOwnerToken();
        }
    }
};
</script>

<style lang="scss" scoped>
.mintage-wrapper {
    width: 100%;
}

.list-wrapper {
    margin-top: 20px;
}
</style>
