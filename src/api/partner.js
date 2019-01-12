import request from '@/utils/request'

export function getPartnerList(params) {
  return request({
    url: `/partner/lists`,
    method: 'get',
    params: params
  })
}

export function getUserSuppliers(params) {
  return request({
    url: `/partner/user/suppliers`,
    method: 'get',
    params: params
  })
}

export function createPartner(params) {
  return request({
    url: `/partner/create`,
    method: 'post',
    data: params
  })
}

export function switchPartnerAvailable(params) {
  return request({
    url: `/partner/switch`,
    method: 'post',
    data: params
  })
}

export function getPartner(id) {
  return request({
    url: `/partner/${id}`,
    method: 'get',
    params: {
      mark: 'more'
    }
  })
}

export function getPartnerOptions() {
  return request({
    url: `/partner/options`,
    method: 'get',
    params: {}
  })
}

export function savePartner(params) {
  return request({
    url: `/partner/save`,
    method: 'post',
    data: params
  })
}

export function createPartnerContract(params) {
  return request({
    url: `/partner/create/contract`,
    method: 'post',
    data: params
  })
}

export function deletePartnerContract(id) {
  return request({
    url: `/partner/delete/contract`,
    method: 'delete',
    data: {
      contract_id: id
    }
  })
}

export function getPartnerAuthorizeSuppliers(partnerId) {
  return request({
    url: `/partner/keep/suppliers`,
    method: 'get',
    params: {
      partner_id: partnerId
    }
  })
}

export function getPartnerAuthorizeSellers(partnerId) {
  return request({
    url: `/partner/keep/sellers`,
    method: 'get',
    params: {
      partner_id: partnerId
    }
  })
}

export function createPartnerAuthorize(partnerSourceId, partnerTargetId, isAvailable) {
  return request({
    url: `/partner/keep/create`,
    method: 'post',
    data: {
      partner_source_id: partnerSourceId,
      partner_target_id: partnerTargetId,
      is_available: isAvailable
    }
  })
}

export function getPartnerAuthorize(authorizeId) {
  return request({
    url: `/partner/keep/${authorizeId}`,
    method: 'get',
    params: {}
  })
}

export function switchPartnerAuthorizeStatus(authorizeId, isAvailable) {
  return request({
    url: `/partner/keep/switch`,
    method: 'post',
    data: {
      partner_authorize_id: authorizeId,
      is_available: isAvailable
    }
  })
}

export function savePartnerAuthorize(partnerAuthorizeId, mark, input) {
  return request({
    url: `/partner/keep/save`,
    method: 'post',
    data: {
      partner_authorize_id: partnerAuthorizeId,
      mark: mark,
      input: input
    }
  })
}

export function getPartnerAuthorizeOptions(partnerType, partnerId) {
  return request({
    url: `/partner/keep/options`,
    method: 'get',
    params: {
      partner_type: partnerType,
      authorize_id: partnerId
    }
  })
}

export function getSettlementOptions(type) {
  return request({
    url: `/partner/settlement/option`,
    method: 'get',
    params: {
      type: type
    }
  })
}

export function createPartnerSettlement(partnerId, params) {
  return request({
    url: `/partner/settlement/create`,
    method: 'post',
    data: {
      partner_target_id: partnerId,
      ...params
    }
  })
}

export function deletePartnerSettlement(settlementId) {
  return request({
    url: `/partner/settlement/delete`,
    method: 'delete',
    data: {
      partner_settlement_id: settlementId
    }
  })
}

export function getPartnerSettlements(partnerId) {
  return request({
    url: `/partner/settlement/${partnerId}`,
    method: 'get'
  })
}

export function createContract(contractType, contractNo, supplierId = 0) {
  return request({
    url: `/partner/create/contract`,
    method: 'post',
    data: {
      contract_type: contractType,
      supplier_id: supplierId,
      contract_no: contractNo
    }
  })
}

export function deleteContract(contractId) {
  return request({
    url: `/partner/delete/contract`,
    method: 'delete',
    data: {
      contract_id: contractId
    }
  })
}

export function getSupplierContracts(supplierId) {
  return request({
    url: `/partner/contract/supplier/${supplierId}`,
    method: 'get'
  })
}

export function getSalesContracts() {
  return request({
    url: `/partner/contract/sales`,
    method: 'get'
  })
}
