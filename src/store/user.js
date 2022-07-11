import { defineStore } from 'pinia';
import { menuList, userInfo } from '../api/user';

export const userStore = defineStore({
  id: 'user',
  state: () => {
    return {
      userInfo: {},
      menuList: [],
      navList: [],
    };
  },
  actions: {
    async getMenuList() {
      let res = await menuList(); // 获取权限
      if (res.code === 0) {
        this.menuList = res.data;
        return true;
      } else {
        return false;
      }
    },
    async getUserInfo() {
      let res = await userInfo(); // 获取权限
      this.userInfo = res.data;
    },
    setNavList(navList) {
      this.navList = navList;
    },
  },
});
