<template>
    <div class="page-layout-wrapper" @click="operate">
        <div class="page-wrapper">
            <sidebar class="sidebar" :active="active"></sidebar>
            <vite-menu class="menu" :active="active"></vite-menu>

            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from 'components/sidebar';
import viteMenu from 'components/menu';

let operateTimeout = null;

export default {
    components: {
        sidebar, viteMenu
    },
    props: {
        active: {
            type: String,
            default: '',
        }
    },
    mounted() {
        this.operate();
    },
    methods: {
        operate() {
            clearTimeout(operateTimeout);
            operateTimeout = null;

            operateTimeout = setTimeout(()=>{
                operateTimeout = null;
                location.reload();
            }, 5 * 60 * 1000);
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
    .menu {
        display: none;
    }
    .sidebar {
        float: left;
        width: 70px;
    }
}
.page-content {
    margin-left: 70px;
    height: 100%;
    overflow: auto;
    .__wrapper {
        padding: 40px;
    }
}

@media only screen and (max-width: 750px) {
    .page-wrapper .page-content .__wrapper {
        padding: 15px;
    }
}

@media only screen and (max-width: 500px) {
    .page-wrapper {
        display: flex;
        flex-direction: column;
    }
    .page-wrapper .menu  {
        display: block;
    }
    .page-wrapper .sidebar  {
        display: none;
    }
    .page-wrapper .page-content {
        flex: 1;
        margin-left: 0;
    }
}
</style>
