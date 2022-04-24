<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
      v-model:selectedKeys="selectedKeys2"
      v-model:openKeys="openKeys"
      @click="menuClick"
      mode="inline"
    >
      <a-sub-menu key="sub1">
        <template #title>
          <span>
            <user-outlined />
            用户管理
          </span>
        </template>
        <a-menu-item key="userList">用户列表</a-menu-item>
        <a-menu-item key="uc">用户中心</a-menu-item>
        <a-menu-item key="3">option3</a-menu-item>
        <a-menu-item key="4">option4</a-menu-item>
      </a-sub-menu>
      <!-- <a-sub-menu key="sub2">
        <template #title>
          <span>
            <laptop-outlined />
            subnav 2
          </span>
        </template>
        <a-menu-item key="5">option5</a-menu-item>
        <a-menu-item key="6">option6</a-menu-item>
        <a-menu-item key="7">option7</a-menu-item>
        <a-menu-item key="8">option8</a-menu-item>
      </a-sub-menu>
      <a-sub-menu key="sub3">
        <template #title>
          <span>
            <notification-outlined />
            subnav 3
          </span>
        </template>
        <a-menu-item key="9">option9</a-menu-item>
        <a-menu-item key="10">option10</a-menu-item>
        <a-menu-item key="11">option11</a-menu-item>
        <a-menu-item key="12">option12</a-menu-item>
      </a-sub-menu> -->
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined } from '@ant-design/icons-vue';
const router = useRouter();
let selectedKeys2 = ref(['1']);
let openKeys = ref(['sub1']);
function menuClick({ item, key, keyPath }) {
  console.log('item, key, keyPath:', item, key, keyPath)
  router.push(key)
}
</script>

<style lang="scss" scoped></style>
