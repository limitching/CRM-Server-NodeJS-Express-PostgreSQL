'use strict';

export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;

  console.log(`\n[${timestamp}] ${method} ${url}`);
  
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body && Object.keys(req.body).length > 0) {

    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]';
    }
    if (sanitizedBody.token) {
      sanitizedBody.token = '[REDACTED]';
    }
    if (sanitizedBody.key) {
      sanitizedBody.key = '[REDACTED]';
    }
    
    console.log(`  Request Body: ${JSON.stringify(sanitizedBody, null, 2)}`);
  }

  if (Object.keys(req.query).length > 0) {
    console.log(`  Query Params: ${JSON.stringify(req.query)}`);
  }
  

  if (req.headers['content-type']) {
    console.log(`  Content-Type: ${req.headers['content-type']}`);
  }
  

  const originalSend = res.send;
  res.send = function(data) {
    const status = res.statusCode;
    const contentLength = data ? JSON.stringify(data).length : 0;
    
    console.log(`  Response: ${status} (${contentLength} bytes)`);
    if (data && typeof data === 'object') {
      console.log(`  Response Body: ${JSON.stringify(data, null, 2)}`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

export default requestLogger;
