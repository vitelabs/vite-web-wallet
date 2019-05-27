<template>
    <layout>
        <start v-if="active === 'start'"></start>
        <router-view></router-view>
        <first-notice v-if="active === 'start'"></first-notice>
    </layout>
</template>

<script>
import firstNotice from 'components/firstNotice.vue';
import layout from './layout';
import start from './start';

export default {
    components: { layout, start, firstNotice },
    mounted() {
        this.$router.afterEach(to => {
            this.active = to.name;
        });
    },
    data() {
        return { active: this.$route.name };
    }
};
</script>
