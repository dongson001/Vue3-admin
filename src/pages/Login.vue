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
        <a-form-item label="密码" name="passwd">
          <a-input-password v-model:value="formState.passwd">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="验证码" name="captcha">
          <div class="flex">
            <a-input v-model:value="formState.captcha" />
            <img @click="getCaptcha" :src="state.captcha" alt="" />
          </div>
        </a-form-item>
        <a-form-item label="邮箱验证码" name="emailcode">
          <div class="flex">
            <a-input v-model:value="formState.emailcode" />
            <a-button
              type="primary"
              class="emailcode"
              @click="sendEmailCode"
              :disabled="state.timer > 0"
              >{{ sendText }}</a-button
            >
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">登 录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { login, sendEmail } from '../api/user';
import md5 from 'md5';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
const formState = reactive({
  email: '825826837@qq.com',
  passwd: 'a123456',
  captcha: '',
  emailcode: '',
});

let state = reactive({
  captcha: 'api/captcha',
  timer: 0,
});

function getCaptcha() {
  state.captcha = 'api/captcha?_t=' + new Date().getTime();
}

const router = useRouter();
console.log('router:', router);
const route = useRoute();
console.log('route:', route);

const formRules = reactive({
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入正确的邮箱格式' },
  ],
  passwd: [
    {
      required: true,
      pattern: /^[\w_-]{6,12}$/g,
      message: '请输入6-12的密码',
    },
  ],
  captcha: [{ required: true, message: '请输入验证码' }],
  emailcode: [{ required: true, message: '请输入邮箱验证码' }],
});

const onFinish = (values) => {
  console.log('Success:', values);
  let { email, passwd, captcha } = values;
  let obj = {
    email,
    passwd: md5(passwd),
    captcha,
  };
  login(obj).then((res) => {
    if (res.code !== 0) {
      message.error(res.message);
    } else {
      message.success('登录成功');
      localStorage.setItem('token', res.data.token);
      setTimeout(() => {
        router.push(route.query.redirect || '/');
      }, 500);
    }
  });
};

const sendText = computed(() => {
  if (state.timer <= 0) {
    return '发送';
  } else {
    return `${state.timer}S后发送`;
  }
});

function sendEmailCode() {
  sendEmail({ email: formState.email }).then((res) => {
    console.log('res:', res)
  });
  state.timer = 10;
  state.time = setInterval(() => {
    state.timer -= 1;
    if (state.timer === 0) {
      clearInterval(state.time);
    }
  }, 1000);
}

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
    border: 1px solid #ccc;
    .emailcode {
      margin-left: 10px;
      width: 150px;
      padding: 0;
      line-height: 32px;
    }
  }
}
</style>
