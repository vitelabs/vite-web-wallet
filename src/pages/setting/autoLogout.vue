<template>
    <div class="auto-logout-wrapper">
        <div class="title">{{ $t('setting.autoLogout') }}</div>

        <div class="list">
            <div v-for="(time, index) in timeList" :key="index"
                 class="item" @click="setTime(time)">
                {{ $t(`setting.timeList.${time}`) }}
            </div>
        </div>
    </div>
</template>

<script>
import localStorage from 'utils/localStorage';

export default {
    data() {
        return {
            timeList: [5, 10, 30, 60, 12 * 60]  // Minutes
        };
    },
    methods: {
        setTime(time) {
            localStorage.setItem('autoLogoutTime', time);
        }
    }
};
</script>
