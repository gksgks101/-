export type ShareConfirmation =
  | {action: 'native'; result: 'completed' | 'cancelled' | 'failed'}
  | {action: 'copy'; result: 'completed' | 'failed'}
  | {action: 'download'; result: 'started' | 'failed'};

export type ShareNotice = 'shared' | 'copied' | 'download-started' | 'share-failed' | 'copy-failed' | 'image-failed';

/** A success notice is returned only after the browser reports the action finished. */
export function shareNotice(confirmation: ShareConfirmation): ShareNotice | null {
  if (confirmation.action === 'native') {
    if (confirmation.result === 'completed') {
      return 'shared';
    }
    if (confirmation.result === 'failed') {
      return 'share-failed';
    }
    return null;
  }

  if (confirmation.action === 'copy') {
    return confirmation.result === 'completed' ? 'copied' : 'copy-failed';
  }

  return confirmation.result === 'started' ? 'download-started' : 'image-failed';
}

export function nativeShareResult(error: unknown): 'cancelled' | 'failed' {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'cancelled';
  }

  return 'failed';
}

export function resultFileName(resultId: string) {
  const safe = resultId.toLowerCase().replace(/[^a-z0-9-]/g, '');
  return `kaleid-${safe || 'result'}.png`;
}
