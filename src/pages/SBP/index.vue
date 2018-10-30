<template>
    <div class="SBP-wrapper">
        <div class="SBP-header">
            <router-link :to="{ name: 'SBPRegistered' }">
                go to SBP registered
            </router-link>
            <router-link :to="{ name: 'SBPVote' }">
                go to SBP vote
            </router-link>
            <div>help</div>
        </div>
        <router-view/>
    </div>
</template>

<script>

export default {

};
</script>


<style lang="scss" scoped>

</style>
