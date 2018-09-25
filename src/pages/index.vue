<template>
    <div class="app-wrapper">
        <index-layout v-if="layoutType === 'logo'">
            <router-view/>
        </index-layout>

        <page-layout v-else :title="pageTitle" >
            <router-view/>
        </page-layout>

        <update></update>
    </div>
</template>

<script>
import indexLayout from 'components/indexLayout.vue';
import pageLayout from 'components/pageLayout.vue';
import update from 'components/update.vue';

const pageLayouts = ['account', 'transList', 'setting'];

export default {
    components: {
        indexLayout, pageLayout, update
    },
    mounted() {
        this.changeLayout(this.$route.name);
        this.$router.afterEach((to)=>{
            this.changeLayout(to.name);
        });
    },
    data() {
        return {
            layoutType: 'logo',
            pageTitle: ''
        };
    },
    methods: {
        changeLayout(name, next) {
            let i = pageLayouts.indexOf(name);

            if (i === -1) {
                this.layoutType = 'logo';
                next && next();
                return;
            }

            this.layoutType = 'page';
            this.pageTitle = pageLayouts[i];
            next && next();
        }
    }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
</style>
