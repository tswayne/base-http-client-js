# Base Http Client
A simple, easy to use, object oriented http client

## Usage
### Standalone
```
const { HttpClient } = require('base-http-client')
const myClient = new HttpClient('http://my-host.com')
//GET http://my-host.com?foo=bar
const response = await myClient.get('/my-path', { foo: 'bar' }) // OR myClient.get('/my-path').then(response => ...)  
console.log(`Yay response ${response.body}`)
```


### Extending
```
const { HttpClient } = require('base-http-client')
class MyApiClient extends HttpClient {
  constructor() {
    super('http://myapi.com')
  }

  async getSpecialEndpoint(foo) {
    return this.get('/special-endpoint', { foo })
  }
}

const myApiClient = new MyApiClient()
const response = await myApiClient.getSpecialEndpoint('bar')
console.log(`Yay response ${response.body}`)
```

 
## Interface
### HttpClient

**HttpClient(host, options)**
* host: root url, will be the base url for all http requests with this instance
* options: object, containing:
  * headerOptions: object, base headers applied to all http requests, in the form of key/value http header options
  * requestOptions: object, underlying http adapter (currently [axios](https://www.npmjs.com/package/axios#request-config)) option override, applied to each http request.

#### HttpClient methods
All methods will return an HttpResponse or throw an HttpError  
**get(path, query)** - makes http GET request   
**post(path, body={}, query)** - makes http POST request  
**patch(path, query, body={})** - makes http PATCH request  
**put(path, query, body={})** - makes http PUT request  
**delete(path)** - makes http DELETE request  
**request({ url, query, body, method, requestOverrides={} })** - flexible http request method  

* path: string, appended to the root url (`/myPath/obj/1`)
* query: object, http query object converted to query string ({ foo: 'bar' } => '?foo=bar)
* body: object, http request body
* requestOverrides: object, applied to this request only (opposed to baseOptions) containing:
  * headerOptionsOverrides: header object, will override any defaults set
  * requestOptionsOverrides: object, underlying http adapter options that override any defaults
  
### HttpResponse
* status: integer, http response status
* headers: object, http response headers
* body: any, response body - will convert json response into an object, or otherwise return the raw response

### HttpError
* exception: string, caught exception error message
* message: http error message
* status: http request status
* request: object, containing outbound request information:
  * method: string, outbound http request method
  * url: string, outbound full request url
  * headers: object, outbound request headers
* response: object, containing response information:
  * headers: http response headers
  * body: http response body - will convert json response into an object, or otherwise return the raw response
  * status: http request status
  
#### Example
```
HttpError: {
  exception: 'Request failed with status code 404',
  message: 'Not Found',
  status: 404
  request: {
    method: 'get',
    url: 'https://my-api.com/asdf',
    headers: {
      Accept: 'application/json, text/plain, */*',
    }
  },
  response: {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...
    },
    body: { "error": "Page not found" },
    status: 404
  }
}
```
