<template>
    <div class="app-wrapper">
        <page-layout v-if="active.indexOf('start') !== 0" :active="active">
            <router-view />
        </page-layout>

        <router-view v-else />

        <update></update>
        <first-notice v-if="active === 'start'"></first-notice>
    </div>
</template>

<script>
import update from 'components/update.vue';
import pageLayout from 'components/pageLayout';
import firstNotice from 'components/firstNotice.vue';
import date from 'utils/date';
import { subTask } from 'utils/proto/subTask';

let task = null;
let addrTimeout = null;

export default {
    components: {
        update,
        firstNotice,
        pageLayout
    },
    mounted() {
        this.changeLayout(this.$route.name);
        this.$router.afterEach(to => {
            this.active = to.name;
        });

        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
        this.startGetAddress();
    },
    destroyed() {
        task && task.stop();
        task = null;
        addrTimeout && clearTimeout(addrTimeout);
        addrTimeout = null;
    },
    data() {
        return {
            layoutType: 'start',
            active: this.$route.name,
            address: ''
        };
    },
    watch: {
        active: function () {
            this.changeLayout();
            this.$offKeyDown();
        },
        address: function () {
            this.address && this.startLatestOrder();
        }
    },
    methods: {
        changeLayout() {
            const toHome = this.active.indexOf('start') !== -1;
            this.layoutType = toHome ? 'home' : 'start';
        },

        startGetAddress() {
            const account = this.$wallet.getActiveAccount();
            this.address = account ? account.getDefaultAddr() : '';

            addrTimeout = setTimeout(() => {
                this.startGetAddress();
            }, 1000);
        },
        startLatestOrder() {
            task && task.stop();
            task = null;

            task = new subTask('latestOrder', ({ args, data }) => {
                const account = this.$wallet.getActiveAccount();
                const address = account ? account.getDefaultAddr() : '';

                if (address !== args.address) {
                    return;
                }

                data && this.$toast(this.$t('exchange.dealReminder', {
                    time: date(data.date * 1000, 'zh', true),
                    ftoken: data.ftokenShow,
                    ttoken: data.ttokenShow
                }));
            }, 2000);

            task.start(() => {
                const account = this.$wallet.getActiveAccount();
                const address = account ? account.getDefaultAddr() : '';
                return { address };
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
</style>
