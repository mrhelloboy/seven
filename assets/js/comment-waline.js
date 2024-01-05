import * as params from '@params';
import * as data from 'data/waline.json';

let locale = data.locale;

Waline.init({
  el: '#waline',
  lang: params.lang,
  reaction: params.reaction,
  search: params.search,
  comment: params.comment,
  pageview: params.pageview,
  serverURL: params.serverURL,
  dark: '.dark',
  meta: data.meta || [],
  locale,
});
