import * as params from '@params';
import * as data from 'data/waline.json';

let locale = data.locale;

Waline.init({
  el: '#waline',
  lang: params.lang,
  reaction: params.reaction,
  search: params.search,
  serverURL: params.serverURL,
  path: window.location.pathname,
  dark: '.dark',
  meta: data.meta || [],
  locale,
});

// 评论数统计
if (params.enableCounts) {
  Waline.commentCount({
    serverURL: params.serverURL,
    path: window.location.pathname,
    lang: params.lang,
  });
}

// page view
if (params.enablePageView) {
  console.log('page view');
  Waline.pageviewCount({
    serverURL: params.serverURL,
    selector: '.page-info-pageview-count',
    path: window.location.pathname,
  });
}
