import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'İzorder - İzmir-Ordu Kültür ve Dayanışma Derneği';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 48,
          fontWeight: 'bold',
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          gap: 24,
        }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6A0DAD',
            opacity: 0.1,
            fontSize: 600,
            fontWeight: 800,
          }}
        >
          İO
        </div>
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: '#6A0DAD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 42,
            }}
          >
            İO
          </div>
          <div style={{ color: '#6A0DAD', fontSize: 56 }}>İzorder</div>
        </div>
        <div style={{ color: '#333', fontSize: 36, marginTop: -8 }}>
          İzmir-Ordu Kültür ve Dayanışma Derneği
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse options
      ...size,
    }
  );
} 