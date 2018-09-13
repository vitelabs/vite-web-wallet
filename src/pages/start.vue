<template>
    <div class="start-wrapper">
        <div class="__title">创建账户</div>
        
        <router-link class="__btn __btn_all_in" :to="{
            name: 'createAccount',
            params: { from: 'start' }
        }">{{ $t('start') }}</router-link>
        <router-link class="__btn __btn_border _top" :to="{
            name: 'importAccount',
            params: { from: 'start' }
        }">{{ $t('btn.imported') }}</router-link>
        <router-link class="__btn_link _top" :to="{
            name: 'restore'
        }">助记词恢复账户</router-link>
    </div>
</template>

<style lang="scss" scoped>
._top {
    margin-top: 20px;
}
</style>
