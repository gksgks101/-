'use client';

import {useCallback, useRef, useState, useSyncExternalStore} from 'react';
import {createPortal} from 'react-dom';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {primaryButton, secondaryButton} from '@/components/ui/styles';
import {resultCardToPng} from '@/lib/share/png';
import {nativeShareResult, resultFileName, shareNotice, type ShareNotice} from '@/lib/share/notice';
import {ResultCard, type ResultCardData} from './result-card';
import {ResultPoster} from './result-poster';

function subscribe() {
  return () => {};
}

function shareAvailable() {
  return typeof navigator.share === 'function';
}

export function ResultShare({
  card,
  shareText,
  resultId,
  retakeHref,
  retakeLabel,
}: {
  card: ResultCardData;
  shareText: string;
  resultId: string;
  retakeHref: string;
  retakeLabel: string;
}) {
  const t = useTranslations('Share');
  const posterRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const iframeListener = useRef<(() => void) | null>(null);
  const actionId = useRef(0);
  const busyId = useRef(0);
  const [posterRoot, setPosterRoot] = useState<HTMLElement | null>(null);
  const [notice, setNotice] = useState<ShareNotice | null>(null);
  const [busy, setBusy] = useState<'share' | 'download' | null>(null);
  const canNativeShare = useSyncExternalStore(subscribe, shareAvailable, () => false);
  const fileName = resultFileName(resultId);

  const attachPoster = useCallback((node: HTMLIFrameElement | null) => {
    if (iframeRef.current && iframeListener.current) {
      iframeRef.current.removeEventListener('load', iframeListener.current);
    }

    iframeRef.current = node;
    if (!node) {
      return;
    }

    const mount = () => {
      const body = node.contentDocument?.body;
      if (!body) {
        return;
      }

      copyFontFaces(node.contentDocument);
      setPosterRoot((current) => (current === body ? current : body));
    };

    iframeListener.current = mount;
    node.addEventListener('load', mount);
    mount();
  }, []);

  function startAction() {
    actionId.current += 1;
    return actionId.current;
  }

  function publish(id: number, next: ShareNotice | null) {
    if (actionId.current === id) {
      setNotice(next);
    }
  }

  async function onShare() {
    if (busy) {
      return;
    }

    const id = startAction();
    busyId.current = id;
    setBusy('share');
    setNotice(null);
    try {
      const data: ShareData = {title: card.sourceTitle, text: shareText, url: window.location.href};
      const blob = posterRef.current ? await resultCardToPng(posterRef.current) : null;
      if (actionId.current !== id) {
        return;
      }
      if (blob) {
        const file = new File([blob], fileName, {type: 'image/png'});
        if (typeof navigator.canShare === 'function' && navigator.canShare({files: [file]})) {
          data.files = [file];
        }
      }
      await navigator.share(data);
      publish(id, shareNotice({action: 'native', result: 'completed'}));
    } catch (error) {
      publish(id, shareNotice({action: 'native', result: nativeShareResult(error)}));
    } finally {
      if (busyId.current === id) {
        setBusy(null);
      }
    }
  }

  async function onCopy() {
    const id = startAction();
    setNotice(null);
    try {
      await navigator.clipboard.writeText(window.location.href);
      publish(id, shareNotice({action: 'copy', result: 'completed'}));
    } catch {
      publish(id, shareNotice({action: 'copy', result: 'failed'}));
    }
  }

  async function onDownload() {
    if (busy) {
      return;
    }

    const id = startAction();
    busyId.current = id;
    setBusy('download');
    setNotice(null);
    try {
      const blob = posterRef.current ? await resultCardToPng(posterRef.current) : null;
      if (!blob) {
        publish(id, shareNotice({action: 'download', result: 'failed'}));
        return;
      }

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      publish(id, shareNotice({action: 'download', result: 'started'}));
    } catch {
      publish(id, shareNotice({action: 'download', result: 'failed'}));
    } finally {
      if (busyId.current === id) {
        setBusy(null);
      }
    }
  }

  const noticeText =
    notice === 'shared'
      ? t('shared')
      : notice === 'copied'
        ? t('copied')
        : notice === 'download-started'
          ? t('downloadStarted')
          : notice === 'share-failed'
            ? t('shareFailed')
            : notice === 'copy-failed'
              ? t('copyFailed')
              : notice === 'image-failed'
                ? t('imageFailed')
                : '';

  return (
    <div>
      <ResultCard card={card} />
      <iframe
        ref={attachPoster}
        title={t('poster')}
        aria-hidden="true"
        tabIndex={-1}
        srcDoc="<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='margin:0;background:#07060f'></body></html>"
        className="pointer-events-none fixed top-0 left-0 -z-10 h-[1600px] w-[1080px] border-0"
        style={{transform: 'translateX(-120%)'}}
      />
      {posterRoot ? createPortal(<ResultPoster card={card} posterRef={posterRef} />, posterRoot) : null}
      <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
        <Link href={retakeHref} className={`${primaryButton} w-full sm:w-auto`}>
          {retakeLabel}
        </Link>
        {canNativeShare ? (
          <button type="button" className={`${secondaryButton} w-full sm:w-auto`} disabled={busy !== null} onClick={() => void onShare()}>
            {t('share')}
          </button>
        ) : null}
        <button type="button" className={`${secondaryButton} w-full sm:w-auto`} onClick={() => void onCopy()}>
          {t('copyLink')}
        </button>
        <button type="button" className={`${secondaryButton} w-full sm:w-auto`} disabled={busy !== null} onClick={() => void onDownload()}>
          {t('download')}
        </button>
      </div>
      <p className="mt-3 min-h-6 text-sm text-muted" role="status" aria-live="polite">
        {noticeText}
      </p>
    </div>
  );
}

function copyFontFaces(documentRef: Document | null) {
  if (!documentRef || documentRef.documentElement.dataset.fonts === 'ready') {
    return;
  }

  const rules: string[] = [];
  for (const sheet of document.styleSheets) {
    let cssRules: CSSRuleList;
    try {
      cssRules = sheet.cssRules;
    } catch {
      continue;
    }

    for (const rule of cssRules) {
      if (rule instanceof CSSFontFaceRule) {
        rules.push(rule.cssText);
      }
    }
  }

  const root = getComputedStyle(document.documentElement);
  documentRef.documentElement.style.setProperty('--font-outfit', root.getPropertyValue('--font-outfit'));
  documentRef.documentElement.style.setProperty('--font-syne', root.getPropertyValue('--font-syne'));
  const style = documentRef.createElement('style');
  style.textContent = rules.join('\n');
  documentRef.head.append(style);
  documentRef.documentElement.dataset.fonts = 'ready';
}
