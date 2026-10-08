import {ImageResponse} from 'next/og';

export const ogSize = {width: 1200, height: 630};

export function ogCard({kicker, title, summary}: {kicker: string; title: string; summary: string}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#07060f',
          color: '#f6f3ff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16, color: '#c4b5fd', fontSize: 28, fontWeight: 700}}>
          <div style={{width: 18, height: 18, background: '#c4b5fd', transform: 'rotate(45deg)'}} />
          Kaleid
        </div>
        <div style={{display: 'flex', flexDirection: 'column', width: 1040}}>
          <div style={{fontSize: 22, letterSpacing: 4, textTransform: 'uppercase', color: '#c4b5fd'}}>{kicker}</div>
          <div style={{marginTop: 18, fontSize: 56, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1}}>{title}</div>
          <div style={{marginTop: 24, fontSize: 28, lineHeight: 1.4, color: '#d4cce6'}}>{summary}</div>
        </div>
      </div>
    ),
    {...ogSize},
  );
}
