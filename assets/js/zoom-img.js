let scale = 1;
let offset = { left: 0, top: 0 };
let origin = 'center';
let initialData = { offset: {}, origin: 'center', scale: 1 };
let startPoint = { x: 0, y: 0 }; // 记录初始触摸点位
let isTouching = false; // 标记是否正在移动
let isMove = false; // 正在移动中，与点击做区别
let touches = new Map(); // 触摸点数组
let lastDistance = 0;
let lastScale = 1; // 记录下最后的缩放值
let scaleOrigin = { x: 0, y: 0 };

let isPreview = false;

let { innerWidth: winWidth, innerHeight: winHeight } = window;

let cloneEl = null;
let originalEl = null;
let mask = null;

// 临时变量
let originalOffsetWidth = 0;
let originalOffsetHeight = 0;
let originalTop = 0;
let originalLeft = 0;

for (let figureEle of document.getElementsByClassName('data-image-info')) {
  figureEle.addEventListener('click', function (e) {
    e.preventDefault();
    if (e.target.classList.contains('data-image')) {
      originalEl = e.target;
      cloneEl = originalEl.cloneNode(true);
      originalEl.style.opacity = 0.3;
      openPreview();
    }
  });
}

function openPreview() {
  scale = 1;
  isPreview = true;
  const { offsetWidth, offsetHeight } = originalEl;
  const { top, left } = originalEl.getBoundingClientRect();

  originalOffsetWidth = offsetWidth;
  originalOffsetHeight = offsetHeight;
  originalTop = top;
  originalLeft = left;

  // 创建蒙层
  mask = document.createElement('div');
  mask.classList.add('modal');
  // 添加在body下
  document.body.appendChild(mask);
  // 注册事件
  mask.addEventListener('click', clickFunc);
  mask.addEventListener('mousewheel', zoom, { passive: false });

  // 添加图片
  changeStyle(cloneEl, [`left: ${left}px`, `top: ${top}px`, `position: absolute`, `width: ${offsetWidth}px`]);
  mask.appendChild(cloneEl);
  // 移动图片到屏幕中心位置
  const originalCenterPoint = {
    x: offsetWidth / 2 + left,
    y: offsetHeight / 2 + top,
  };
  const winCenterPoint = { x: winWidth / 2, y: winHeight / 2 };
  const offsetDistance = {
    left: winCenterPoint.x - originalCenterPoint.x + left,
    top: winCenterPoint.y - originalCenterPoint.y + top,
  };
  const diffs = {
    left: ((adaptScale() - 1) * offsetWidth) / 2,
    top: ((adaptScale() - 1) * offsetHeight) / 2,
  };

  changeStyle(cloneEl, [
    'transition: all 0.3s',
    `width: ${offsetWidth * adaptScale() + 'px'}`,
    `transform: translate(${offsetDistance.left - left - diffs.left}px, ${offsetDistance.top - top - diffs.top}px)`,
  ]);
  // 消除偏差
  setTimeout(() => {
    changeStyle(cloneEl, [
      'transition: all 0s',
      `left: 0`,
      `top: 0`,
      `transform: translate(${offsetDistance.left - diffs.left}px, ${offsetDistance.top - diffs.top}px)`,
    ]);
    offset = {
      left: offsetDistance.left - diffs.left,
      top: offsetDistance.top - diffs.top,
    }; // 记录值
    record();
  }, 300);
}

// 遮罩点击事件
function clickFunc() {
  setTimeout(() => {
    if (isMove) {
      isMove = false;
    } else {
      changeStyle(cloneEl, [
        'transition: all .3s',
        `left: ${originalLeft}px`,
        `top: ${originalTop}px`,
        `transform: translate(0,0)`,
        `width: ${originalOffsetWidth}px`,
      ]);
      setTimeout(() => {
        try {
          document.body.removeChild(mask);
        } catch (e) {
          console.log(e.message);
        }
        originalEl.style.opacity = 1;
        mask.removeEventListener('click', clickFunc);
      }, 300);
      isPreview = false;
    }
  }, 280);
}

// 滚轮缩放
const zoom = (event) => {
  if (!event.deltaY) {
    return;
  }
  event.preventDefault();
  origin = `${event.offsetX}px ${event.offsetY}px`;
  // 缩放执行
  if (event.deltaY < 0) {
    scale += 0.1; // 放大
  } else if (event.deltaY > 0) {
    scale >= 0.2 && (scale -= 0.1); // 缩小
  }
  if (scale < initialData.scale) {
    reduction();
  }
  offset = getOffsetCorrection(event.offsetX, event.offsetY);
  changeStyle(cloneEl, [
    'transition: all .15s',
    `transform-origin: ${origin}`,
    `transform: translate(${offset.left + 'px'}, ${offset.top + 'px'}) scale(${scale})`,
  ]);
};

