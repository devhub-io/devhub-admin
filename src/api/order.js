import request from '@/utils/request'

export function orderList(params) {
  return request({
    url: `/order`,
    method: 'get',
    params: params
  })
}

export function supplierOrderLists(params) {
  return request({
    url: `/supplier/order`,
    method: 'get',
    params: params
  })
}

export function createOrder(params) {
  return request({
    url: `/order/create`,
    method: 'post',
    data: params
  })
}

export function orderRefundApply(params) {
  return request({
    url: `/order/refund`,
    method: 'post',
    data: params
  })
}

export function orderRefundApproval(params) {
  return request({
    url: `/order/refund/approval`,
    method: 'post',
    data: params
  })
}

export function verifyOrder(params) {
  return request({
    url: `/supplier/use`,
    method: 'post',
    data: params
  })
}

export function orderRefundTicket(params) {
  return request({
    url: `/order/refund/ticket`,
    method: 'post',
    data: params
  })
}

export function orderInfo(params) {
  return request({
    url: `/order/show`,
    method: 'get',
    params: params
  })
}

export function applySettlement(params) {
  return request({
    url: `/sales/settlement/request`,
    method: 'post',
    data: params
  })
}

export function settlementOrderLists(params) {
  return request({
    url: `/sales/settlement/lists`,
    method: 'get',
    params: params
  })
}

export function settlementSupplierLists(params) {
  return request({
    url: `/order/show`,
    method: 'get',
    params: params
  })
}

export function paymentOrder(params) {
  return request({
    url: `/order/pay`,
    method: 'post',
    data: params
  })
}

export function confirmOrderSettlement(params) {
  return request({
    url: `/sales/settlement/confirm/orders`,
    method: 'get',
    params: params
  })
}
