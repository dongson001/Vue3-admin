<template>
  <div class="login_container">
    <div class="login_container_box">
      <a-form
        :model="formState"
        :rules="formRules"
        name="basic"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="账号" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="密码" name="pass">
          <a-input-password v-model:value="formState.pass" />
        </a-form-item>
        <a-form-item label="验证码" name="captcha">
          <a-input v-model:value="formState.captcha" />
          <img @click="getCaptcha" :src="state.captcha" alt="">
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">登 录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login } from '../api/user';
import { message } from 'ant-design-vue';
const formState = reactive({
  name: 'dz',
  pass: '123',
  captcha: ''
});


let state = reactive({
  captcha: 'api/captcha'
})

function getCaptcha() {
  state.captcha = 'api/captcha?_t='+ new Date().getTime()
}

const router = useRouter();
console.log('router:', router);
const route = useRoute();
console.log('route:', route);

const formRules = reactive({
  name: [{ required: true, message: '请输入账号' }],
  pass: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: true, message: '请输入验证码' }],
});

const onFinish = (values) => {
  console.log('Success:', values);
  login(formState).then((res) => {
    if (res.code !== 0) {
      message.error(res.message);
    } else {
      localStorage.setItem('token', res.data.token);
      router.push(route.query.redirect || '/');
    }
  });
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
</script>
<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_container_box {
    padding: 50px;
    width: 500px;
    height: 300px;
    border: 1px solid #ccc;
  }
}
</style>
