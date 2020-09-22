<template>
  <span class="badge badge-secondary mr-1">{{ port }}</span>
</template>

<script>
export default {
  props: {
    port: {
      type: String,
    },
  },
};
</script>

<style lang="scss" scoped>
.badge-secondary {
  background-color: darken(#092532, 5);
}
</style>
