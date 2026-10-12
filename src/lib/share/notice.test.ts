import {describe, expect, it} from 'vitest';
import {encodeAnswers} from '@/lib/quiz/codec';
import {personalityMatch} from '@/content/quizzes/personality-match';
import {fromBase64Url} from './base64url';
import {nativeShareResult, resultFileName, shareNotice} from './notice';

const personalKeys = ['email', 'name', 'user', 'userId', 'phone', 'address', 'birthday'];

describe('share confirmation', () => {
  it('reports success only when the browser completes the action', () => {
    expect(shareNotice({action: 'native', result: 'completed'})).toBe('shared');
    expect(shareNotice({action: 'native', result: 'cancelled'})).toBeNull();
    expect(shareNotice({action: 'native', result: 'failed'})).toBe('share-failed');
    expect(shareNotice({action: 'copy', result: 'completed'})).toBe('copied');
    expect(shareNotice({action: 'copy', result: 'failed'})).toBe('copy-failed');
    expect(shareNotice({action: 'download', result: 'started'})).toBe('download-started');
    expect(shareNotice({action: 'download', result: 'failed'})).toBe('image-failed');
  });

  it('treats a dismissed share sheet as a cancel, not a failure', () => {
    expect(nativeShareResult(new DOMException('Share canceled', 'AbortError'))).toBe('cancelled');
    expect(nativeShareResult(new DOMException('Not allowed', 'NotAllowedError'))).toBe('failed');
    expect(nativeShareResult(new Error('nope'))).toBe('failed');
  });

  it('builds a download name from the result id', () => {
    expect(resultFileName('lina-voss')).toBe('kaleid-lina-voss.png');
    expect(resultFileName('../A@b')).toBe('kaleid-ab.png');
    expect(resultFileName('***')).toBe('kaleid-result.png');
  });

  it('encodes quiz answers without personal fields', () => {
    const answers = Object.fromEntries(personalityMatch.questions.map((question) => [question.id, 'a']));
    const payload = JSON.parse(fromBase64Url(encodeAnswers(answers))) as Record<string, unknown>;

    expect(Object.keys(payload).sort()).toEqual(['answers', 'v']);
    expect(payload.v).toBe(1);
    for (const key of personalKeys) {
      expect(payload).not.toHaveProperty(key);
    }
  });
});
