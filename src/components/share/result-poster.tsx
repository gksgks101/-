import type {Ref} from 'react';
import type {ResultCardData} from './result-card';

const tones = {
  violet: {background: '#2a2148', color: '#f4eeff'},
  iris: {background: '#312455', color: '#f7f3ff'},
  lilac: {background: '#1c243c', color: '#eef3ff'},
} as const;

export function ResultPoster({card, posterRef}: {card: ResultCardData; posterRef: Ref<HTMLDivElement>}) {
  const tone = tones[card.tone];

  return (
    <div
      ref={posterRef}
      style={{
        width: 1080,
        boxSizing: 'border-box',
        background: '#07060f',
        padding: 64,
        color: '#f6f3ff',
        fontFamily: 'var(--font-outfit), ui-sans-serif, sans-serif',
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          border: '2px solid #322c49',
          borderRadius: 40,
          background: '#12101c',
        }}
      >
        <div style={{height: 14, background: '#c4b5fd'}} />
        <div style={{padding: '64px 72px 72px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, color: '#c4b5fd', fontSize: 28, fontWeight: 700}}>
            <span style={{width: 16, height: 16, background: '#c4b5fd', transform: 'rotate(45deg)'}} />
            Kaleid
          </div>
          <p
            style={{
              margin: '48px 0 0',
              color: '#c4b5fd',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            {card.eyebrow}
          </p>
          <p
            style={{
              margin: '18px 0 0',
              fontFamily: 'var(--font-syne), ui-sans-serif, sans-serif',
              fontSize: 44,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
            }}
          >
            {card.sourceTitle}
          </p>
          <div style={{display: 'flex', alignItems: 'center', gap: 28, marginTop: 56}}>
            <div
              style={{
                display: 'flex',
                width: 132,
                height: 132,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 32,
                background: tone.background,
                color: tone.color,
                fontFamily: 'var(--font-syne), ui-sans-serif, sans-serif',
                fontSize: 40,
                fontWeight: 700,
              }}
            >
              {card.monogram}
            </div>
            <p style={{margin: 0, color: '#d4cce6', fontSize: 30}}>{card.mark}</p>
          </div>
          <h2
            style={{
              margin: '36px 0 0',
              fontFamily: 'var(--font-syne), ui-sans-serif, sans-serif',
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-0.04em',
            }}
          >
            {card.resultTitle}
          </h2>
          <p style={{margin: '28px 0 0', color: '#d4cce6', fontSize: 32, lineHeight: 1.45}}>{card.description}</p>
        </div>
      </div>
    </div>
  );
}
