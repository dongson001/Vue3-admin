<template>
  <div>home{{ userInfo.name }}</div>
</template>

<script setup>
import { user } from '../api/login';
import { onMounted, reactive } from 'vue';
let userInfo = reactive({
  name: ''
});
onMounted(() => {
  user().then((res) => {
    if (res.code === 0) {
      userInfo = res.data;
      console.log('userInfo:', userInfo);
    }
  });
});
</script>

<style lang="scss" scoped></style>
