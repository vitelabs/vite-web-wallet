/**  vite-wallet index-layout */

<template>
    <div class="start-wrapper">
        <div class="__title">{{$t('nav.head.create')}}</div>
        
        <router-link class="__btn __btn_all_in" :to="{
            name: 'createAccount'
        }">{{ $t('start') }}</router-link>
        <router-link class="__btn __btn_border _top" :to="{
            name: 'importAccount'
        }">{{ $t('btn.imported') }}</router-link>
        <router-link class="__btn_link _top" :to="{
            name: 'restore'
        }">{{$t('mnemonic.restore')}}</router-link>
    </div>
</template>

<style lang="scss" scoped>
._top {
    margin-top: 20px;
}
</style>
