
class HttpError extends Error{
  constructor(error) {
    super(error.message)

    this.exception = error.message
    this.request = this._parseRequest(error.config)
    this.response = this._parseResponse(error.response)
    this.message = this._parseMessage(error)
    this.status = error.response ? error.response.status : null
    this.stack = error.stack
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
    const { headers={}, data={}, status } = errorResponse
    return { headers, body: data, status }
  }
}

module.exports = HttpError
