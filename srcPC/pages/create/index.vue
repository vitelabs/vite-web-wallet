<template>
    <div class="create-pc-account-wrapper">
        <create v-show="showView === 'createAccount'" :toNext="toNext"></create>
        <record v-show="showView === 'record'" :goBack="goBack" :name="name" :pass="pass" ></record>
        <process class="process" :active="showView"></process>
    </div>
</template>

<script>
import create from './create.vue';
import record from './record.vue';
import process from './process.vue';

export default {
    components: { create, process, record },
    data() {
        return {
            name: '',
            pass: '',
            showView: 'createAccount'
        };
    },
    methods: {
        toNext(name, pass) {
            this.name = name;
            this.pass = pass;
            this.showView = 'record';
        },
        goBack() {
            this.name = '';
            this.pass = '';
            this.showView = 'createAccount';
        }
    }
};
</script>

<style lang="scss" scoped>
@use "./create.scss";

.create-pc-account-wrapper {
    width: 360px;
}
</style>

