<template>
  <div class="search-box">
    <a-form
      ref="formRef"
      class="search-form"
      :model="state.formState"
    >
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="用户名">
            <a-input
              v-model:value="state.formState.name"
              placeholder="请输入用户名"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="search-btn">
      <a-button type="primary" @click="search">查询</a-button>
    </div>
  </div>
  <div class="table-box">
    <a-table bordered :columns="state.columns" @change="handleTableChange" :pagination="state.pagination" :data-source="state.tableData"></a-table>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { userList } from '../api/user';
let state = reactive({
  formState: {
    name: ''
  },
  columns: [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '账号',
      dataIndex: 'pass',
      key: 'pass',
    },
    {
      title: '创建时间',
      key: 'create_time',
      dataIndex: 'create_time',
    },
    {
      title: '更新时间',
      key: 'update_time',
      dataIndex: 'update_time',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ],
  tableData: [],
  pagination: {
    total: 0,
    pageNum: 1,
    pageSize: 10
  }
});
const onFinish = (values) => {
  console.log('Received values of form: ', values);
  console.log('formState: ', state.formState);
};


function getUserList() {
  userList({
    pageInfo:{
      ...state.pagination  
    }
  }).then((res) => {
    if (res.code === 0) {
      state.tableData = res.data.list;
      state.pagination.total = res.data.totalCount
      console.log('tableData:', state.tableData)
    }
  });
}

onMounted(() => {
  getUserList()
});

function search() {
  state.pagination.pageNum = 1
  getUserList()
}

function handleTableChange(pagination) {
  state.pagination.pageNum = pagination.current
  getUserList()
}

</script>

<style lang="scss" scoped></style>
