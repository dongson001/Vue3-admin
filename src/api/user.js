import { post, get } from '../utils/http';

export const login = p => post('api/user/login', p)
export const userInfo = p => post('api/user/info', p)
export const userList = p => post('api/user/list', p)
export const register = p => post('api/user/register', p)
