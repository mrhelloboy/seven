import { init, commentCount, pageviewCount } from '@waline/client';
import * as params from '@params';

init({
  el: '#waline',
  lang: params.lang,
  reaction: params.reaction,
  reaction: ['https://unpkg.com/@waline/emojis/tieba/tieba_agree.png'],
  search: params.search,
  serverURL: params.serverURL,
  path: window.location.pathname,
  dark: '.dark',
  meta: [],
  login: 'force',
  locale: { reactionTitle: '' },
});

// 评论数统计
if (params.enableCounts) {
  commentCount({
    serverURL: params.serverURL,
    path: window.location.pathname,
    lang: params.lang,
  });
}

// page view
if (params.enablePageView) {
  pageviewCount({
    serverURL: params.serverURL,
    selector: '.page-info-pageview-count',
    path: window.location.pathname,
  });
}
