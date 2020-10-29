<template>
  <div class="metadata" v-if="container">
    <div class="state">
      <span class="badge badge-dark mr-2 pl-0 text-uppercase"
        >{{ container.name }}:</span
      >
      <copy-to-clipboard
        class="badge copy-to-clipboard mr-2"
        :class="{
          'badge-success': isRunning,
          'badge-danger': !isRunning,
        }"
        title="Click to copy"
        :text="`http://localhost:${container.Labels.hostPort}`"
      />
      <span
        class="badge mr-2"
        :class="{
          'badge-success': isRunning,
          'badge-secondary': !isRunning,
        }"
        >{{ container.Status }}</span
      >
      <span class="badge d-none">{{ container.Id }}</span>
    </div>
  </div>
</template>

<script>
import CopyToClipboard from "@/components/CopyToClipboard";
export default {
  name: "ServiceMetadata",
  props: {
    container: {
      type: Object,
    },
  },
  components: {
    CopyToClipboard,
  },
  computed: {
    isRunning() {
      return this.container.State === "running";
    },
  },
};
</script>
