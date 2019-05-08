<template>
    <div class="switch-address-wrapper">
        <span class="list-title" :class="{
            'down': !showTime,
            'up': showTime
        }" @click="toggletimeList">{{ address }}</span>
        <ul class="list" v-show="showTime">
            <li v-for="(time, index) in timeList" :key="index" v-show="time !== autoLogoutTime"
                @click="setTime(time)">{{ $t(`setting.timeList.${time}`) }}</li>
        </ul>
    </div>
</template>

<script>
import ellipsisAddr from 'utils/ellipsisAddr';

export default {
    props: {
        isShowAddr: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return { isShowList: false };
    },
    computed: {
        address() {
            const address = this.$store.state.activeAccount.address;
            return ellipsisAddr(address, 5);
        }
    }

};
</script>

<style lang="scss" scoped>
@import "~assets/scss/list/setting.scss";

</style>
