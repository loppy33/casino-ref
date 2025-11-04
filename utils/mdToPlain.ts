import removeMd from 'remove-markdown';

export const mdToPlain = (md: string): string =>
  removeMd(md)
    .replace(/\s+/g, ' ')
    .trim();