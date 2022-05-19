<template>
  <div>
    <h1>用户中心</h1>
    <div>
      <div ref="drag" id="drag">
        <input type="file" name="file" @change="handleFileChange" />
      </div>
      <div>
        上传进度条：
        <a-progress :percent="state.fileProgress" />
      </div>
      <div>
        计算hash进度条：
        <a-progress :percent="state.hashProgress" />
      </div>
      <div>
        <div class="cube-container">
          <div class="cube" v-for="chunk in state.chunks" :key="chunk.index">
            <div
            :class="{
              'uploading':'',
              'success':''
            }"
            >
            </div>
          </div>
        </div>
      </div>
      <a-button @click="upload">上传</a-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { uploadFile } from '../api/user';
import sparkMD5 from 'spark-md5';
let state = reactive({
  file: null,
  fileProgress: 0,
  worker: null,
  hashProgress: 0
});

const CHUNK_SIZE = 0.05 * 1024 * 1024

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

async function calculateHashWorker(chunks) {
  return new Promise(resolve =>{
    state.worker = new Worker('/hash.js')
    state.worker.onmessage = e =>{
      const {progress,hash} =e.data
      state.hashProgress = Number(progress.toFixed(2))
      if(hash){
        resolve(hash)
      }
    }
    state.worker.postMessage({
      chunks
    })
  })
}
async function calculateHashIdle(chunks) {
  return new Promise(resolve =>{
    const spark = new sparkMD5.ArrayBuffer()
    let count = 0

    const appendToSpark = async file=>{
      return new Promise(resolve =>{
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = e=>{
          spark.append(e.target.result)
          resolve()
        }
      })
    }
    const workLoop = async deadline => {
      while (count < chunks.length 
      && deadline.timeRemaining() > 1
      ) {
        await appendToSpark(chunks[count].file)
        count++
        if(count< chunks.length){
          state.hashProgress = Number((100*count /chunks.length).toFixed(2))
        }else {
          state.hashProgress = 100
          resolve(spark.end())
        }
      }
      window.requestIdleCallback(workLoop)
    } 
    window.requestIdleCallback(workLoop)
  })
}

async function calculateHashSample(chunks) {
  // 布隆过滤器 判断一个文件
  // 1个G文件 抽样5M以内计算
  return new Promise(resolve =>{
    const spark = new sparkMD5.ArrayBuffer()
    const render = new FileReader()
    const file = state.file
    const size = file.size
    const offset = 2 * 1024 * 1024

    let chunks = [file.slice(0, offset)]

    let cur = offset

    while(cur < size){
      if((cur+offset) == size){
        // 后面的
        chunks.push(file.slice(cur, cur + offset))
      }else {
        // 中间区块
        const mid = cur + offset/2
        const end = cur + offset
        chunks.push(file.slice(cur, cur + 2))
        chunks.push(file.slice(mid, mid + 2))
        chunks.push(file.slice(end-2, end))
      } 
      cur+= offset
    }
    render.readAsArrayBuffer(new Blob(chunks))
    render.onload = e=>{
      spark.append(e.target.result)
      state.hashProgress = 100
      resolve(spark.end())
    }
  })
}


async function upload() {
  // if(!await isImage(state.file)){
  //   alert('文件格式不对')
  //   return
  // }

  let chunks = createFileChunk(state.file)
  const hash = await calculateHashWorker(chunks)
  console.log('hash:', hash)
  // const hash1 = await calculateHashIdle(chunks)
  // console.log('hash1:', hash1)

  // // 抽样算hash
  // const hash3 = await calculateHashSample(chunks)
  // console.log('hash3:', hash3)
  state.chunks = chunks.map((chunk,index)=>{
    const name = hash + '-' + index
    return {
      name,
      hash,
      index,
      chunk: chunk.file
    }
  }) 

  await uploadChunks()

  // const form = new FormData();
  // form.append('name', 'file');
  // form.append('file', state.file);
  // uploadFile(form, {
  //   onUploadProgress: (progress) => {
  //     state.fileProgress = Number(
  //       ((progress.loaded / progress.total) * 100).toFixed(2)
  //     );
  //   },
  // }).then((res) => {
  //   console.log('res:', res);
  // });
}

async function uploadChunks() {
  const requests = state.chunks.map((chunk,index)=>{
    const form = new FormData()
    form.append('chunk',chunk.chunk)
    form.append('name',chunk.name)
    form.append('hash',chunk.hash)
    return form
  }).map((form,index) =>{
    uploadFile(form, {
      onUploadProgress: (progress) => {
        state.chunks[index].fileProgress = Number(
          ((progress.loaded / progress.total) * 100).toFixed(2)
        );
      },
    })
  })
  await Promise.all(requests)
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
