<template>
  <span
    class="badge p-0 mr-1"
    :class="{
      'badge-success is-running': isRunning,
      'badge-secondary': !isRunning,
    }"
  ></span>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
    },
  },
  computed: {
    isRunning() {
      return this.status === "running";
    },
  },
};
</script>

<style lang="scss" scoped>
.badge {
  width: 8px !important;
  height: 8px !important;
  display: block !important;

  &.is-running {
    animation: heartbeat 1s infinite;
  }
}

@keyframes heartbeat {
  0% {
    transform: scale(0.75);
  }
  20% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.75);
  }
  60% {
    transform: scale(1);
  }
  80% {
    transform: scale(0.75);
  }
  100% {
    transform: scale(0.75);
  }
}
</style>
