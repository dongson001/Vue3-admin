<template>
  <template v-if="route.path === '/login'">
    <router-view></router-view>
  </template>
  <template v-else>
    <a-layout>
      <MyHeader/>
      <a-layout>
        <MySider/>
        <a-layout style="padding: 0 24px 24px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>List</a-breadcrumb-item>
            <a-breadcrumb-item>App</a-breadcrumb-item>
          </a-breadcrumb>
          <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
          >
            <router-view></router-view>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </template>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import MyHeader from './components/MyHeader.vue';
import MySider from './components/MySider.vue';
let route = useRoute();
console.log('route:', route);
</script>

<style lang="scss">
</style>
