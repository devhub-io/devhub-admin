import request from '@/utils/request'

export function getEcosystems(params) {
  return request({
    url: `/admin/ecosystems`,
    method: 'get',
    params: params
  })
}
