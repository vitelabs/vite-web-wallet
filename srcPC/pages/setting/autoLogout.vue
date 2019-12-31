<template>
    <div class="auto-logout-wrapper">
        <div class="small-title bold">{{ $t('setting.autoLogout') }}</div>
        <div class="describe">{{ $t('setting.logoutDescribe') }}</div>

        <div class="setting common-list-wrapper __pointer">
            <span class="list-title" :class="{
                'down': !showTime,
                'up': showTime
            }" @click="toggletimeList">{{ $t(`setting.timeList.${autoLogoutTime}`) }}</span>
            <ul class="list" v-show="showTime">
                <li v-for="(time, index) in timeList" :key="index" v-show="time !== autoLogoutTime"
                    @click="setTime(time)">{{ $t(`setting.timeList.${time}`) }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showTime: false,
            // Minutes
            timeList: [ 5, 10, 30, 60, 12 * 60 ]
        };
    },
    computed: {
        autoLogoutTime() {
            return this.$store.state.env.autoLogoutTime;
        }
    },
    methods: {
        setTime(time) {
            this.$store.commit('setAutoLogoutTime', time);
            this.toggletimeList();
        },
        toggletimeList() {
            this.showTime = !this.showTime;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~pcAssets/scss/list/setting.scss";
@import "./setting.scss";

.describe {
    line-height: 16px;
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 10px;
    @include setting_common_color();
}
</style>
