<template>
    <div @click="showHelp">{{ $t('vote.help.title') }}</div>
</template>

<script>
export default {
    methods: {
        showHelp() {
            this.$confirm({
                title: this.$t('vote.help.title'), 
                singleBtn: true, 
                closeBtn: {
                    show: false
                },
                leftBtn: {
                    text: this.$t('btn.understand')
                }, 
                content: this.$t('vote.help.text')
            });
        }          
    }
};
</script>
