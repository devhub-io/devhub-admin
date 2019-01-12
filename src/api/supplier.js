import request from '@/utils/request'

export function getSupplierProducts(id, page, perPage, other) {
  return request({
    url: `/supplier/products/${id}`,
    method: 'get',
    params: {
      page: page,
      per_page: perPage,
      ...other
    }
  })
}

export function importSupplierProducts(params) {
  return request({
    url: `/supplier/import`,
    method: 'post',
    data: params
  })
}

export function getSupplierProductOptions(id) {
  return request({
    url: `/supplier/options/${id}`,
    method: 'get'
  })
}

export function getChangLongMaxiTime(supplierId, date) {
  return request({
    url: `/changlong/maxi/time`,
    method: 'get',
    params: {
      supplier_id: supplierId,
      find_date: date
    }
  })
}

export function checkChangeLongMaxi(goodsId) {
  return request({
    url: `/changlong/check/maxi/${goodsId}`,
    method: 'get'
  })
}

export function saveGoodsMaxi(goodsId, params) {
  return request({
    url: `/changlong/maxi/save/${goodsId}`,
    method: 'post',
    data: params
  })
}
