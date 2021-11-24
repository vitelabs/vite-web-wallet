<template>
    <vSelect :options="options" :value="value" @onChange="onChange">
        <template v-slot:option="option">
            <div class="select-option">
                <img :src="option.icon"><img/>
                <span>{{ option.title }}</span>
            </div>
        </template>
    </vSelect>
</template>
<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
export default {
    props: {
        options: Array,
        value: String,
        onChange: Function
    },
    components: { vSelect }
};
</script>

<style lang="scss" scoped>
.select-option{
    display: flex;
}
</style>
