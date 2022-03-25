<template>
  <div class="login_container">
    <div class="login_container_box">
      <a-form
        :model="formState"
        :rules="formRules"
        name="basic"
        @finish="onFinish"
        :labelCol="{
          span: 6,
        }"
        @finishFailed="onFinishFailed"
      >
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="昵称" name="email">
          <a-input v-model:value="formState.email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">登 录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login } from '../api/user';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
const formState = reactive({
  email: 'dz',
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
  email: [{ required: true, message: '请输入邮箱'} , {type: 'email', message: '请输入正确的邮箱格式'}],
  pass: [{ required: true, message: '请输入密码' }],
  captcha: [{ required: true, message: '请输入验证码' }],
});

const onFinish = (values) => {
  console.log('Success:', values);
  
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
    margin-top: 100px;
    width: 500px;
    height: 300px;
    border: 1px solid #ccc;
  }
}
</style>
