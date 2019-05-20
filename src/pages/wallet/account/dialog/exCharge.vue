
<template lang="pug">
extends /components/dialog/base.pug
            <div class="__row">
                <div class="__row-t">{{ c.lable1 }}
                </div>
                <div class="input un-click-able">
                    <img :src="c.icon" />
                    {{ balance[c.tokenId].tokenSymbol }}
                    <div class="num">
                        {{ c.type.toLowerCase()==="recharge" ? balance[c.tokenId].balance : balance[c.tokenId].available }}
                    </div>
                </div>
            </div>
            <div class="__row">
                <div class="__row-t">{{ c.lable2 }}
                    <span class="__err __hint">{{ c.errTips }}</span>
                </div>
                <vite-input v-model="opNumber" :placeholder="c.placeholder">
                    <span slot="after" class="all-amount __pointer" @click="setOpNumberAll(c)">{{ $t('tradeAssets.all') }}</span>
                </vite-input>
            </div>
</template>

<script>
