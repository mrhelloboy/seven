import * as params from '@params';

twikoo.init({
  envId: params.envId,
  el: '#twikoo-comment',
  region: params.region || 'ap-guangzhou',
  path: params.path || location.pathname,
  lang: params.lang || 'en',
});

// 获取评论数
if (params.enableCounts) {
  twikoo
    .getCommentsCount({
      envId: params.envId,
      region: params.region || 'ap-guangzhou',
      urls: [params.path || location.pathname],
      includeReply: false,
    })
    .then(function (res) {
      let commentCount = document.getElementById('speed-comment-count-id');
      res.forEach((element) => {
        if (commentCount.innerText === 'Comment') {
          commentCount.innerHTML = `${element.count} Comments`;
        } else {
          return;
        }
      });
    })
    .catch(function (err) {
      // 发生错误
      console.error(err);
    });
}
