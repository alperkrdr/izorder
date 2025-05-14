import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'İzorder - İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği',
    short_name: 'İzorder',
    description: 'İzmir Ordu İli ve İlçeleri Kültür Dayanışma ve Yardımlaşma Derneği Resmi Web Sitesi',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6A0DAD',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
} 