 <template>
  <tr>
    <td>{{image.name}}</td>
    <td>{{image.image}}</td>
    <td>
      <div class="actions" v-if="!loading">
        <b-button
          type="btn is-success"
          @click="handleInstall"
          v-if="image.installed === false"
        >Install service</b-button>
        <div v-else>
          <b-button type="btn is-warning" @click="handleInstall">Rebuild</b-button>
        </div>
      </div>
      <div class="loading" v-else>{{loading}}</div>
    </td>
  </tr>
</template>

<script>
import axios from "axios";

export default {
  props: ["image"],
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async handleInstall() {
      this.loading = "Installing service...";
      const request = await axios.post(
        "http://localhost:3939/image/build",
        this.image
      );

      if (request.data.Id !== undefined) {
        this.loading = false;

        this.$emit("reload-images");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
tr {
  td,
  th {
    padding: 0.5rem;
    color: #fff !important;
  }
}

.btn {
  padding: 0.2rem 0.8rem !important;
  height: auto;
}
</style>