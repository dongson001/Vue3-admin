<template>
  <a-layout-header class="header">
    <div class="logo" />
    <a-menu v-model:selectedKeys="key" @click="handelClick" theme="dark"  mode="horizontal">
      <a-menu-item v-for="menu in menuList" :key="menu.url">{{
        menu.name
      }}</a-menu-item>
      <!-- <a-menu-item key="2">nav 2</a-menu-item>
      <a-menu-item key="3">nav 3</a-menu-item> -->
    </a-menu>
  </a-layout-header>
</template>

<script setup>
import { ref, watch } from 'vue';
import { userStore } from '../store/user';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
const { menuList } = storeToRefs(userStore());
const router = useRouter();
let store = userStore()
let key = ref([''])
watch(
  () => router.currentRoute.value.name,
  (newValue) => {
    key.value = [menuList.value.find(item=>item.url === newValue)?.url]
    let navList = menuList.value.filter(item=> item.url === key.value)
    store.setNavList(navList)
  },
  {
    immediate: true,
  }
);



function handelClick({ item, key, keyPath }){
  // router.push({
  //   name: key
  // })
}
</script>

<style lang="scss" scoped>
.ant-layout-header .logo {
  float: left;
  width: 127px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}
</style>
