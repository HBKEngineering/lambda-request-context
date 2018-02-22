"use strict";

let clearAll = () => (global.CONTEXT = undefined);

let replaceAllWith = ctx => (global.CONTEXT = ctx);

let set = (key, value) => {
  if (!key.startsWith("x-correlation-")) {
    key = "x-correlation-" + key;
  }

  if (!global.CONTEXT) {
    global.CONTEXT = {};
  }

  global.CONTEXT[key] = value;
};

let getAll = () => global.CONTEXT || {};
let get = (key) => getAll()[key];

function setRequestContext(event, context) {
  let ctx = {};

  // set the lambdaRequestId on the context object from the request
  if (context.awsRequestId) {
    ctx.lambdaRequestId = context.awsRequestId;
  }

  // set the apiGatewayRequestId on the context object from the request
  if (event.requestContext && event.requestContext.requestId) {
    ctx.apiGatewayRequestId = event.requestContext.requestId;
  }

  // set all x-correlation-* headers from the request
  if (event.headers) {
    for (var header in event.headers) {
      if (header.toLowerCase().startsWith("x-correlation-")) {
        ctx[header] = event.headers[header];
      }
    }
  }

  /// set the correlation id based on whatever info we have available to us
  if (!ctx["x-correlation-id"]) {
    ctx["x-correlation-id"] =  ctx.apiGatewayRequestId || ctx.lambdaRequestId || Date.now();
  }

  replaceAllWith(ctx);
}

module.exports = {
  clearAll,
  replaceAllWith,
  setRequestContext,
  set: set,
  get: get,
  getAll: getAll
};
