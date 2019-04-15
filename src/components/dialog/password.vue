<template lang="pug">
extends ./base.pug
block content
    div sample
</template>

<script>
export default {
    data() {
        return { inspector: [this.submit] };
    },
    methods: {
        submit() {
            return Promise.resolve({});
        }
    }
};
</script>

