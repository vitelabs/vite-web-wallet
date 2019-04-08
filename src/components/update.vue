<template>
    <div v-show="versionList.length">
        <notice v-for="(version, index) in versionList" :key="index"
                :isShowClose="true" :close="close" :rawData="index"
                :title="version.version"
                :describe="$t('lang') === '中文' ? version.zh : version.en"></notice>
    </div>
</template>

<script>
import version from 'version';
import notice from 'components/notice';
import localStorage from 'utils/localStorage';

const version_key = 'version';
const showNum = 1;

export default {
    components: { notice },
    data() {
        return {
            versionList: [],
            latestCode: ''
        };
    },
    mounted() {
        // "1": {
        // "version": "0.0.1",
        // "zh": "0.0.1 中文版 版本描述",
        // "en": "0.0.1 english version",
        // "time": "22329382932"
        // }
        const lastVersion = localStorage.getItem(version_key) || null;

        const currentCode = lastVersion ? lastVersion.currentCode || 0 : 0;
        let lastList = lastVersion ? lastVersion.showList || [] : [];

        this.versionList = [];
        for (const code in version) {
            if (currentCode >= code) {
                continue;
            }

            version[code].code = code;
            this.versionList.push(version[code]);
        }

        if (this.versionList.length >= showNum) {
            this.versionList = this.versionList.slice(this.versionList.length - showNum);
            this.latestCode = this.versionList[this.versionList.length - 1].code;
            this.saveVersion();

            return;
        }

        const len = showNum - this.versionList.length;
        lastList = lastList.length <= len ? lastList : lastList.slice(lastList.length - len);
        this.versionList = lastList.concat(this.versionList);
        this.latestCode = this.versionList.length ? this.versionList[this.versionList.length - 1].code : null;
        this.latestCode && this.saveVersion();
    },
    methods: {
        close(index) {
            this.versionList.splice(index, 1);
            this.saveVersion();
        },
        saveVersion() {
            localStorage.setItem(version_key, {
                currentCode: this.latestCode,
                showList: this.versionList
            });
        }
    }
};
</script>
