<template>
    <div class="quota-wrapper">
        <quota-head></quota-head>
        <div class="content">
            <my-quota class="my-quota __form_border"></my-quota>
            <pledge-tx class="pledge-tx"></pledge-tx>
        </div>
        <div v-if="showTeamBtn">
            <button @click="unlock">Withdraw Team Vite</button>
        </div>
        <list></list>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
const { Vite_TokenId } = constant;

import quotaHead from './quotaHead';
import myQuota from './myQuota';
import pledgeTx from './pledgeTx';
import list from './list';
import viteInput from 'components/viteInput';
import sendTx from 'pcUtils/sendTx';
import { execWithValid } from 'pcUtils/execWithValid';


export default {
    components: { quotaHead, myQuota, pledgeTx, list, viteInput },
    computed: {
        showTeamBtn() {
            return this.$store.getters.activeAddr === 'vite_0292eff258aacf57820195e3518e128a4eac5224689410d899';
        }
    },
    methods: {
        unlock() {
            this.withdrawTeamVite();
        },
        withdrawTeamVite: execWithValid(function () {
            sendTx({
                methodName: 'callContract',
                abi: JSON.parse('{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}'),
                data: {
                    abi: JSON.parse('{"constant":false,"inputs":[],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}'),
                    toAddress: 'vite_8588d741af13504d79154312f9f4838789aa06d3d0e1b4bea1',
                    params: [],
                    tokenId: Vite_TokenId
                }
            }).then(data => {
                console.log(data);
            }).catch(err => {
                console.log(err);
            });
        })
    }
};
</script>

<style lang="scss" scoped>
@import "../form.scss";

.quota-wrapper {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 14px;
    .my-quota {
        box-sizing: border-box;
        min-width: 170px;
        margin-right: 10px;
        padding: 22px 30px;
    }
    .pledge-tx {
        flex: 1;
        max-width: 100%;
        box-sizing: border-box;
        padding: 6px 30px 20px 30px;
    }
}
</style>
