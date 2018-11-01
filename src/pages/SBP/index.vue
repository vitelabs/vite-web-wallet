<template>
    <div class="SBP-wrapper">
        <div class="SBP-header">
            <div @click="showHelp">{{ $t('SBP.help.title') }}</div>
        </div>
        <router-view/>
    </div>
</template>

<script>

export default {
    created() {
        this.active = this.$route.name;
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
    },
    methods: {
        showHelp() {
            this.$confirm({
                title: this.$t('SBP.help.title'), 
                singleBtn: true, 
                closeBtn: {
                    show: false
                },
                leftBtn: {
                    text: this.$t('btn.understand')
                }, 
                content: this.$t('SBP.help.text')
            });
            return;
        }
    }
};
</script>


<style lang="scss" scoped>

</style>
