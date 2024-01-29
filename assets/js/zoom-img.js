let isPreview = false; // 是否在预览状态
let cloneEl = null; // 图片克隆节点
let originalEl = null; // 原图节点
let mask = null; // 蒙层
let currentScrollTop = 0; // 当前滚动条位置

document.addEventListener('DOMContentLoaded', () => {
  Array.from(document.getElementsByClassName('data-image')).forEach((element) => {
    element.addEventListener('click', function (e) {
      e.preventDefault();
      originalEl = e.target;
      cloneEl = originalEl.cloneNode(true);
      originalEl.style.opacity = 0.3;
      openPreview();
    });
  });
});

// 打开预览
function openPreview() {
  isPreview = true;
  const { offsetWidth } = originalEl;
  const { top, left } = originalEl.getBoundingClientRect();

  // 创建蒙层
  mask = document.createElement('div');
  mask.classList.add('modal');
  document.body.appendChild(mask);

  mask.addEventListener('click', () => {
    cancelScaleImg();
  });

  // 添加图片
  changeStyle(cloneEl, [
    'transition: transform 0.5s ease;',
    `left: ${left}px`,
    `top: ${top}px`,
    `position: absolute`,
    `width: ${offsetWidth}px`,
  ]);
  mask.appendChild(cloneEl);

  cloneEl.onload = () => {
    moveAndScaleImg();
  };

  // 记录滚动条位置
  currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
}

// 移动及缩放图像
function moveAndScaleImg() {
  // 获取屏幕尺寸
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // 获取图片尺寸
  const imageWidth = originalEl.offsetWidth;
  const imageHeight = originalEl.offsetHeight;

  // 计算缩放比例
  const scaleX = screenWidth / imageWidth;
  const scaleY = screenHeight / imageHeight;
  const scale = Math.min(scaleX, scaleY);

  // 计算平移量
  const imageRect = originalEl.getBoundingClientRect();
  const translateX = (screenWidth - imageRect.width) / 2 - imageRect.left;
  const translateY = (screenHeight - imageRect.height) / 2 - imageRect.top;

  // 移动及缩放
  changeStyle(cloneEl, [`transform: translate(${translateX}px, ${translateY}px) scale(${scale - 0.1})`]);
}

// 取消缩放
function cancelScaleImg() {
  const { top, left } = originalEl.getBoundingClientRect();
  changeStyle(cloneEl, [
    'transition: transform 0.5s ease;',
    `left: ${left}px`,
    `top: ${top}px`,
    `transform: translate(0,0)`,
  ]);

  setTimeout(() => {
    if (mask.parentNode) {
      mask.parentNode.removeChild(mask);
    }
    originalEl.style.opacity = 1;
    mask.removeEventListener('click', cancelScaleImg);
    isPreview = false;
  }, 500);
}

// 跟随屏幕宽度改变图片位置及大小
window.addEventListener('resize', () => {
  if (isPreview) {
    const { offsetWidth } = originalEl;
    const { top, left } = originalEl.getBoundingClientRect();
    changeStyle(cloneEl, [`left: ${left}px`, `top: ${top}px`, `position: absolute`, `width: ${offsetWidth}px`]);
    moveAndScaleImg();
  }
});

window.addEventListener('scroll', function () {
  if (isPreview) {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollDistance = Math.abs(scrollTop - currentScrollTop);

    if (scrollDistance > 20) {
      scrollDistance = 0;
      cancelScaleImg();
      return;
    }
  }
});

document.addEventListener('keydown', function (event) {
  if (event.code === 'Escape' && isPreview) {
    cancelScaleImg();
  }
});

// 修改样式，减少回流重绘
function changeStyle(el, arr) {
  const original = el.style.cssText.split(';');
  original.pop();
  el.style.cssText = original.concat(arr).join(';') + ';';
}
