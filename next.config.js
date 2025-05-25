/** @type {import('next').NextConfig} */
const nextConfig = {  reactStrictMode: true,
  // output: 'export', // Admin sayfalarında dinamik işlevselliği etkinleştirmek için statik export'u kaldırdık
  images: {
    domains: [
      'firebasestorage.googleapis.com', // Firebase Storage resimlerine erişim için
      'storage.googleapis.com', // Yeni Firebase Storage bucket format için
      'picsum.photos', // Lorem Picsum test görsellerine erişim için
      'images.unsplash.com', // Unsplash görsellerine erişim için
      'via.placeholder.com' // Placeholder görsellerine erişim için
    ],
  },
  // Node.js modüllerindeki node: şeması sorununu gidermek için webpack yapılandırması
  webpack: (config, { isServer }) => {
    // Client-side yapılandırması
    if (!isServer) {
      // Browserify polyfilleri yerine boş nesneleri kullan
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        dns: false,
        http2: false,
      };
    }

    // externals değerini ayarla, bu sayede 'node:' protokolü ile başlayan modülleri çözümlerken Node.js çalışma zamanını kullanır
    config.externals.push({
      'net': 'commonjs net',
      'node:process': 'commonjs process',
      'node:buffer': 'commonjs buffer',
      'node:path': 'commonjs path',
      'node:fs': 'commonjs fs',
      'node:url': 'commonjs url',
      'node:stream': 'commonjs stream',
      'node:util': 'commonjs util',
      'node:events': 'commonjs events',
      'node:crypto': 'commonjs crypto',
      'node:http': 'commonjs http',
      'node:https': 'commonjs https',
      'node:zlib': 'commonjs zlib',
      'node:assert': 'commonjs assert',
      'node:os': 'commonjs os',
      'node:constants': 'commonjs constants',
      'node:querystring': 'commonjs querystring',
    });
    
    return config;
  }
};

module.exports = nextConfig;