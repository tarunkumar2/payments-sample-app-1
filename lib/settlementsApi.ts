import { get } from 'lodash'
import axios from 'axios'

import { getAPIHostname } from './apiTarget'

const instance = axios.create({
  baseURL: getAPIHostname()
})

/**
 * Global error handler:
 * Intercepts all axios reponses and maps
 * to errorHandler object
 */
instance.interceptors.response.use(
  function(response) {
    if (get(response, 'data.data')) {
      return response.data.data
    }
    return response
  },
  function(error) {
    let response = get(error, 'response')
    if (!response) {
      response = error.toJSON()
    }
    return Promise.reject(response)
  }
)

const nullIfEmpty = (prop: string | undefined) => {
  if (prop !== undefined && prop.trim() === '') {
    return undefined
  }
  return prop
}

/** Returns the axios instance */
function getInstance() {
  return instance
}

/**
 * Get Settlements
 * @param {String} from
 * @param {String} to
 * @param {String} pageBefore
 * @param {String} pageAfter
 * @param {String} pageSize
 */
function getSettlements(
  from: string,
  to: string,
  pageBefore: string,
  pageAfter: string,
  pageSize: string
) {
  const queryParams = {
    from: nullIfEmpty(from),
    to: nullIfEmpty(to),
    pageBefore: nullIfEmpty(pageBefore),
    pageAfter: nullIfEmpty(pageAfter),
    pageSize: nullIfEmpty(pageSize)
  }

  const url = `/v1/settlements`

  return instance.get(url, { params: queryParams })
}

/**
 * Get a settlement
 * @param {String} id
 */
function getSettlementById(
  id: string,
  merchantWalletId: string,
  endUserWalletId: string
) {
  const url = `/v1/settlement/${id}`

  return instance.get(url, {
    params: {
      merchantWalletId: nullIfEmpty(merchantWalletId),
      endUserWalletId: nullIfEmpty(endUserWalletId)
    }
  })
}

export default {
  getInstance,
  getSettlements,
  getSettlementById
}