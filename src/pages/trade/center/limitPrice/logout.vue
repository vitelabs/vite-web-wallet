<template>
    <div class="logout">
        <div class="text">{{ $t("trade.limitPrice.text") }}</div>
        <div class="btn btn-login __pointer" @click="leftClick">
            {{ isHaveUsers ? $t("unlockAcc") : $t("login") }}
        </div>
        <div class="btn btn-register __pointer" @click="rightClick">
            {{ isHaveUsers ? $t("changeAcc") : $t("register") }}
        </div>
    </div>
</template>

<script>
import { execWithValid } from 'utils/execWithValid';

export default {
    computed: {
        isHaveUsers() {
            return !!this.$store.state.wallet.currHDAcc;
        }
    },
    methods: {
        leftClick: execWithValid(function () {
        },
        function () {
            this.$router.push({ name: 'start' });
        }),
        rightClick: execWithValid(function () {
            this.$router.push({ name: 'start' });
        },
        function () {
            this.$router.push({ name: 'startCreate' });
        })
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";

.logout {
    box-sizing: border-box;
    width: 100%;
    padding: 68px 22px;
    text-align: center;

    .text {
        color: rgba(36, 39, 43, 1);
        margin-bottom: 54px;
    }

    .btn {
        box-sizing: border-box;
        width: 48%;
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        @include font-family-bold();
        font-weight: 600;
    }

    .btn-login {
        float: left;
        background: $blue;
        color: rgba(251, 251, 251, 1);
    }

    .btn-register {
        float: right;
        border: 1px solid $blue;
        color: $blue;
    }
}
</style>
