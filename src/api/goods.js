import request from '@/utils/request'

export function showHotel(params) {
  return request({
    url: `/goods/showhotel`,
    method: 'get',
    params: params
  })
}

export function getAreaParentIds(params) {
  return request({
    url: `/system/getparentids`,
    method: 'post',
    data: params
  })
}

export function showScenic(params) {
  return request({
    url: `/goods/showscenic`,
    method: 'get',
    params: params
  })
}

export function editScenic(params) {
  return request({
    url: `/goods/savescenic`,
    method: 'post',
    data: params
  })
}

export function createScenic(params) {
  return request({
    url: `/goods/createscenic`,
    method: 'post',
    data: params
  })
}

export function createHotel(params) {
  return request({
    url: `/goods/createhotel`,
    method: 'post',
    data: params
  })
}

export function editHotel(params) {
  return request({
    url: `/goods/savehotel`,
    method: 'post',
    data: params
  })
}

export function goodsLists(params, action) {
  return request({
    url: `/goods/${action}`,
    method: 'get',
    params: params
  })
}

export function getScenics(params) {
  return request({
    url: `/goods/sceniclists`,
    method: 'get',
    params: params
  })
}

export function createGoods(params) {
  return request({
    url: `/goods/create`,
    method: 'post',
    data: params
  })
}

export function getHotels(params) {
  return request({
    url: `/goods/hotellists`,
    method: 'get',
    params: params
  })
}

export function getBedType(params) {
  return request({
    url: `/goods/bedtypelists`,
    method: 'get',
    params: params
  })
}

export function getPlaces(params) {
  return request({
    url: `/goods/scenichotellists`,
    method: 'get',
    params: params
  })
}

export function getGoods(goodsId) {
  return request({
    url: `/goods/show/${goodsId}`,
    method: 'get'
  })
}

export function updateGoods(goodsId, params) {
  return request({
    url: `/goods/modify/${goodsId}`,
    method: 'post',
    data: params
  })
}

export function saveCalendar(goodsId, calendars) {
  return request({
    url: `/goods/calendar/save/${goodsId}`,
    method: 'post',
    data: {
      calendars: calendars
    }
  })
}

export function deleteCalendar(goodsId, calendars) {
  return request({
    url: `/goods/calendar/delete/${goodsId}`,
    method: 'delete',
    data: {
      calendars: calendars
    }
  })
}

export function switchCalendar(goodsId, calendars) {
  return request({
    url: `/goods/calendar/switch/${goodsId}`,
    method: 'post',
    data: {
      calendars: calendars
    }
  })
}

export function getCalendar(goodsId, params) {
  return request({
    url: `/goods/calendar/${goodsId}`,
    method: 'get',
    params: params
  })
}

export function switchGoods(goodsId, params) {
  return request({
    url: `/goods/switch/${goodsId}`,
    method: 'post',
    data: params
  })
}

export function copyGoods(goodsId, params) {
  return request({
    url: `/goods/copy/${goodsId}`,
    method: 'post',
    data: params
  })
}

export function getHotelGoods(page, pageSize, params) {
  return request({
    url: `/goods/hotel/lists`,
    method: 'get',
    params: {
      page: page,
      pre_page: pageSize,
      ...params
    }
  })
}

export function getGoodsLists(page, perPage, params) {
  return request({
    url: `/goods`,
    method: 'get',
    params: {
      page: page,
      per_page: perPage,
      ...params
    }
  })
}

export function createGoodsPlace(goodsId, placeId) {
  return request({
    url: `/goods/place/create`,
    method: 'post',
    data: {
      goods_id: goodsId,
      place_id: placeId
    }
  })
}

export function deleteGoodsPlace(goodsId, placeId) {
  return request({
    url: `/goods/place/delete/${goodsId}`,
    method: 'delete',
    data: {
      place_id: placeId
    }
  })
}
