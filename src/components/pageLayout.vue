<template>
    <div class="page-layout-wrapper" @click="operate">
        <div class="page-wrapper">
            <sidebar class="sidebar" :title="title"></sidebar>
            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from 'components/sidebar';

let operateTimeout = null;

export default {
    components: {
        sidebar
    },
    props: {
        title: {
            type: String,
            default: '',
        }
    },
    mounted() {
        this.operate();
    },
    destroyed() {
        this.logout();
    },
    methods: {
        operate() {
            clearTimeout(operateTimeout);
            operateTimeout = null;

            operateTimeout = setTimeout(()=>{
                operateTimeout = null;
                this.logout();
            }, 5*60*1000);
        },
        logout() {
            this.$router.push({
                name: 'login'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.page-layout-wrapper {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}
.head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-image: linear-gradient(126deg, #1B3BD8 0%, #176CE0 31%, #0B92E7 49%, #0BB6EB 71%, #00E0F2 100%);
    text-align: center;
    .sync-block {
        display: inline-block;
        line-height: 60px;
    }
}
.page-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fafcff;
    .sidebar {
        float: left;
        width: 118px;
    }
    .page-content {
        margin-left: 118px;
        height: 100%;
        overflow: auto;
    }
}
</style>
