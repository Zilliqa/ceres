<template>
  <div @click="handleCopy" title="Click to copy">
    <span v-if="!done">
      {{ text }}
    </span>
    <span v-else>copied</span>
  </div>
</template>

<script>
export default {
  name: "CopyToClipboard",
  data() {
    return {
      done: false,
    };
  },
  props: ["text"],
  methods: {
    handleCopy(ev) {
      ev.preventDefault();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.text).then(() => {
          this.done = true;
          setTimeout(() => {
            this.done = false;
          }, 1000);
        });
      } else {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.value = this.text;
        input.focus();
        input.select();
        const result = document.execCommand("copy");
        if (result !== "unsuccessful") {
          this.done = true;
          setTimeout(() => {
            this.done = false;
          }, 1000);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.copy-to-clipboard {
  cursor: pointer;
}
</style>