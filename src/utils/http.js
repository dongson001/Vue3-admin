import axios from 'axios';
import router from '../router/index';

import { message } from 'ant-design-vue';

var instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    token && (config.headers.Authorization = `Bearer ` + token);
    return config;
  },
  (error) => Promise.error(error)
);

instance.interceptors.response.use(
  (response) => {
    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    if (response.status === 200) {
      if(response.data.code === -666){
        message.error('登录过期，请重新登录');
        // 清除token
        localStorage.removeItem('token');
        // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
        setTimeout(() => {
          router.push({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath,
            },
          });
        }, 1000);
      }else {
        return Promise.resolve(response);
      }
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是2开头的的情况
  // 这里可以跟你们的后台开发人员协商好统一的错误状态码
  // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
  // 下面列举几个常见的操作，其他需求可自行扩展
  (error) => {
    if (error.response.status) {
      return Promise.reject(error.response);
    }
  }
);

export const post = (url, params, obj) => {
  return new Promise((resolve, reject) => {
    instance
      .post(url, params, obj)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
};

export const get = (url, params) => {
  console.log('params:', params)
  return new Promise((resolve, reject) => {
    instance
      .get(url, { params })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
};
