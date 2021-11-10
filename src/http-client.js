const axios = require('axios')
const bindAll = require('class-bindall')
const HttpError = require('./http-error')
const HttpResponse = require('./http-response')

const defaultOptions = {
  headerOptions: {},
  requestOptions: {}
}

class HttpClient {
  constructor(baseUrl, options={}) {
    this.baseUrl = baseUrl
    this.baseOptions = Object.assign({}, defaultOptions, options)
    bindAll(this)
  }

  requestParams({ url, query, body, method, options={} }) {
    const { headerOptions, requestOptions } = this.baseOptions
    const { headers: headerOptionsOverrides, request: requestOptionsOverrides } = options

    const headers = Object.assign({}, headerOptions, headerOptionsOverrides)

    return Object.assign({}, requestOptions, {
      url,
      method,
      params: query,
      baseURL: this.baseUrl,
      data: body,
      headers
    }, requestOptionsOverrides)
  }

  async request({ path, query, body, method, options={} }) {
    const { stack } = new Error()
    try {
      const requestParams = this.requestParams({ url: path, query, body, method, options })
      const resp = await axios.request(requestParams)
      return new HttpResponse(resp)
    } catch (error) {
      error.stack = stack
      throw new HttpError(error)
    }
  }

  async get(path, query, options={}) {
    return this.request({ path, query, method: 'get', options })
  }

  async post(path, body={}, query, options={}) {
    return this.request({ path, body, query, method: 'post', options })
  }

  async patch(path, query, body={}, options={}) {
    return this.request({ path, body, query, method: 'patch', options })
  }

  async put(path, query, body={}, options={}) {
    return this.request({ path, body, query, method: 'put', options })
  }

  async delete(path, options={}) {
    return this.request({ path, method: 'delete', options })
  }
}

module.exports = HttpClient
