import { defineStore } from 'pinia';
import { menuList } from '../api/user';

export const userStore = defineStore({
  id: 'user',
  state: () => {
    return {
      userInfo: {
        name: '123',
      },
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
    setNavList(navList) {
      this.navList = navList;
    },
  },
});
