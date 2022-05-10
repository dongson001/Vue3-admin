<template>
  <div>
    <h1>用户中心</h1>
    <div>
      <div ref="drag" id="drag">
        <input type="file" name="file" @change="handleFileChange" />
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
  chunks: []
});

const CHUNK_SIZE = 0.5 * 1024 * 1024

async function blobToString(blob) {
  return new Promise(resolve =>{
    const reader = new FileReader();
    reader.onload = function() {
      console.log('reader:', reader.result)
      const ret = reader.result.split('')
                    .map(v=>v.charCodeAt())
                    .map(v=>v.toString(16).toUpperCase())
                    .join(' ')
      resolve(ret)
    }
    reader.readAsBinaryString(blob)
  })
}

async function isGif(file) {
  // 前面6个16进制 是 '47 49 46 38 39 61' || '47 49 46 38 37 61'
  let ret = await blobToString(file.slice(0,6))
  return (ret === '47 49 46 38 39 61') || (ret === '47 49 46 38 37 61') 
}

async function isPng(file) {
  // 前面6个16进制 是 '89 50 4E 47 0D 0A 1A 0A'
  let ret = await blobToString(file.slice(0,8))
  return (ret === '89 50 4E 47 0D 0A 1A 0A')
}

async function isJpg(file) {
  // 前面6个16进制 是 '89 50 4E 47 0D 0A 1A 0A'
  let len = file.size
  let start = await blobToString(file.slice(0,2))
  let end = await blobToString(file.slice(-2,len))
  return (start === 'FF 08') && (end === 'FF D9')
}

async function isImage(file) {
  //通过文件流
  return await isGif(file) || await isGif(file) || await isJpg(file)
}

function handleFileChange(e) {
  const [file] = e.target.files;
  console.log('file:', file);
  if (!file) {
    return;
  } else {
    state.file = file;
  }
}

function createFileChunk(file, size = CHUNK_SIZE) {
  const chunks = []
  let cur = 0
  while(cur < file.size){
    chunks.push({
      index: cur,
      file: file.slice(cur, cur + size)
    })
    cur+=size
  }
  return chunks
}

async function calculateHashWorker() {

}
async function calculateHashIdle() {

}

async function upload() {
  // if(!await isImage(state.file)){
  //   alert('文件格式不对')
  //   return
  // }

  state.chunks = createFileChunk(state.file)
  const hash = await calculateHashWorker()
  console.log('chunk:', chunk)

  return
  const form = new FormData();
  form.append('name', 'file');
  form.append('file', state.file);
  uploadFile(form, {
    onUploadProgress: (progress) => {
      state.fileProgress = Number(
        ((progress.loaded / progress.total) * 100).toFixed(2)
      );
    },
  }).then((res) => {
    console.log('res:', res);
  });
}

let drag = ref(null);

function bindEvents() {
  drag.value.addEventListener('dragover', (e) => {
    drag.value.style.borderColor = 'red';
    e.preventDefault();
  });
  drag.value.addEventListener('dragleave', (e) => {
    drag.value.style.borderColor = '#ccc';
    e.preventDefault();
  });
  drag.value.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    console.log('files:', files);
    drag.value.style.borderColor = '#ccc';
    state.file = files[0];
    e.preventDefault();
  });
}

onMounted(() => {
  bindEvents();
});
</script>

<style lang="scss" scoped>
#drag {
  height: 100px;
  border: 1px dashed #ccc;
  text-align: center;
  vertical-align: middle;
  // &:hover{
  //   border-color: red;
  // }
}
</style>
