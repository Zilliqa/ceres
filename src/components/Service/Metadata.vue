<template>
  <div class="metadata" v-if="container">
    <div class="state">
      <span class="badge badge-dark mr-2">{{ container.name }}</span>
      <span
        class="badge mr-2"
        :class="{
          'badge-success': isRunning,
          'badge-secondary': !isRunning,
        }"
        >{{ container.Status }}</span
      >
      <a
        class="badge mr-2"
        :class="{
          'badge-warning': isRunning,
          'badge-secondary': !isRunning,
        }"
        >http://localhost:{{ container.Labels.hostPort }}</a
      >
      <span class="badge">{{ container.Id }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceMetadata",
  props: {
    container: {
      type: Object,
    },
  },
  computed: {
    isRunning() {
      return this.container.State === "running";
    },
  },
};
</script>
