<template>
    <div class="quota-wrapper">
        <quota-head></quota-head>
        
        <div class="content">
            <my-quota class="my-quota _content_border"></my-quota>
            <pledge-tx ref="submitPledge" :showConfirm="showConfirm" class="pledge-tx _content_border"></pledge-tx>
        </div>

        <div class="list"> <list></list> </div>

        <div v-if="showConfirmType" class="confirm">
            <confirm :title="$t(`quota.confirm.${ showConfirmType }.title`)" :closeIcon="false"
                     :leftBtnTxt="$t(`quota.confirm.${ showConfirmType }.leftBtn`)" :leftBtnClick="closeConfirm"
                     :rightBtnTxt="$t(`quota.confirm.${ showConfirmType }.rightBtn`)" :rightBtnClick="submit">
                {{ $t(`quota.confirm.${ showConfirmType }.describe`) }}
            </confirm>
        </div>
    </div>
</template>

<script>
import quotaHead from './quotaHead';
import myQuota from './myQuota';
import pledgeTx from './pledgeTx';
import list from './list';
import confirm from 'components/confirm';

export default {
    components: {
        quotaHead, myQuota, pledgeTx, confirm, list
    },
    data() {
        return {
            showConfirmType: ''
        };
    },
    methods: {
        showConfirm(type) {
            this.showConfirmType = type || 'submit';
        },
        closeConfirm() {
            this.showConfirmType = '';
        },
        submit() {
            if (this.showConfirmType !== 'cancel') {
                let submitPledgeEle = this.$refs.submitPledge;
                submitPledgeEle && submitPledgeEle.sendPledgeTx();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.quota-wrapper {
    padding: 40px;
}
.content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 40px;
    ._content_border {
        padding: 30px;
        background: #FFFFFF;
        border: 1px solid #F6F5F5;
        box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
        border-radius: 2px;
    }
    .my-quota {
        box-sizing: border-box;
        width: 170px;
        margin-right: 40px;
    }
    .pledge-tx {
        flex: 1;
        max-width: 100%;
        box-sizing: border-box;
    }
}
.list {
    width: 100%;
    overflow: auto;
    background: #FFFFFF;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
}
.confirm {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
}

@media only screen and (max-width: 500px) {
    .content ._content_border {
        padding: 15px;
    }
    .content {
        margin-bottom: 20px;
    }
    .quota-wrapper {
        padding: 15px;
    }
}

@media only screen and (max-width: 950px) {
    .content .my-quota {
        margin-right: 0;
        width: 100%;
        margin-bottom: 20px;
    }
}
</style>
