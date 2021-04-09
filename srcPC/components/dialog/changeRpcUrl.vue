<template lang="pug">
extends /components/dialog/base.pug
block content
    div
        div(v-for="(node, index) in allRpcNodes" :key="node" class="__radio_item")
            input(type="radio" v-model="selectedNode" :value="node" :id="`radio_changeRpcUrl_${index}`" @change="onChangeNode")
            label(:for="`radio_changeRpcUrl_${index}`")
                span(class="__sm_btn") {{ isOfficial(node) ? $t('setting.changeRpcUrlDialog.officialNode') : $t('setting.changeRpcUrlDialog.customNode')}}
                code.__pointer {{node}}
                span(class="__sm_btn ping-tag") {{nodeStatusMap[node] ? `${nodeStatusMap[node].ping}ms` : 'Ping' }}
            span(class="__sm_btn delete-node-btn" v-if="!isOfficial(node)" @click="deleteNode(node)") {{$t('setting.changeRpcUrlDialog.deleteCustomNode')}}
        div.__row
            .__row_t {{$t('setting.changeRpcUrlDialog.addCustomNode')}}
            input.__input_row(type="text" v-model="newNode" :placeholder="$t('setting.changeRpcUrlDialog.inputPlaceholder')")
            span(class="__sm_btn add-node-btn" @click="addNode") {{$t('setting.changeRpcUrlDialog.addNode')}}
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { getProvider, setProvider } from 'services/apiServer';
import { checkApi } from 'pcUtils/nodeApi';

export default {
    data() {
        return {
            dShowClose: true,
            selectedNode: getProvider().path || process.env.goViteServer,
            newNode: '',
            nodeStatusMap: {}
        };
    },
    beforeMount() {
        this.dTitle = this.$t('setting.changeRpcUrlDialog.title');
        this.checkNodeStatus();
    },
    computed: {
        ...mapState(['env']),
        ...mapGetters(['allRpcNodes'])
    },
    watch: {
       allRpcNodes()  {
           this.checkNodeStatus();
       }
    },
    methods: {
        inspector() {
            return Promise.resolve();
        },
        addNode() {
            if (!this.validateNode(this.newNode)) {
                this.$toast(this.$t('setting.changeRpcUrlDialog.wrongNode'));
                return;
            }
            this.$store.dispatch('addCustomNode', this.newNode);
            this.newNode = '';
        },
        validateNode(url) {
            const re = /^(?:ws(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            return re.test(url);
        },
        isOfficial(node) {
            return this.env.officialNodes.indexOf(node) > -1;
        },
        deleteNode(node) {
            this.$store.dispatch('deleteCustomNode', node);
            this.selectedNode = this.allRpcNodes[0];
        },
        onChangeNode() {
            setProvider(this.selectedNode).then(() => {
                this.$toast(this.$t('setting.changeRpcUrlDialog.changeNodeSuccess'));
                this.$store.dispatch('changeNode', this.selectedNode);
            });
        },
        checkNodeStatus() {
            this.allRpcNodes.forEach(node => {
                checkApi(node).then(data => {
                    this.nodeStatusMap = {
                        ...this.nodeStatusMap,
                        [node]: data
                    };
                })
                .catch(err => {
                    // this.nodeStatusMap = {
                    //     ...this.nodeStatusMap,
                    //     [node]: {
                    //         error: 'error'
                    //     }
                    // };
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "pcAssets/scss/common.scss";
@import "pcComponents/confirm/confirmRow.scss";


.head {
    box-sizing: border-box;
    padding: 23px;
    display: flex;
    background: rgba(0, 122, 255, 0.05);
    font-size: 16px;
    @include common_font_color();
    @include common_border_one(bottom);
}
.block-ctx {
    display: inline-block;
    height: 138px;
    width: 140px;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    @include background_common_img('vb_confirm.png');
}

.__sm_btn {
    @include small_btn();
}

.delete-node-btn, .ping-tag{
    margin-left: 15px;
}

.add-node-btn {
    padding: 4px 10px;
    display: inline-block;
    font-size: 13px;
    margin-top: 15px;
}
.__input_row {
    height: 25px;
    display: block;
    width: 100%;
}
.__radio_item {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    input {
        line-height: 18px;
    }
    code {
        margin-left: 15px;
    }
    label {
        margin-left: 15px;
    }
}
</style>

