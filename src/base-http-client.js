const axios = require('axios')
const bindAll = require('class-bindall')

const defaultOptions = {
  application: null,
  traceId: null,
  headerOptions: {},
  requestOptions: {}
}

class BaseApiClient {
  constructor(baseUrl, options) {
    this.baseUrl = baseUrl
    this.baseOptions = Object.assign({}, defaultOptions, options)
    bindAll(this)
  }

  requestOptions({ url, query, body, method }) {
    const { application, traceId, headerOptions, requestOptions } = this.baseOptions
    const headers = Object.assign({}, headerOptions, { application, traceId })

    return Object.assign({}, requestOptions, {
      url,
      method,
      params: query,
      baseURL: this.baseUrl,
      data: body,
      headers
    })
  }

  async request({ url, query, body, method }) {
    try {
      const options = this.requestOptions({ url, query, body, method })
      const resp = await axios.request(options)
      if (typeof resp.data === 'object') {
        resp.data.status = resp.status
        return resp.data
      }
      return resp
    } catch (error) {
      error.data = error.response.data
      throw error
    }
  }

  async get(url, query) {
    return this.request({ url, query, method: 'get'})
  }

  async post(url, body={}, query) {
    return this.request({ url, body, query, method: 'post'})
  }

  async patch(url, query, body={}) {
    return this.request({ url, body, query, method: 'patch'})
  }

  async put(url, query, body={}) {
    return this.request({ url, body, query, method: 'put'})
  }

  async delete(url) {
    return this.request({ url, method: 'delete'})
  }
}

module.exports = BaseApiClient
