import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { mockModule } from './test-utils';

type TestPost = {
  _id: string;
  title: string;
  description: string;
  date: string;
  url: string;
  tags?: string[];
  track: string;
  readingTime: { minutes: number; text: string; time: number; words: number };
  _raw: { sourceFilePath: string; sourceFileName: string; sourceFileDir: string; flattenedPath: string };
};

const makePost = (track: string): TestPost => ({
  _id: `${track}-post`,
  title: `${track} sample`,
  description: `${track} description`,
  date: '2024-01-01',
  url: `/${track}/sample`,
  tags: ['sample'],
  track,
  readingTime: { minutes: 3, text: '3 min read', time: 180000, words: 600 },
  _raw: {
    sourceFilePath: `${track}/sample.mdx`,
    sourceFileName: 'sample.mdx',
    sourceFileDir: track,
    flattenedPath: `${track}/sample`
  }
});

mockModule('next/headers', {
  draftMode: () => ({ isEnabled: false })
});
mockModule('../lib/content', {
  TRACKS: ['tech', 'hospitality', 'leadership', 'spirituality'],
  getFeaturedPosts: ({ track }: { track: string }) => (track === 'tech' ? [makePost(track)] : []),
  getPostsByTrack: (track: string) => [makePost(track)],
  resolveTrack: (post: TestPost) => post.track,
  getTags: () => ['sample']
});

test('home page highlights four tracks and hero ctas', async () => {
  const { default: MarketingHomePage } = await import('../app/(marketing)/page');
  const html = renderToStaticMarkup(<MarketingHomePage />);
  const headings = [
    'Technology &amp; AI',
    'Hospitality Ventures',
    'Leadership Ops',
    'Spirituality in Practice'
  ];
  for (const label of headings) {
    assert(html.includes(label));
  }
  for (const cta of ['Download Resume', 'Newsletter Signup', 'Browse Articles']) {
    assert(html.includes(cta));
  }
});
