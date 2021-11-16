<template>
    <vSelect
        :options="options"
        @input="onInput"
        :clearable="clearable"
        :searchable="false"
        :class="['vite-select', className]"
        :components="{ OpenIndicator }"
        :value='value'
    >
        <template #selected-option="{ icon, label }">
            <div style="display: flex; align-items: center;">
                <img v-show="!!icon" :src="icon" style="margin-right:5px" />
                <span>{{ label }}</span>
            </div>
        </template>
        <template v-slot:option="{ icon, label }">
            <div style="display: flex; align-items: center;">
                <img v-show="!!icon" :src="icon" style="margin-right:5px" />
                <span>{{ label }}</span>
            </div>
        </template>
    </vSelect>
</template>

<script>
import vSelect from 'vue-select';
import downCircle from 'assets/imgs/downCircle.svg.vue';
export default {
    props: {
        value:{},

        options: {},
        selectable: { type: Boolean, default: false },
        clearable: {
            type: Boolean,
            default: false
        },
        className: { type: String }
    },
    mounted() {
        console.log(11111, downCircle);
    },
    components: { vSelect, downCircle },
methods:{
            onInput(val){
                this.$emit('input',val)
            }
},
    data() {
        return {
            OpenIndicator: {
                render: createElement =>
                    createElement(downCircle, {
                        attrs: {},
                        class: { 'vite-select-indicator': true }
                    })
            }
        };
    }
};
</script>

<style lang="scss" scoped>
.vite-select {
    &.v-select {
        height: 50px;
        background: rgba(243, 246, 249, 0.4);
        border: 1px solid #bdd6e8;
        border-radius: 2px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        /deep/.vs__dropdown-toggle {
            width: 100%;
        }
        /deep/ .vite-select-indicator {
            color: $blue-color-1;
            height: 20px;
            width: 20px;
        }
    }
}
</style>
