<template>
  <div class="container d-flex flex-column justify-content-center">
    <div class="description mb-5">
      <h4>
        <span class="text-primary font-weight-bold">Ceres</span> is a one-stop
        graphical user interface that launches different Zilliqa development
        tools under Docker containers without the need for developers to know
        Docker or run any of its commands.<br /><br />
        <small class="font-italic">
          You can focus on dapp development and let Ceres manage the necessary
          tools for you.
        </small>
      </h4>
    </div>
    <div class="services-list">
      <service-item
        v-for="(service, index) in services"
        :key="index"
        :service="service"
      ></service-item>
    </div>
  </div>
</template>

<script>
import ServiceItem from "@/components/Home/ServiceItem";

export default {
  name: "Home",
  components: { ServiceItem },
  computed: {
    services() {
      return this.$store.state.services;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  height: calc(100% - 54px - 18px);
  width: 100%;

  .services-list {
    display: grid;

    grid-template-columns: 1fr 1fr 1fr;
  }
}

small.font-italic {
  font-size: 75%;
}
</style>
