<template>
    <div class="mintage-wrapper">
        <sec-title :isShowHelp="false"></sec-title>
        <mintage @fetchTokenList="fetchTokenList"></mintage>
        <tokenList ref="tokenListDom"></tokenList>
    </div>
</template>

<script>
import tokenList from './tokenList.vue';
import mintage from './mintage.vue';
import secTitle from '@pc/components/secTitle.vue';

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
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
