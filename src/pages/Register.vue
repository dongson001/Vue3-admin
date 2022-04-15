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
      >
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="formState.email">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item label="验证码" name="captcha">
          <div class="flex">
            <a-input v-model:value="formState.captcha" />
            <img @click="getCaptcha" :src="state.captcha" alt="" />
          </div>
        </a-form-item>
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="formState.nickname"> </a-input>
        </a-form-item>
        <a-form-item label="密码" name="passwd">
          <a-input-password v-model:value="formState.passwd">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="确认密码" name="repasswd">
          <a-input-password v-model:value="formState.repasswd">
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">注 册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import md5 from 'md5';
import { register } from '../api/user';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
const formState = reactive({
  email: '825826837@qq.com',
  nickname: 'dz',
  passwd: 'a123456',
  repasswd: 'a123456',
  captcha: '',
});

let state = reactive({
  captcha: 'api/captcha',
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
  nickname: [{ required: true, message: '请输入昵称' }],
  passwd: [
    {
      required: true,
      pattern: /^[\w_-]{6,12}$/g,
      message: '请输入6-12的密码',
    },
  ],
  repasswd: [
    { required: true, message: '请再次输入密码' },
    {
      validator: (rule, value, callback) => {
        if (value !== formState.passwd) {
          return Promise.reject(new Error('两次密码不一致'));
        }
        return Promise.resolve();
      },
    },
  ],
  captcha: [{ required: true, message: '请输入验证码' }],
});

const onFinish = (values) => {
  console.log('Success:', values);
  let { email, passwd, nickname, captcha } = values;
  let obj = {
    email,
    passwd: md5(passwd),
    nickname,
    captcha,
  };
  register(obj).then((res) => {
    if (res.code !== 0) {
      message.error(res.message);
    } else {
      message.success('注册成功');
      router.push('/Login');
    }
  });
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
    min-height: 300px;
    border: 1px solid #ccc;
  }
}
</style>
