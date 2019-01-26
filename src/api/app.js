import request from '@/utils/request'

export function getQueueJobs(params) {
  return request({
    url: `/admin/queue_jobs`,
    method: 'get',
    params: params
  })
}

export function getSites(params) {
  return request({
    url: `/admin/sites`,
    method: 'get',
    params: params
  })
}

export function getWiki(params) {
  return request({
    url: `/admin/wiki`,
    method: 'get',
    params: params
  })
}

export function getLinks(params) {
  return request({
    url: `/admin/links`,
    method: 'get',
    params: params
  })
}

export function getNews(params) {
  return request({
    url: `/admin/news`,
    method: 'get',
    params: params
  })
}

export function getArticles(params) {
  return request({
    url: `/admin/articles`,
    method: 'get',
    params: params
  })
}

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

export function getDevelopers(params) {
  return request({
    url: `/admin/developers`,
    method: 'get',
    params: params
  })
}

export function switchDeveloper(params) {
  return request({
    url: `/admin/developer/switch`,
    method: 'post',
    data: params
  })
}

export function editDeveloper(params) {
  return request({
    url: `/admin/developer/edit`,
    method: 'post',
    data: params
  })
}

export function replayQueueJob(params) {
  return request({
    url: `/admin/queue/replay`,
    method: 'post',
    data: params
  })
}

export function deleteQueueJob(params) {
  return request({
    url: `/admin/queue/delete`,
    method: 'post',
    data: params
  })
}

export function fetchLink(params) {
  return request({
    url: `/admin/fetch`,
    method: 'post',
    data: params
  })
}

export function analyticsWebsite(params) {
  return request({
    url: `/admin/website/analytics`,
    method: 'get',
    params: params
  })
}

export function analyticsUser(params) {
  return request({
    url: `/admin/user/analytics`,
    method: 'get',
    params: params
  })
}

export function analyticsEcosystem(params) {
  return request({
    url: `/admin/ecosystem/analytics`,
    method: 'get',
    params: params
  })
}

export function getFeedback(params) {
  return request({
    url: `/admin/feedback`,
    method: 'get',
    params: params
  })
}

export function switchFeedback(params) {
  return request({
    url: `/admin/feedback/switch`,
    method: 'post',
    data: params
  })
}

export function deleteFeedback(params) {
  return request({
    url: `/admin/feedback/delete`,
    method: 'post',
    data: params
  })
}
