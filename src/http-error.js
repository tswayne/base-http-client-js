
class HttpError extends Error{
  constructor(error) {
    super()
    const errorConfig = error.config ? error.config : {}
    this.clientMessage = error.message
    this.httpError = true

    this.request = {
      method: errorConfig.method,
      url: errorConfig.url,
      params: errorConfig.params
    }

    if (error.response) {
      this.status = error.response.status
      if (error.response.data) {
        this.message = error.response.data.message
        this.messages = error.response.data.messages
      } else {
        this.message = error.response.statusText
      }
    } else {
      this.message = error.message
    }
  }
}

module.exports = HttpError