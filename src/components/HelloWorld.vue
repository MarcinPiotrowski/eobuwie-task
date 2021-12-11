<template>
  <div>
    <h1>
      {{ text }}
    </h1>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
