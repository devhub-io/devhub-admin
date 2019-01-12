import request from '@/utils/request'

export function getLabelLists(params, action) {
  return request({
    url: `/goods/${action}`,
    method: 'get',
    params: params
  })
}

export function createLabel(params, action) {
  return request({
    url: `/goods/${action}`,
    method: 'post',
    data: params
  })
}

export function editLabel(params, action) {
  return request({
    url: `/goods/${action}`,
    method: 'post',
    data: params
  })
}

export function labelType(params) {
  return request({
    url: `/goods/labeltype`,
    method: 'get',
    params: params
  })
}

export function labelSwitchStatus(params, action) {
  return request({
    url: `/goods/${action}`,
    method: 'post',
    data: params
  })
}

export function removeLabel(params) {
  return request({
    url: `/goods/remove`,
    method: 'post',
    data: params
  })
}

export function areaLists(params) {
  return request({
    url: `/system/arealists`,
    method: 'get',
    params: params
  })
}

export function logLists(params) {
  return request({
    url: `/log/lists`,
    method: 'get',
    params: params
  })
}

export function sendSms(params) {
  return request({
    url: `/sms/send`,
    method: 'post',
    data: params
  })
}

export function logSms(params) {
  return request({
    url: `/sms/log`,
    method: 'get',
    params: params
  })
}

export function recordSms(params) {
  return request({
    url: `/sms/record`,
    method: 'get',
    params: params
  })
}

export function getSmsTemplates(params) {
  return request({
    url: `/sms/templates`,
    method: 'get',
    params: params
  })
}

export function getSmsTemplate(id) {
  return request({
    url: `/sms/template/${id}`,
    method: 'get'
  })
}

export function deleteSmsTemplate(id) {
  return request({
    url: `/sms/template/${id}/delete`,
    method: 'post'
  })
}

export function createSmsTemplate(params) {
  return request({
    url: `/sms/template/create`,
    method: 'post',
    data: params
  })
}

export function updateSmsTemplate(id, params) {
  return request({
    url: `/sms/template/${id}/update`,
    method: 'post',
    data: params
  })
}

export function getImageInfo(params) {
  return request({
    url: `/image/info`,
    method: 'get',
    params: params
  })
}

export function getImageRefer(params) {
  return request({
    url: `/image/refer`,
    method: 'get',
    params: params
  })
}

export function getImageList(params) {
  return request({
    url: `/image/lists`,
    method: 'get',
    params: params
  })
}

export function getImageFolders() {
  return request({
    url: `/image/folders`,
    method: 'get'
  })
}

export function deleteImage(params) {
  return request({
    url: `/image/delete`,
    method: 'post',
    data: params
  })
}

export function editImage(params) {
  return request({
    url: `/image/edit`,
    method: 'post',
    data: params
  })
}

export function uploadImage(params) {
  return request({
    url: `/image/upload`,
    method: 'post',
    data: params
  })
}

export function moveImage(params) {
  return request({
    url: `/image/move`,
    method: 'post',
    data: params
  })
}

export function createImageFolder(params) {
  return request({
    url: `/image/folder/create`,
    method: 'post',
    data: params
  })
}
