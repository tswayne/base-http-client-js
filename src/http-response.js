
class HttpResponse {
  constructor(response) {
    this.status = response.status
    this.headers = response.headers
    this.body = response.data
  }

}

module.exports = HttpResponse