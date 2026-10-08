import {toBlob} from 'html-to-image';

const options = {
  pixelRatio: 2,
  cacheBust: true,
  backgroundColor: '#07060f',
} as const;

export async function resultCardToPng(node: HTMLElement): Promise<Blob | null> {
  try {
    const blob = await toBlob(node, options);
    if (blob && blob.size > 200) {
      return blob;
    }
  } catch {
    // The styled capture can fail when a font stylesheet cannot be read. Retry once without it.
  }

  try {
    const blob = await toBlob(node, {...options, skipFonts: true, fontEmbedCSS: ' '});
    if (blob && blob.size > 200) {
      return blob;
    }
    return null;
  } catch {
    return null;
  }
}
