import request from '@/utils/request'

export function getEcosystems(params) {
  return request({
    url: `/admin/ecosystems`,
    method: 'get',
    params: params
  })
}

export function switchEcosystem(params) {
  return request({
    url: `/admin/ecosystem/switch`,
    method: 'post',
    data: params
  })
}

export function editEcosystem(params) {
  return request({
    url: `/admin/ecosystem/edit`,
    method: 'post',
    data: params
  })
}
