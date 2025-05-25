import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'https://firebasestorage.googleapis.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/storage-proxy': '/v0/b/izorder-92337.appspot.com/o',
  },
  onProxyRes: function (proxyRes) {
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,HEAD,PUT,POST,DELETE';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Content-Length,Content-Encoding,Content-Disposition';
  },
});

// This allows you to make requests to /api/storage-proxy instead of directly to Firebase Storage
// Modify your upload code to use this endpoint instead 