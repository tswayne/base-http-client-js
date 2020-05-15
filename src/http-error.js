
class HttpError extends Error{
  constructor(error) {
    super()

    this.exception = error.message
    this.request = this._parseRequest(error.config)
    this.response = this._parseResponse(error.response)
    this.message = this._parseMessage(error)
    this.status = error.response ? error.response.status : null

  }

  _parseRequest(errorConfig={}) {
    const { headers={}, url, method } = errorConfig
    return { method,  url, headers }
  }

  _parseMessage(error) {
    if (error.response) {
      return error.response.statusText
    }
    return error.message
  }

  _parseResponse(errorResponse={}) {
    const { headers={}, body={}, status } = errorResponse
    return { headers, body, status }
  }
}

module.exports = HttpError