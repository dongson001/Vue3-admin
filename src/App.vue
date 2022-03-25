<template>
  <template v-if="route.path === '/login' || route.path === '/Register'">
    <router-view></router-view>
  </template>
  <template v-else>
    <a-layout>
      <MyHeader/>
      <a-layout>
        <MySider/>
        <a-layout style="padding: 0 24px 24px">
          <MyContent>
            <router-view></router-view>
          </MyContent>
        </a-layout>
      </a-layout>
    </a-layout>
  </template>
</template>

<script setup>
import { useRoute } from 'vue-router';
import MyHeader from './components/MyHeader.vue';
import MySider from './components/MySider.vue';
import MyContent from './components/MyContent.vue';
let route = useRoute();
const menuList = [
  {
    name: '开发中心',
    key: 'user',
    children: [
      {
        name: '账号管理',
        key: 'user',
        children: [
          {
            name: '用户列表',
            key: 'userList'
          }
        ]
      }
    ]
  }
]
</script>

<style lang="scss">
</style>
