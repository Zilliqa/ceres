<template>
  <div v-if="cleared.stream">{{ cleared.stream }}</div>
  <div v-else-if="cleared.status" class="text-info">{{ cleared.status }}</div>
  <div v-else>{{ cleared }}</div>
</template>

<script>
export default {
  props: ["log"],
  computed: {
    cleared() {
      try {
        const parsed = JSON.parse(this.log);
        return parsed;
      } catch (error) {
        return this.log;
      }
    },
  },
};
</script>
