<template>
    <ul class="ex-tab-list">
        <li v-for="(_t, i) in toTokenList" :key="i" class="ex-tab __pointer" 
            :class="{'active': _t.token === activeTokenId}" 
            @click="changeToken(_t)">{{ _t.name }}</li>
    </ul>
</template>

<script>
import { baseToken } from 'services/exchange';

export default {
    props: {
        setToTokenId: {
            type: Function,
            default: () => {}
        }
    },
    created() {
        baseToken().then((data) => {
            this.toTokenList = data || [];
            this.activeTokenId = this.toTokenList && this.toTokenList.length ? 
                this.toTokenList[0].token : '';
        }).catch((err) => {
            console.warn(err);
        });
    },
    data() {
        return {
            toTokenList: [],
            activeTokenId: ''
        };
    },
    watch: {
        activeTokenId: function() {
            this.setToTokenId( this.activeTokenId );
        }
    },
    methods: {
        changeToken(_token) {
            this.activeTokenId = _token.token;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';
</style>
