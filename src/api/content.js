import request from '@/utils/request'

export function getSite(id) {
  return request({
    url: `/site/${id}`,
    method: 'get'
  })
}

export function getSites() {
  return request({
    url: `/site/lists`,
    method: 'get'
  })
}

export function deleteSite(params) {
  return request({
    url: `/site/delete`,
    method: 'post',
    data: params
  })
}

export function editSite(params) {
  return request({
    url: `/site/edit`,
    method: 'post',
    data: params
  })
}

export function createSite(params) {
  return request({
    url: `/site/create`,
    method: 'post',
    data: params
  })
}

export function getCategory(id) {
  return request({
    url: `/category/${id}`,
    method: 'get'
  })
}

export function getCategories(params) {
  return request({
    url: `/category/lists`,
    method: 'get',
    params: params
  })
}

export function getCategoriesTree(params) {
  return request({
    url: `/category/tree`,
    method: 'get',
    params: params
  })
}

export function deleteCategory(params) {
  return request({
    url: `/category/delete`,
    method: 'post',
    data: params
  })
}

export function editCategory(params) {
  return request({
    url: `/category/edit`,
    method: 'post',
    data: params
  })
}

export function createCategory(params) {
  return request({
    url: `/category/create`,
    method: 'post',
    data: params
  })
}

export function getArticle(id) {
  return request({
    url: `/article/${id}`,
    method: 'get'
  })
}

export function getArticles(params) {
  return request({
    url: `/article/lists`,
    method: 'get',
    params: params
  })
}

export function deleteArticle(params) {
  return request({
    url: `/article/delete`,
    method: 'post',
    data: params
  })
}

export function editArticle(params) {
  return request({
    url: `/article/edit`,
    method: 'post',
    data: params
  })
}

export function createArticle(params) {
  return request({
    url: `/article/create`,
    method: 'post',
    data: params
  })
}
