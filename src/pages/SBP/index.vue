<template>
    <div class="SBP-wrapper">
        <div class="SBP-header">
            <router-link :to="{ name: 'SBPRegistered' }">
                go to SBP registered
            </router-link>
            <router-link :to="{ name: 'SBPVote' }">
                go to SBP vote
            </router-link>
            <div @click="showHelp">
                {{ active === 'SBPRegistered' ? $t('SBP.help.registeredTitle') : $t('SBP.help.voteTitle') }}
            </div>
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
            if (this.active === 'SBPRegistered') {
                this.$confirm({
                    title: this.$t('SBP.help.registeredTitle'), 
                    singleBtn: true, 
                    closeBtn: {
                        show: false
                    },
                    leftBtn: {
                        text: this.$t('btn.understand')
                    }, 
                    content: this.$t('SBP.help.registered')
                });
                return;
            }
            this.$confirm({
                title: this.$t('SBP.help.voteTitle'), 
                singleBtn: true, 
                closeBtn: {
                    show: false
                },
                leftBtn: {
                    text: this.$t('btn.understand')
                }, 
                content: this.$t('SBP.help.vote')
            });
        }
    }
};
</script>


<style lang="scss" scoped>

</style>
