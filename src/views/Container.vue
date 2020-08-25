<template>
  <div class="container"></div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      service: null,
      container: null,
    };
  },
  async created() {
    const containers = await axios.get("http://localhost:3939/container/list");

    const cts = containers.data;
    console.log(cts);
  },
};
</script>