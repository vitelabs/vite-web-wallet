<template>
    <div class="auto-logout-wrapper">
        <div class="title">{{ $t('setting.noPass') }}</div>

        <div class="setting common-list-wrapper __pointer">
            <span class="list-title" :class="{
                'down': !showTime,
                'up': showTime
            }" @click="toggletimeList">{{ $t(`setting.timeList.${noPassTime}`) }}</span>
            <ul class="list" v-show="showTime">
                <li v-for="(time, index) in timeList" :key="index" v-show="time !== noPassTime"
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
            noPassTime: localStorage.getItem('noPass') || 5,
            showTime: false,
            // Minutes
            timeList: [ 5, 10, 30, 60, 12 * 60 ]
        };
    },
    methods: {
        setTime(time) {
            localStorage.setItem('noPass', time);
            this.noPassTime = time;
            this.toggletimeList();
        },
        toggletimeList() {
            this.showTime = !this.showTime;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/list/setting.scss";

.title {
    font-size: 14px;
    color: #1d2024;
    font-family: $font-bold, arial, sans-serif;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 16px;
}
</style>
