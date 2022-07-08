import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import store from './store/index';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './scss/base.scss'

createApp(App).use(Antd).use(store).use(router).mount('#app');
