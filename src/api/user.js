import request from '@/utils/request'

export function authToken() {
  return request({
    url: `/auth`,
    method: 'get'
  })
}
