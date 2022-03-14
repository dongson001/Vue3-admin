<template>
  <div class="search-box">
    <a-form
      ref="formRef"
      class="search-form"
      :model="formState"
      @finish="onFinish"
    >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="name" label="用户名">
            <a-input
              v-model:value="formState.name"
              placeholder="请输入用户名"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="search-btn">
    <a-button type="primary">查询</a-button>
    </div>
  </div>
  <div class="table-box">
    <a-table></a-table>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
let formState = reactive({
  name: '',
});
const onFinish = values => {
  console.log('Received values of form: ', values);
  console.log('formState: ', formState);
};
</script>

<style lang="scss" scoped></style>
