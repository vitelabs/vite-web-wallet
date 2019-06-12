<template>
    <div class="v-checkbox __pointer" :style="style" @click="toggle"></div>
</template>
<script>
import SelectedIcon from 'assets/imgs/uiKit/checkbox/selected.svg';
import UnselectIcon from 'assets/imgs/uiKit/checkbox/unselect.svg';
export default {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return { inner_value: this.value };
    },
    methods: {
        toggle() {
            this.inner_value = !this.inner_value;
            this.$emit('input', this.inner_value);
        }
    },
    computed: {
        style() {
            return { 'background-image': `url(${ this.inner_value ? SelectedIcon : UnselectIcon })` };
        }
    }

};
</script>
<style lang="scss" scoped>
.v-checkbox{
    height: 16px;
    width: 16px;
    background-size: cover;
    background-position: center center;
}
</style>