// 获取中心改变的偏差
function getOffsetCorrection(x = 0, y = 0) {
  const touchArr = Array.from(touches);
  if (touchArr.length === 2) {
    const start = touchArr[0][1];
    const end = touchArr[1][1];
    x = (start.offsetX + end.offsetX) / 2;
    y = (start.offsetY + end.offsetY) / 2;
  }
  origin = `${x}px ${y}px`;
  const offsetLeft = (scale - 1) * (x - scaleOrigin.x) + offset.left;
  const offsetTop = (scale - 1) * (y - scaleOrigin.y) + offset.top;
  scaleOrigin = { x, y };
  return { left: offsetLeft, top: offsetTop };
}

// 操作事件
window.addEventListener('pointerdown', function (e) {
  if (isPreview) {
    e.preventDefault();
    touches.set(e.pointerId, e); // TODO: 点击存入触摸点
    isTouching = true;
    startPoint = { x: e.clientX, y: e.clientY };
    if (touches.size === 2) {
      // TODO: 判断双指触摸，并立即记录初始数据
      lastDistance = getDistance();
      lastScale = scale;
    }
  }
});

window.addEventListener('pointerup', function (e) {
  if (isPreview) {
    touches.delete(e.pointerId); // TODO: 抬起移除触摸点
    if (touches.size <= 0) {
      isTouching = false;
    } else {
      const touchArr = Array.from(touches);
      // 更新点位
      startPoint = { x: touchArr[0][1].clientX, y: touchArr[0][1].clientY };
    }
    setTimeout(() => {
      isMove = false;
    }, 300);
  }
});

window.addEventListener('pointermove', (e) => {
  if (isPreview) {
    e.preventDefault();
    if (isTouching) {
      isMove = true;
      if (touches.size < 2) {
        // 单指滑动
        offset = {
          left: offset.left + (e.clientX - startPoint.x),
          top: offset.top + (e.clientY - startPoint.y),
        };
        changeStyle(cloneEl, [
          'transition: all 0s',
          `transform: translate(${offset.left + 'px'}, ${offset.top + 'px'}) scale(${scale})`,
          `transform-origin: ${origin}`,
        ]);
        // 更新点位
        startPoint = { x: e.clientX, y: e.clientY };
      } else {
        // 双指缩放
        touches.set(e.pointerId, e);
        const ratio = getDistance() / lastDistance;
        scale = ratio * lastScale;
        offset = getOffsetCorrection();
        if (scale < initialData.scale) {
          reduction();
        }
        changeStyle(cloneEl, [
          'transition: all 0s',
          `transform: translate(${offset.left + 'px'}, ${offset.top + 'px'}) scale(${scale})`,
          `transform-origin: ${origin}`,
        ]);
      }
    }
  }
});
window.addEventListener('pointercancel', function (e) {
  touches.clear(); // 可能存在特定事件导致中断，真机操作时 pointerup 在某些边界情况下不会生效，所以需要清空
});

document.addEventListener('keydown', function (event) {
  if (event.code === 'Escape' && isPreview) {
    clickFunc();
  }
});

// 修改样式，减少回流重绘
function changeStyle(el, arr) {
  const original = el.style.cssText.split(';');
  original.pop();
  el.style.cssText = original.concat(arr).join(';') + ';';
}

// 计算自适应屏幕的缩放值
function adaptScale() {
  const { offsetWidth: w, offsetHeight: h } = originalEl;
  let scale = 0;
  scale = winWidth / w;
  if (h * scale > winHeight - 80) {
    scale = (winHeight - 80) / h;
  }
  return scale;
}

// 获取距离
function getDistance() {
  const touchArr = Array.from(touches);
  if (touchArr.length < 2) {
    return 0;
  }
  const start = touchArr[0][1];
  const end = touchArr[1][1];
  return Math.hypot(end.x - start.x, end.y - start.y);
}

// 记录初始化数据
function record() {
  initialData = Object.assign({}, { offset, origin, scale });
}

// 还原记录，用于边界处理
let timer = null;
function reduction() {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    offset = initialData.offset;
    origin = initialData.origin;
    scale = initialData.scale;
    changeStyle(cloneEl, [
      `transform: translate(${offset.left + 'px'}, ${offset.top + 'px'}) scale(${scale})`,
      `transform-origin: ${origin}`,
    ]);
  }, 300);
}
