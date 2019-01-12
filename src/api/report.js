import request from '@/utils/request'

export function settlementList(params) {
  return request({
    url: `/sales/settlement/report`,
    method: 'get',
    params: params
  })
}

export function confirmSupplierSettlement(params) {
  return request({
    url: `/sales/settlement/confirm/supplier`,
    method: 'get',
    params: params
  })
}
