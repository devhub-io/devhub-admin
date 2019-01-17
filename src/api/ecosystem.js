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

export function createEcosystem(params) {
  return request({
    url: `/admin/ecosystem/create`,
    method: 'post',
    data: params
  })
}

export function createEcosystemCollection(params) {
  return request({
    url: `/admin/ecosystem/collection/create`,
    method: 'post',
    data: params
  })
}

export function editEcosystemCollection(params) {
  return request({
    url: `/admin/ecosystem/collection/edit`,
    method: 'post',
    data: params
  })
}

export function deleteEcosystemCollection(params) {
  return request({
    url: `/admin/ecosystem/collection/delete`,
    method: 'post',
    data: params
  })
}

export function getEcosystemCollections(params) {
  return request({
    url: `/admin/ecosystem/collections`,
    method: 'get',
    params: params
  })
}

export function getEcosystemCollectionItems(params) {
  return request({
    url: `/admin/ecosystem/collection/items`,
    method: 'get',
    params: params
  })
}

export function createEcosystemCollectionItem(params) {
  return request({
    url: `/admin/ecosystem/collection/item/create`,
    method: 'post',
    data: params
  })
}
