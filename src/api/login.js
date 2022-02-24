import { post } from '../utils/http';

export const login = p => post('api/user/login', p)
export const user = p => post('api/user/info', p)
