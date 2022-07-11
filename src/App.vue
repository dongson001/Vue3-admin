<template>
  <template v-if="route.path === '/login' || route.path === '/register'">
    <router-view></router-view>
  </template>
  <template v-else>
    <a-layout style="min-height: 100vh">
      <a-layout-sider v-model:collapsed="collapsed" collapsible>
        <div class="logo" />
        <a-menu
          v-model:selectedKeys="selectedKeys"
          @click="handleClick"
          theme="dark"
          mode="inline"
        >
          <component
            v-for="item in menuList"
            :key="item.url"
            :is="
              item.children && item.children.length > 0
                ? 'a-sub-menu'
                : 'a-menu-item'
            "
          >
            <template v-if="!item.children || item.children.length === 0">
              <user-outlined />
              <span>{{ item.name }}</span>
            </template>
            <template #title>
              <div
                class="menuItem"
                v-if="item.children && item.children.length > 0"
              >
                <user-outlined />
                <span>{{ item.name }}</span>
              </div>
            </template>
            <a-menu-item
              v-for="itemChild in item.children"
              :key="itemChild.url"
            >
              <desktop-outlined />
              <span>{{ itemChild.name }}</span>
            </a-menu-item>
          </component>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header class="main-header" style="background: #fff;;padding: 0 15px;">
          <a-breadcrumb style="margin: 16px 0; flex:1;">
            <a-breadcrumb-item>User</a-breadcrumb-item>
            <a-breadcrumb-item>Bill</a-breadcrumb-item>
          </a-breadcrumb>
          <div>
            <fullscreen-outlined @click="toggle" style="margin-right: 10px;" />
            <a-popover title="Title">
              <template #content>
                <p>Content</p>
                <p>Content</p>
              </template>
              <a-avatar
                shape="square"
                size="large"
                :style="{ backgroundColor: '#7265e6', verticalAlign: 'middle' }"
              >
                {{ userInfo.nickname }}
              </a-avatar>
            </a-popover>
            <setting-two-tone @click="state.settingVisible = true" style="margin-left: 10px;" />
          </div>
        </a-layout-header>
        <a-layout-content style="margin: 0 16px">
          <div
            :style="{ padding: '24px', background: '#fff', minHeight: '360px' }"
          >
            <router-view></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-drawer
      v-model:visible="state.settingVisible"
      class="custom-class"
      style="color: red"
      title="Basic Drawer"
      placement="right"
    >
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-drawer>
  </template>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import MyHeader from './components/MyHeader.vue';
import MySider from './components/MySider.vue';
import MyContent from './components/MyContent.vue';
import { onMounted, reactive, ref } from 'vue';
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  FullscreenOutlined,
  SettingTwoTone
} from '@ant-design/icons-vue';
import { userStore } from './store/user';
import { storeToRefs } from 'pinia';
import { useFullscreen } from '@vueuse/core';
const { menuList, userInfo } = storeToRefs(userStore());
console.log('menuList:', menuList);
const route = useRoute();
const router = useRouter();
let collapsed = ref(false);
let selectedKeys = ref([]);
onMounted(() => {
  console.log('route.name:', route.name);
  selectedKeys.value = [route.name];
});

function handleClick(menuInfo) {
  console.log('click ', menuInfo);
  router.push({ name: menuInfo.key });
};

const { isFullscreen, enter, exit, toggle } = useFullscreen()

let state = reactive({
  settingVisible: false
})

</script>

<style lang="scss">
.logo {
  height: 32px;
  margin: 16px;
  background: url(./assets/logo.png) no-repeat;
  background-size: 100% 100%;
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
.main-header {
  background: #fff;
  padding: 0 16px;
  margin: 0 0 16px 0;
  display: flex;
}
</style>
