<template>
  <a-layout-sider width="200" style="background: #fff">
    <a-menu
      v-model:selectedKeys="selectedKeys2"
      v-model:openKeys="openKeys"
      @click="menuClick"
      mode="inline"
    >
      <!-- <component
        :index="item.url || String(item.id)"
        v-for="item in navList"
        :key="item.id"
        :is="
          item.children && item.children.length > 0
            ? 'a-sub-menu'
            : 'a-menu-item'
        "
      ></component> -->
      <a-sub-menu v-for="n in navList" :key="n.id">
        <template #title>
          <span>
            <user-outlined />
            {{ n.name }}
          </span>
        </template>
      </a-sub-menu>
      <!-- <a-sub-menu key="sub1">
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
      </a-sub-menu> -->
    </a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { UserOutlined } from '@ant-design/icons-vue';
import { userStore } from '../store/user';
import { storeToRefs } from 'pinia';
const { navList } = storeToRefs(userStore());
const router = useRouter();
let selectedKeys2 = ref(['1']);
let openKeys = ref(['sub1']);
function menuClick({ item, key, keyPath }) {
  console.log('item, key, keyPath:', item, key, keyPath);
  router.push(key);
}
</script>

<style lang="scss" scoped></style>
