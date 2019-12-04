<template>
    <div class="create-account-wrapper">
        <create v-show="showView === 'createAccount'" :toNext="toNext"></create>
        <record v-show="showView === 'record'" :goBack="goBack" :name="name" :pass="pass" ></record>
        <process class="process" :active="showView"></process>
    </div>
</template>

<script>
import create from './create.vue';
import record from './record.vue';
import process from './process';

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
@import "./create.scss";

.create-account-wrapper {
    position: absolute;
    padding: 50px;
    top: 20px;
    left: 200px;
    width: 380px;
    background: rgba(0,100,255,1);
}
</style>

