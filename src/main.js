import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes";
import MasonryWall from "@yeger/vue-masonry-wall";

createApp(App).use(router).use(MasonryWall).mount("#app");
