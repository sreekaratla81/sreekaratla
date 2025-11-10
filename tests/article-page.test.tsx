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
  body: { code: string };
  _raw: { sourceFilePath: string; sourceFileName: string; sourceFileDir: string; flattenedPath: string };
};

const samplePost: TestPost = {
  _id: 'tech-post',
  title: 'Sample Article',
  description: 'Testing breadcrumbs',
  date: '2024-01-01',
  url: '/tech/sample-article',
  tags: ['sample'],
  track: 'tech',
  readingTime: { minutes: 3, text: '3 min read', time: 180000, words: 600 },
  body: { code: '' },
  _raw: {
    sourceFilePath: 'tech/sample-article.mdx',
    sourceFileName: 'sample-article.mdx',
    sourceFileDir: 'tech',
    flattenedPath: 'tech/sample-article'
  }
};

mockModule('next/headers', {
  draftMode: () => ({ isEnabled: false })
});
mockModule('../lib/content', {
  getPostByParams: () => samplePost,
  resolveTrack: () => 'tech',
  getAdjacentPosts: () => ({ previous: null, next: null }),
  getRelatedPosts: () => []
});
mockModule('next-contentlayer/hooks', {
  useMDXComponent: () => () => 'MDX Body'
});
mockModule('contentlayer/generated', {
  allPosts: []
});

test('article page renders breadcrumbs', async () => {
  const { default: ArticlePage } = await import('../app/(blog)/[category]/[slug]/page');
  const element = ArticlePage({ params: { category: 'tech', slug: 'sample-article' } });
  const html = renderToStaticMarkup(<>{element}</>);
  for (const crumb of ['Home', 'Tech', 'Sample Article']) {
    assert(html.includes(crumb), `breadcrumb missing ${crumb}`);
  }
});
