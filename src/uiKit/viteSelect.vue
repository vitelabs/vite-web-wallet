<template>
  <vSelect
    :options="options"
    @input="onInput"
    :clearable="clearable"
    :searchable="false"
    :class="['vite-select', className]"
    :components="{ OpenIndicator }"
    :value="value"
  >
    <template #selected-option="{ icon, label }">
      <div class="vite-select__selected">
        <img v-show="!!icon" :src="icon" />
        <span>{{ label }}</span>
      </div>
    </template>
    <template v-slot:option="{ icon, label }">
      <div class="vite-select__option">
        <img v-show="!!icon" :src="icon" />
        <span>{{ label }}</span>
      </div>
    </template>
  </vSelect>
</template>

<script>
import vSelect from "vue-select";
import downCircle from "assets/imgs/downCircle.svg.vue";
export default {
  props: {
    value: {},

    options: {},
    selectable: { type: Boolean, default: false },
    clearable: {
      type: Boolean,
      default: false,
    },
    className: { type: String },
  },
  components: { vSelect, downCircle },
  methods: {
    onInput(val) {
      this.$emit("input", val);
    },
  },
  data() {
    return {
      OpenIndicator: {
        render: (createElement) =>
          createElement(downCircle, {
            attrs: {},
            class: { "vite-select-indicator": true },
          }),
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.vite-select {
  &__selected,
  &__option {
    display: flex;
    align-items: center;
    background-color: transparent;
    @include common_font_color();

    img {
      margin-right: 5px;
      width: 30px;
      height: 30px;
    }
  }
  &.v-select {
    height: 50px;
    @include bg_color_2();
    @include common_font_color();

    border: 1px solid #bdd6e8;
    border-radius: 2px;
    padding: 0 10px;
    display: flex;
    align-items: center;

    /deep/.vs__dropdown-toggle {
      width: 100%;
    }
    /deep/.vs__dropdown-option--highlight {
      @include hover_color();
      @include common_font_color();
    }
    /deep/ .vs__selected {
      @include bg_color_2();
      @include common_font_color();
    }
    /deep/ .vite-select-indicator {
      color: $blue-color-1;
      height: 20px;
      width: 20px;
    }
  }
}
</style>
