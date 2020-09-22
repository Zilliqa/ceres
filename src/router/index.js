import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Container from "../views/Container.vue";
import IsolatedServer from "../views/Services/IsolatedServer";
import ScillaServer from "../views/Services/ScillaServer";
import Devex from "../views/Services/Devex";

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
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
