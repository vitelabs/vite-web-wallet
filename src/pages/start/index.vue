<template>
    <layout>
        <start v-if="$route.name === 'start'"></start>
        <router-view></router-view>
        <first-notice v-if="$route.name === 'start'"></first-notice>
    </layout>
</template>

<script>
import firstNotice from 'components/firstNotice.vue';
import layout from './layout';
import start from './start';

export default { components: { layout, start, firstNotice } };
</script>
