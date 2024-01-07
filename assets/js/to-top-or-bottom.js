import * as params from '@params';

let toTopButton = document.getElementById('to-top-button');
toTopButton && toTopButton.addEventListener('click', goToTop);

let toBottomButton = document.getElementById('to-bottom-button');
toBottomButton && toBottomButton.addEventListener('click', goToBottom);

// When the user scrolls down 200px from the top of the document, show the button
window.onscroll = function () {
  if (!params.disableToTop) {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
      toTopButton.classList.remove('hidden');
    } else {
      toTopButton.classList.add('hidden');
    }
  }

  if (!params.disableToBottom) {
    if (isBottom()) {
      // 页面处于底部，就隐藏按钮
      toBottomButton.classList.add('hidden');
    } else {
      // 页面不处于底部，就显示按钮
      toBottomButton.classList.remove('hidden');
    }
  }
};

// When the user clicks on the button, scroll to the top of the document
function goToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function isBottom() {
  // 页面可视区域高度
  let clientHeight = document.documentElement.clientHeight;
  // 页面实际高度
  let scrollHeight = document.documentElement.scrollHeight;
  // 页面可视区域距离底部距离
  let scrollTop = document.documentElement.scrollTop;
  // 页面实际高度与可视区域高度之差
  let scrollHeightMinusClientHeight = scrollHeight - clientHeight;
  if (scrollHeightMinusClientHeight <= scrollTop) {
    return true;
  } else {
    return false;
  }
}
