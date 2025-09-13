import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import ProductPanel from "./components/ProductPanel.vue";

const app = createApp(ProductPanel);
app.use(ElementPlus);
app.mount("#app");
