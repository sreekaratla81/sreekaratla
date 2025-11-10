import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { mockModule } from './test-utils';

mockModule('next/navigation', {
  usePathname: () => '/'
});
mockModule('next-themes', {
  useTheme: () => ({ theme: 'light', setTheme: () => {} })
});

test('site header exposes track navigation', async () => {
  const { SiteHeader } = await import('../components/site-header');
  const html = renderToStaticMarkup(<SiteHeader />);
  for (const label of ['Tech', 'Hospitality', 'Leadership', 'Spirituality']) {
    assert(html.includes(label), `expected nav to include ${label}`);
  }
  assert(html.includes('Tech • Hospitality • Leadership • Spirituality'));
});
