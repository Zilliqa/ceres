import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Container from "../views/Container.vue";
import IsolatedServer from "../views/Services/IsolatedServer";
import ScillaServer from "../views/Services/ScillaServer";
import Devex from "../views/Services/Devex";
import Settings from "../views/Settings";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/container/:containerId",
    name: "container",
    component: Container,
  },
  {
    path: "/isolatedserver",
    name: "zilliqa-isolated-server",
    component: IsolatedServer,
  },
  {
    path: "/scillaserver",
    name: "scillaserver",
    component: ScillaServer,
  },
  {
    path: "/devex",
    name: "devex",
    component: Devex,
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings
  },
];

const router = new VueRouter({
  routes,
});

export default router;
