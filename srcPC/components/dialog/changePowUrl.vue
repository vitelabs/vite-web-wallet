<template lang="pug">
extends /components/dialog/base.pug
block content
    div
        div(v-for="(node, index) in env.customPowUrls" :key="node" class="__radio_item")
            input(type="radio" v-model="selectedNode" :value="node" :id="`radio_changeRpcUrl_${index}`" @change="onChangeNode")
            label(:for="`radio_changeRpcUrl_${index}`")
                span(class="__sm_btn") {{ $t('setting.changeRpcUrlDialog.customNode')}}
                code.__pointer {{node}}
                span(class="__sm_btn ping-tag") {{nodeStatusMap[node] ? `${nodeStatusMap[node].ping} ms` : 'Ping...' }}
            span(class="__sm_btn delete-node-btn"  @click="deleteNode(node)") {{$t('setting.changeRpcUrlDialog.deleteCustomNode')}}
        div.__row
            .__row_t {{$t('setting.changeRpcUrlDialog.addCustomNode')}}
            input.__input_row(type="text" v-model="newNode" :placeholder="$t('setting.changeRpcUrlDialog.inputPlaceholder')")
            span(class="__sm_btn add-node-btn" @click="addNode") {{$t('setting.changeRpcUrlDialog.addNode')}}
</template>

<script>
import { mapState } from 'vuex';
const checkApi = () => {
    return Promise.resolve({ ping: 300, blockHeight: -1 }) ;
};

export default {
    data() {
        return {
            dShowClose: true,
            selectedNode: this.$store.state.env.currentPowUrl,
            newNode: '',
            nodeStatusMap: {}
        };
    },
    beforeMount() {
        this.dTitle = this.$t('setting.changeRpcUrlDialog.title');
        this.checkNodeStatus();
        window.fff=this;
    },
    computed: { ...mapState(['env']) },
    methods: {
        inspector() {
            return Promise.resolve();
        },
        addNode() {
            
            if (!this.validateNode(this.newNode)) {
                this.$toast(this.$t('setting.changeRpcUrlDialog.wrongNode'));
                return;
            }
            this.$store.dispatch('addCustomPowUrl', this.newNode);
            this.newNode = '';
        },
        validateNode(url) {
            const re = /^(?:ws(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            return re.test(url);
        },
        deleteNode(node) {
            this.$store.dispatch('deleteCustomPowUrl', node);
            this.selectedNode = this.env.customPowUrls[0];
        },
        onChangeNode() {
            const currentNode = this.env.currentPowUrl;
            if (currentNode === this.selectedNode) return;
            this.$store.dispatch('changePowUrl', this.selectedNode);
            this.checkNodeStatus();
        },
        checkNodeStatus() {
            console.log(1111,this.nodeStatusMap)
            this.env.customPowUrls.forEach(node => {
                checkApi(node)
                    .then(data => {
                        this.nodeStatusMap = {
                            ...this.nodeStatusMap,
                            [node]: data
                        };
                    })
                    .catch(err => {});
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import 'pcAssets/scss/common.scss';
@import 'pcComponents/confirm/confirmRow.scss';

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

.delete-node-btn,
.ping-tag {
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
