/**
 * 文章目录css样式、及状态（hover、active等）处理逻辑
 */

const tocDiv = document.getElementById("TableOfContents");
const nodeListOnToc = tocDiv.querySelectorAll("ul > li");
let currentLevel = 1;
let allLevel = 1;
let hasInitActive = false;
let catalogText = [];
let hadClick = false;
let currentHeadNode = null;
let currentHeadNodeToc = 0;
let isBottom = false;
let headNodeList = [];
let lastActiveInScroll = null;

let isVisual = false;  // 标题是否在窗口可视范围中
let canScrollSmoot = true;

nodeListOnToc.forEach((ele, idx) => {
  const aNode = ele.querySelector("a");
  aNode.classList.add("theme-toc");

  catalogText.push(aNode.innerText);

  // 多级目录样式编排
  if (allLevel > currentLevel) {
    aNode.classList.add("theme-toc-nest");
    allLevel -= 1;
  }
  const childLength = ele.childNodes.length;
  if (childLength > allLevel) {
    allLevel += childLength;
  }

  // 每条目录添加点击事件
  aNode.addEventListener("click", (e) => {
    // 移除所有active状态下的目录
    const allActiveNodes = document.querySelectorAll(".theme-toc-active");
    allActiveNodes.forEach((node) => {
      disableActive(node);
    });
    // 当前目录设置为active
    onActive(aNode);
    
    // 设置为已点击
    hadClick = true;
    // active状态的目录节点
    lastActiveInScroll = aNode;
    // 对应文章的标题节点
    currentHeadNode = headNodeList[idx];

    isVisual = isContain(currentHeadNode);
    if (isBottom && isVisual) {
      canScrollSmoot = false;
    } else {
      canScrollSmoot = true;
    }
  });
});

// 文章的标题元素对应目录的索引
const HEles = document.querySelectorAll("H1, H2, H3, H4, H5");
let HElesMap = new Map();
HEles.forEach((ele) => {
  const t = ele.innerText;
  let idx = catalogText.indexOf(t);
  if (idx > -1) {
    headNodeList.push(ele);
    HElesMap.set(ele, idx);
  }
});

// 随页面滚动，激活目录选中状态
let minTopOfHead = null;
let minTop = Number.MAX_VALUE;
document.addEventListener("scroll", function (e) {
  
  // 是否滚动到底部了
  isBottom = (this.documentElement.scrollTop + this.documentElement.clientHeight) === this.documentElement.scrollHeight;

  // 点击目录，文章在滚动中
  if (hadClick && currentHeadNode && canScrollSmoot) {
    // 如何判断点击后，文章滚动已结束
    // 标题已经到达窗口顶部
    const newHeadNodeTop = currentHeadNode.getBoundingClientRect().top
    if (newHeadNodeTop === 0) {
      hadClick = false;
      currentHeadNode = null;
      canScrollSmoot = false;
      return;
    } 
  } else {

    if (this.documentElement.getBoundingClientRect().top === 0 && lastActiveInScroll) {
      disableActive(lastActiveInScroll);
    }

    minTop = Number.MAX_VALUE ;
    HElesMap.forEach((value, key, map) => {
      let h = key.getBoundingClientRect().top;
      if (h >= 0 && h < minTop && isContain(key)) {
        liCatalog = nodeListOnToc[value];
        minTop = h;
        minTopOfHead = liCatalog.querySelector("a");
      } 
    });

    if (lastActiveInScroll) {
      disableActive(lastActiveInScroll);
    }

    if (minTopOfHead) {
      onActive(minTopOfHead);
      lastActiveInScroll = minTopOfHead; 
    } 
  }
});


function isContain(dom) {
  const totalHeight = window.innerHeight || document.documentElement.clientHeight;
  const totalWidth = window.innerWidth || document.documentElement.clientWidth;
  // 当滚动条滚动时，top, left, bottom, right时刻会发生改变。
  const { top, right, bottom, left } = dom.getBoundingClientRect();
  // console.log(top, right, bottom, left)
  return (top >= 0 && left >= 0 && right <= totalWidth && bottom <= totalHeight);
}


// 选中状态
function onActive(node) {
  node.classList.remove("theme-toc");
  node.classList.add("theme-toc-active");
}

// 移除选中状态
function disableActive(node) {
  node.classList.remove("theme-toc-active");
  node.classList.add("theme-toc");
}
