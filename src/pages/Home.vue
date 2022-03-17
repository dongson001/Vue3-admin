<template>
  <div>home{{ user.name }}</div>
</template>

<script setup>
import { userInfo } from '../api/user';
import { onMounted, reactive } from 'vue';
let user = reactive({
  name: ''
});
onMounted(() => {
  userInfo().then((res) => {
    if (res.code === 0) {
      user = res.data;
      console.log('userInfo:', userInfo);
    }
  });
});
</script>

<style lang="scss" scoped></style>
