<template>
    <div class="invite-detail">
        <div class="__second-title">{{ $t('inviteMining.myInviteIncome') }}</div>
        <div class="describe">
            {{ $t('tradeMining.inviteCount') }}: {{ inviter ? inviter.inviteCount || 0 : 0 }}
        </div>
    </div>
</template>

<script>
import { getInviteInfo } from 'services/trade';

export default {
    beforeMount() {
        this.getInviteInfo();
    },
    data() {
        return { inviter: null };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        address() {
            this.inviter = null;
            this.getInviteInfo();
        }
    },
    methods: {
        getInviteInfo() {
            getInviteInfo(this.address).then(data => {
                this.inviter = data || null;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "~pcAssets/scss/common.scss";

@include secondTitle();
.__second-title {
    margin-bottom: 8px;
}

.describe {
    font-size: 14px;
    color: #5e6875;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 14px;
    font-weight: 400;
}
</style>
