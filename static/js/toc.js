/**
 * 文章目录css样式、及状态（hover、active等）处理逻辑
 */

const tocDiv = document.getElementById("TableOfContents");
const liEleList = tocDiv.querySelectorAll("ul > li");
let currentLevel = 1;
let allLevel = 1;
let hasInitActive = false;
let catalogText = [];
let hadClick = false;
let lastActiveInScroll = null;

liEleList.forEach((ele) => {
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
    const allActiveNodes = document.querySelectorAll(".theme-toc-active");
    allActiveNodes.forEach((node) => {
      disableActive(node);
    });
    onActive(aNode);
    
    hadClick = true;
    lastActiveInScroll = aNode;
  });
});

// 文章的标题元素对应目录的索引
const HEles = document.querySelectorAll("H1, H2, H3, H4, H5");
let HElesMap = new Map();
HEles.forEach((ele) => {
  const t = ele.innerText;
  let idx = catalogText.indexOf(t);
  if (idx > -1) {
    HElesMap.set(ele, idx);
  }
});

// 随页面滚动，激活目录选中状态
document.addEventListener("scroll", function (e) {
  if (hadClick) {
    hadClick = false;
    return
  };
  if (this.documentElement.getBoundingClientRect().top === 0 && lastActiveInScroll) {
    disableActive(lastActiveInScroll);
  }

  HElesMap.forEach((value, key, map) => {
    let h = key.getBoundingClientRect().top;

    if (h > 70 && h < 200) {
      liCatalog = liEleList[value];
      const node = liCatalog.querySelector("a");
      if (lastActiveInScroll) {
        disableActive(lastActiveInScroll);
      }
      onActive(node);
      lastActiveInScroll = node;
    }
  });
});

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
