<template>
    <div class="operator-wrapper">
        <sec-title :isShowHelp="false"></sec-title>
        <income></income>
        <token-list></token-list>
    </div>
</template>

<script>
import income from './income.vue';
import tokenList from './tokenList';
import secTitle from 'components/secTitle';

export default { components: { income, secTitle, tokenList } };
</script>
