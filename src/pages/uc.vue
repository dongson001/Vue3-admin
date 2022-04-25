<template>
  <div>
    <h1>用户中心</h1>
    <div>
      <div ref="drag" id="drag">
        <input type="file" name="file" @change="handleFileChange" >
      </div>
      <div>
        <a-progress :percent="state.fileProgress" />
      </div>
      <a-button @click="upload">上传</a-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { uploadFile } from '../api/user';
let state = reactive({
  file: null,
  fileProgress: 0,
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
  uploadFile(form,{
    onUploadProgress: progress => {
      state.fileProgress = Number(((progress.loaded / progress.total) * 100).toFixed(2))
    }
  }).then(res => {
    console.log('res:', res)
  })
}

let drag = ref(null)

function bindEvents() {
  drag.value.addEventListener('dragover', e => {
    drag.value.style.borderColor = 'red';
    e.preventDefault();
  })
  drag.value.addEventListener('dragleave', e => {
    drag.value.style.borderColor = '#ccc';
    e.preventDefault();
  })
  drag.value.addEventListener('drop', e => {
    const files = e.dataTransfer.files
    console.log('files:', files)
    drag.value.style.borderColor = '#ccc';
    state.file = files[0]
    e.preventDefault();
  })
}

onMounted(()=>{
  bindEvents()
})

</script>

<style lang="scss" scoped>
#drag { 
  height: 100px;
  border: 1px dashed #CCC;
  text-align: center;
  vertical-align: middle;
  // &:hover{
  //   border-color: red;
  // }
}
</style>
