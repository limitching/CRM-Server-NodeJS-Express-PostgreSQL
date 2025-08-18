'use strict';

import morgan from 'morgan';

// 簡化的自定義 morgan 格式，專注於記錄請求體
const customFormat = (tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const responseTime = tokens['response-time'](req, res);
  
  let logMessage = `${method} ${url} ${status} ${responseTime}ms`;
  
  // 記錄請求體（如果是 POST/PUT/PATCH 請求）
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body && Object.keys(req.body).length > 0) {
    // 過濾敏感信息
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
    
    logMessage += `\n  Body: ${JSON.stringify(sanitizedBody)}`;
  }
  
  return logMessage;
};

// 創建 morgan 中間件
export const morganMiddleware = morgan(customFormat, {
  // 只記錄非靜態資源的請求
  skip: (req, res) => {
    return req.url.startsWith('/public/') || 
           req.url === '/health' || 
           req.url === '/favicon.ico';
  }
});

// 創建簡化版本的 morgan 中間件（用於生產環境）
export const morganSimple = morgan('combined', {
  skip: (req, res) => {
    return req.url.startsWith('/public/') || 
           req.url === '/health' || 
           req.url === '/favicon.ico';
  }
});

// 創建開發環境的詳細日誌中間件
export const morganDev = morgan('dev', {
  skip: (req, res) => {
    return req.url.startsWith('/public/') || 
           req.url === '/health' || 
           req.url === '/favicon.ico';
  }
});

export default morganMiddleware;
