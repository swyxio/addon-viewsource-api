exports.handler = function(event, context, callback) {
  // your server-side functionality

  // {
  //   "path": "Path parameter",
  //   "httpMethod": "Incoming request's method name"
  //   "headers": {Incoming request headers}
  //   "queryStringParameters": {query string parameters }
  //   "body": "A JSON string of the request payload."
  //   "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
  // }

  callback(null, {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: "hello world"
  });
};
