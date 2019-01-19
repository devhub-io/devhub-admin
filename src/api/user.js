import request from '@/utils/request'

export function authToken() {
  return request({
    url: `/auth`,
    method: 'get'
  })
}

export function getUsers(params) {
  return request({
    url: `/admin/users`,
    method: 'get',
    params: params
  })
}
