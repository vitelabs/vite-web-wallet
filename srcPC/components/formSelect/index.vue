<template>
    <vSelect :options="options" >
    <template v-slot:option="option">
    <span :class="option.icon"></span>
    {{ option.title }}
  </template>
    </vSelect>
</template>
<script>
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';
export default {
    props:{
        options:Array,
        value:String,
        onChange:Function
    },
    components:{vSelect}
}
</script>