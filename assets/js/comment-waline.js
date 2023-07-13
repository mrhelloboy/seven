import * as params from '@params';
Waline.init({
    el: '#waline',
    lang: params.lang,
    reaction: params.reaction,
    search: params.search,
    comment: params.comment,
    pageview: params.pageview,
    serverURL: params.serverURL,
});