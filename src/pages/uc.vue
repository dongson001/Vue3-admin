<template>
  <div>
    <h1>用户中心</h1>
    <div>
      <input type="file" name="file" @change="handleFileChange" >
      <a-button @click="upload">上传</a-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { uploadFile } from '../api/user';
let state = reactive({
  file: null,
});
function handleFileChange(e) {
  const [file] = e.target.files
  if(!file){
    return
  }else {
    state.file = file
  }
}
function upload() {
  const form = new FormData()
  form.append('name', 'file')
  form.append('file', state.file)
  uploadFile(form).then(res => {
    console.log('res:', res)
  })
}
</script>

<style lang="scss" scoped></style>
