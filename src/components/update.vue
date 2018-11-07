<template>
    <div v-show="versionList.length" class="update-wrapper">
        <div class="version-wrapper" v-for="(version, index) in versionList" :key="index">
            <img @click="close(index)" src="../assets/imgs/close.svg" class="close __pointer"/>
            <div class="version">{{ version.version }}</div>
            <div class="describe">{{ $t('lang') === '中文' ? version.zh : version.en }}</div>
        </div>
    </div>
</template>

<script>
import version from 'version';
import localStorage from 'utils/localStorage';

const version_key = 'version';
const showNum = 1;

export default {
    data() {
        return {
            versionList: [],
            latestCode: ''
        };
    },
    mounted() {
        // "1": {
        //     "version": "0.0.1",
        //     "zh": "0.0.1 中文版 版本描述",
        //     "en": "0.0.1 english version",
        //     "time": "22329382932"
        // }
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

        if (this.versionList.length >= showNum) {
            this.versionList = this.versionList.slice(this.versionList.length - showNum);
            this.latestCode = this.versionList[this.versionList.length - 1].code;
            this.saveVersion();
            return;
        }

        let len = showNum - this.versionList.length;
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

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.update-wrapper {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 101;
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
    font-family: $font-bold;
    word-wrap: break-word;
    &:before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background-image: linear-gradient(138deg, #052EF5 0%, #094BF3 31%, #0D6DF0 49%, #0B92E7 71%, #0BA8E9 100%);
    }
    .close {
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .version {
        font-size: 16px;
        color: #1D2024;
        line-height: 24px;
    }
    .describe {
        font-size: 14px;
        color: #5E6875;
        line-height: 28px;
    }
}

@media only screen and (max-width: 500px) {
    .update-wrapper {
        z-index: 0;
    }
    .version-wrapper {
        width: 300px;
        padding: 15px;
    }
}
</style>

