# lambda-request-context

This module was inspired by [this post](https://hackernoon.com/capture-and-forward-correlation-ids-through-different-lambda-event-sources-220c227c65f5), and is essentially a slightly modified version of his example module. 

Since Lambda executions are single-process (as in, a container is reserved for each request), we can easily set global variables, and use them to track things that need to be logged in every log message, or even passed to other functions or the user via headers (though this is definitely not recommended.)

## Installation 

`npm install lambda-request-context`, and in your Lambda function handler module, do something like:

`var requestContext = require('lambda-request-context');`

And then in the handler function:

`requestContext.setRequestContext(evt, ctx);`

## Usage 

From here, you can easily do a `requestContext.set('foo', 'bar')` and `requestContext.get('foo')` globally within your application. This will set the , and , when using the 

## Important Magic

Because this is an opinionated module, it tries to do some useful things for you. 

- Firstly, it will try to add the `lambdaRequestId` and `apiGatewayRequestId` directly to the context if they're available in the event object. 
- Secondly, it will create a `x-correlation-id` property from the event object. This can come from a couple different sources depending on what's available - first, it looks to see if there's an API Gateway Request ID, secondly, it falls back to to the Lambda request ID. If neither of those are available it falls back to a `Date.now`. This is so we always have a common ID to query all logs from the request on.
- Lastly, it checks for an existence of an Debug-Log-Enabled header. If it is not set, it sets the debug log header on for 5% of requests. This allows us to get debug logs for a small number of requests without overwhelming our logging backend.