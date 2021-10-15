<template>
  <div class="settings-button ml-3" @click="handleSettingsClick">
    <img src="@/assets/settings.svg" />
  </div>
</template>

<script>
export default {
  name: "SettingsButton",
  methods: {
    handleSettingsClick() {
      return this.$router.push({ name: "Settings" });
    },
  },
};
</script>

<style lang="scss" scoped>
.settings-button {
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }

  img {
    width: 20px;
    height: 20px;
  }
}
</style>
