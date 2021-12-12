<template>
  <button
    :disabled="disabled"
    :class="[
      ...buttonClasses
    ]"
    @click="onClick"
  >
    <span
      v-if="text"
      class="eo-button-text"
    >{{ text }}</span>
    <slot />
    <slot
      name="icon"
      class="eo-icon-slot"
    />
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'CustomButton',
  props: {
    text: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'primary',
      validator: (val) => [ 'primary', 'plain', ].includes(val),
    },
    size: {
      type: String,
      default: 'medium',
      validator: (val) => [ 'small', 'medium', 'large', ].includes(val),
    },
    disabled: Boolean,
    customStyles: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    buttonClasses() {
      if (!this.customStyles) {
        return [];
      }
      return [ 'eo-custom-button', `eo-${this.type}`, `eo-${this.size}`, ];
    },
  },
  methods: {
    onClick(): void {
      this.$emit('onClick');
    },
  },
});
</script>

<style lang="scss" scoped>
button {
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &.eo-custom-button {
    transition: background-color 100ms ease-out;

    &.eo-small {
      height: 30px;
      border-radius: 15px;
      padding: 0 10px;

      .eo-button-text {
        font-size: $font-tiny;
      }
    }

    &.eo-medium {
      height: 40px;
      border-radius: 20px;
      padding: 0 20px;

      .eo-button-text {
        font-size: $font-small;
      }
    }

    &.eo-large {
      height: 60px;
      border-radius: 30px;
      padding: 0 30px;

      .eo-button-text {
        font-size: $font-medium;
      }
    }

    &.eo-primary {
      background-color: $green-color;
      color: $white-color;

      &:hover {
        background-color: $green-dark-color;
      }
    }

    &[disabled] {
      filter: opacity(0.6);
    }
  }
  &[disabled] {
    cursor: default;
  }
}

.eo-icon-slot {
  margin-left: 5px;
}
</style>
