<template>
    <div class="v-checkbox __pointer" :style="style" @click="toggle"></div>
</template>

<script>
import SelectedIcon from 'assets/imgs/uiKit/checkbox/selected.svg';
import UnselectIcon from 'assets/imgs/uiKit/checkbox/unselect.svg';
import theme1SelectedIcon from 'assets/theme1_imgs/selected.png';
import theme1UnselectIcon from 'assets/theme1_imgs/unselect.png';

export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        canClick: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return { inner_value: this.value };
    },
    model: { prop: 'value' },
    watch: {
        value() {
            this.inner_value = this.value;
        }
    },
    methods: {
        toggle() {
            if (!this.canClick) {
                return;
            }
            this.inner_value = !this.inner_value;
            this.$emit('input', this.inner_value);
        }
    },
    computed: {
        theme() {
            return this.$store.state.env.theme;
        },
        selectedIcon() {
            return +this.theme === 0 ? SelectedIcon : theme1SelectedIcon;
        },
        unSelectIcon() {
            return +this.theme === 0 ? UnselectIcon : theme1UnselectIcon;
        },
        style() {
            return { 'background-image': `url(${ this.inner_value ? this.selectedIcon : this.unSelectIcon })` };
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


