<template>
    <div v-show="versionList.length" class="update-wrapper">
        <div class="version-wrapper" v-for="(version, index) in versionList" :key="index">
            <span @click="close(index)" class="close"></span>
            <div class="version">{{ version.version }}</div>
            <div class="describe">{{ version.zh }}</div>
        </div>
    </div>
</template>

<script>
import version from 'version';
import localStorage from 'utils/localStorage';

const version_key = 'version';

export default {
    data() {
        return {
            versionList: [],
            latestCode: ''
        };
    },
    mounted() {
        let lastVersion = localStorage.getItem(version_key) || null;

        let currentCode = lastVersion ? lastVersion.currentCode || 0 : 0;
        let lastList = lastVersion ? lastVersion.showList || [] : [];

        this.versionList = [];
        for (let code in version) {
            if (currentCode >= code) {
                continue;
            }

            version[code].code = code;
            this.versionList.push( version[code] );
        }

        if (this.versionList >= 3) {
            this.versionList = this.versionList.slice(this.versionList.length - 3);
            this.latestCode = this.versionList[2].code;
            this.saveVersion();
            return;
        }

        let len = 3 - this.versionList.length;
        lastList = lastList.length <= len ? lastList : lastList.slice(lastList.length - len);
        this.versionList = lastList.concat(this.versionList);
        this.latestCode = this.versionList.length ? this.versionList[this.versionList.length - 1].code : null;
        this.latestCode && this.saveVersion();
    },
    methods: {
        close(index) {
            this.versionList = this.versionList.slice(index, 1);
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

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.update-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
}
.version-wrapper {
    position: relative;
    background: #FFFFFF;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    width: 360px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 30px;
    &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background-image: linear-gradient(138deg, #052EF5 0%, #0D6DF0 31%, #0B92E7 49%, #0BB6EB 71%, #00E0F2 100%);
    }
    .version {
        font-family: $font-bold;
        font-size: 16px;
        color: #1D2024;
        line-height: 24px;
    }
    .describe {
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #1D2024;
        letter-spacing: 0;
        line-height: 28px;
    }
}
</style>

