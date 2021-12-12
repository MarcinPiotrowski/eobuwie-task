<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    viewBox="0 0 200 200"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g>
      <slot />
    </g>
  </svg>
</template>

<script>

import Vue from 'vue';

export default Vue.extend({
  name: 'IconBase',
  props: {
    iconName: {
      type: String,
      required: true,
    },
    width: {
      type: [ Number, String, ],
      default: 25,
    },
    height: {
      type: [ Number, String, ],
      default: 25,
    },
  },
});
</script>

<style scoped>

</style>
