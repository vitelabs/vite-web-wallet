<template>
    <layout>
        <start v-if="active === 'start'"></start>
        <router-view></router-view>
    </layout>
</template>

<script>
import layout from './layout';
import start from './start';

export default {
    components: { layout, start },
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
