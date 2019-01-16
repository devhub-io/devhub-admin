import request from '@/utils/request'

export function getRepos(params) {
  return request({
    url: `/admin/repos`,
    method: 'get',
    params: params
  })
}

export function switchRepos(params) {
  return request({
    url: `/admin/repos/switch`,
    method: 'post',
    data: params
  })
}

export function editRepos(params) {
  return request({
    url: `/admin/repos/edit`,
    method: 'post',
    data: params
  })
}
