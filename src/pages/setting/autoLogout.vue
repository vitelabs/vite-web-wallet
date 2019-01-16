<template>
    <div class="auto-logout-wrapper">
        <div class="title">{{ $t('setting.autoLogout') }}</div>

        <div class="setting change-lang-wrapper __pointer">
            <span class="lang" :class="{
                'down': !showTime,
                'up': showTime
            }" @click="toggletimeList">{{ $t(`setting.timeList.${autoLogoutTime}`) }}</span>
            <ul class="lang-list" v-show="showTime">
                <li v-for="(time, index) in timeList" :key="index" 
                    @click="setTime(time)">{{ $t(`setting.timeList.${time}`) }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import localStorage from 'utils/localStorage';

export default {
    data() {
        return {
            autoLogoutTime: localStorage.getItem('autoLogoutTime') || 5,
            showTime: false,
            timeList: [5, 10, 30, 60, 12 * 60]  // Minutes
        };
    },
    methods: {
        setTime(time) {
            localStorage.setItem('autoLogoutTime', time);
            this.autoLogoutTime = time;
            this.toggletimeList();
        },
        toggletimeList() {
            this.showTime = !this.showTime;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/lang/setting.scss";

.title {
    font-size: 14px;
    color: #1D2024;
    font-family: $font-bold, arial, sans-serif;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 16px;
}
</style>
