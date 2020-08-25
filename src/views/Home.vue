<template>
  <div class="container">
    <div class="service-item" @click="redirectToService('isolatedserver')">
      <div class="logo">
        <img src="@/assets/logo-placeholder.png" />
      </div>
      <div class="name">Isolated Server</div>
      <div class="state"></div>
    </div>
    <div class="service-item" @click="redirectToService('isolatedserverfaucet')">
      <div class="logo">
        <img src="@/assets/logo-placeholder.png" />
      </div>
      <div class="name">Isolated Server Faucet</div>
      <div class="state"></div>
    </div>
    <div class="service-item" @click="redirectToService('scillaserver')">
      <div class="logo">
        <img src="@/assets/logo-placeholder.png" />
      </div>
      <div class="name">Scilla Server</div>
      <div class="state"></div>
    </div>
    <div class="service-item" @click="redirectToService('devex')">
      <div class="logo">
        <img src="@/assets/devex-logo.png" />
      </div>
      <div class="name">Local Network</div>
      <div class="state"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      socket: undefined,
      images: [],
      containers: [],
      services: [
        {
          name: "Isolated Server Instance",
          image: "isolatedserver",
          tarbal: "isolatedserver.tar.gz",
          labels: {
            name: "Isolated Server Instance",
            ceres: "isolatedserver",
            containerPort: "5555",
            hostPort: "5555",
          },
          installed: false,
        },
        {
          name: "Isolated Server Faucet",
          image: "isolatedserverfaucet",
          tarbal: "isolatedserverfaucet.tar.gz",
          labels: {
            name: "Isolated Server Faucet",
            ceres: "isolatedserverfaucet",
            containerPort: "5556",
            hostPort: "5556",
          },
          installed: false,
        },
        {
          name: "Local Network Explorer",
          image: "devex",
          installed: false,
          tarbal:
            "https://storage.googleapis.com/staging.personal-website-fc11b.appspot.com/test.tar.gz",
        },
      ],
    };
  },
  props: {
    msg: String,
  },
  methods: {
    redirectToService(service) {
      return this.$router.push({
        name: service,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  padding: 2rem;

  display: flex;
  justify-content: center;

  .service-item {
    padding: 1rem 2rem;
    border: 1px solid #444;
    margin-right: 1rem;
    border-radius: 10px;

    width: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .name {
      text-align: center;
    }

    &:hover {
      background-color: #444;
      cursor: pointer;
    }

    .logo {
      width: 100px;
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        object-fit: contain;
      }
    }
  }
}
.dockerid {
  width: 150px;
  overflow: hidden;
}
.table {
  width: 100%;
  background-color: #4a5759;

  td,
  th {
    padding: 0.5rem;
    color: #fff;
  }
}
</style>
