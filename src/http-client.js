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

  requestOptions({ url, query, body, method, requestOverrides }) {
    const { headerOptions, requestOptions } = this.baseOptions
    const { headerOptionsOverrides, requestOptionsOverrides } = requestOverrides

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

  async request({ path, query, body, method, requestOverrides={} }) {
    const { stack } = new Error()
    try {
      const options = this.requestOptions({ url: path, query, body, method, requestOverrides })
      const resp = await axios.request(options)
      return new HttpResponse(resp)
    } catch (error) {
      error.stack = stack
      throw new HttpError(error)
    }
  }

  async get(path, query) {
    return this.request({ path, query, method: 'get'})
  }

  async post(path, body={}, query) {
    return this.request({ path, body, query, method: 'post'})
  }

  async patch(path, query, body={}) {
    return this.request({ path, body, query, method: 'patch'})
  }

  async put(path, query, body={}) {
    return this.request({ path, body, query, method: 'put'})
  }

  async delete(path) {
    return this.request({ path, method: 'delete'})
  }
}

module.exports = HttpClient
