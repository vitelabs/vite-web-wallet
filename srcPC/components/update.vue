<template>
    <div v-show="versionList.length">
        <notice v-for="(version, index) in versionList" :key="index"
                :isShowClose="true" :close="close"
                :rawData="index" :title="getTitle(version)"
                :describe="version[$i18n.locale] || version.en"></notice>
    </div>
</template>

<script>
import notice from 'components/notice';
import { getVersion, setVersion } from 'pcUtils/store';

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
        this.initVersion();
    },
    computed: {
        version() {
            return this.$store.state.uiConfig.versionList;
        }
    },
    watch: {
        version() {
            this.initVersion();
        }
    },
    methods: {
        initVersion() {
            if (!this.version) {
                return;
            }

            const lastVersion = getVersion() || null;

            const currentCode = lastVersion ? lastVersion.currentCode || 0 : 0;
            let lastList = lastVersion ? lastVersion.showList || [] : [];

            this.versionList = [];
            for (const code in this.version) {
                if (currentCode >= code) {
                    continue;
                }

                this.version[code].code = code;
                this.versionList.push(this.version[code]);
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
        close(index) {
            this.versionList.splice(index, 1);
            this.saveVersion();
        },
        saveVersion() {
            setVersion({
                currentCode: this.latestCode,
                showList: this.versionList
            });
        },
        getTitle(version) {
            if (version.title) {
                return version.title[this.$i18n.locale] || version.title.en;
            }
            return version.version;
        }
    }
};
</script>
