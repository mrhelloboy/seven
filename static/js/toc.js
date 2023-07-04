/**
 * 文章目录css样式、及状态（hover、active等）处理逻辑
 */

let tocMapHeadTag = new Map();  // 目录跟文章的标题对应关系
let headTagMapToc = new Map();  // 文章标题跟目录的对应关系

// 获取文章所有的heading元素
const allHeads = document.querySelectorAll(".head-tag");

const startNodeLists = document.querySelectorAll("#TableOfContents > ul > li");

// Add curstom css for ele of toc
startNodeLists.forEach((node)=>{
  findNextNodeLists(node, 0);
})

function findNextNodeLists(node, level) {
  if (level >= 10) return;

  const nextNodeLists = node.querySelectorAll("ul > li");

  if (level === 0) {
    hyperLinkNodeAddClass(node, "theme-toc");
    hyperLinkNodeAddEvent(node);
    findTocMapHeadTag(node);

  } else if (nextNodeLists.length === 0 && level > 0) {
    let paddingLeft = `theme-toc-nest-${level * 1}`
    hyperLinkNodeAddClass(node, `theme-toc ${paddingLeft}`)
    hyperLinkNodeAddEvent(node);
    findTocMapHeadTag(node);
  }

  level += 1;
  nextNodeLists.forEach((nextNode)=>{
    return findNextNodeLists(nextNode, level)}
  )

}

// Add class for <a>
function hyperLinkNodeAddClass(node, classNames) {
  const hyperLinkNode = node.querySelector("a");
  classNames.split(" ").forEach((className)=>{
    hyperLinkNode.classList.add(className);
  })
}

function hyperLinkNodeAddEvent(node){
  const hyperLinkNode = node.querySelector("a");
  hyperLinkNode.href = "";
  hyperLinkNode.addEventListener("click", tocOnClick);
}

function findTocMapHeadTag(node) {
  const hyperLinkNode = node.querySelector("a");
  allHeads.forEach((headNode) => {
    if (headNode.innerText === hyperLinkNode.innerText) {
      tocMapHeadTag.set(hyperLinkNode, headNode);
      headTagMapToc.set(headNode, hyperLinkNode);
    }
  })
}

function tocOnClick(e) {
  e.preventDefault();

  // 移除所有active状态下的目录
  removeAllActive();

  // 当前目录设置为active
  onActive(e.target);

  const _headNode = tocMapHeadTag.get(e.target);
  const headNode = document.querySelector(`#${_headNode.id}`)
  window.scrollTo({top: headNode.offsetTop - 80, behavior:"smooth"});
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

// 移除所有选中状态的目录
function removeAllActive() {
  const allActiveNodes = document.querySelectorAll(".theme-toc-active");
  allActiveNodes.forEach((node) => {
    disableActive(node);
  });
}

let intersectionEles = [];
const intersectionObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry =>{
    console.log(entry)
    if (entry.isIntersecting) {
      intersectionEles.push(entry.target)
      
    }

    if (!entry.isIntersecting) {
      const idx = intersectionEles.indexOf(entry.target);
      if (idx !== -1) {
        intersectionEles.splice(idx, 1);
      }
    }
  })

  let minTop = Number.MAX_VALUE;
  let targetEle = null;
  if (intersectionEles.length > 0) {
    intersectionEles.forEach(element => {
      if (element.offsetTop <= minTop) {
        minTop = element.offsetTop;
        targetEle = element;
      }
    })
  }

  if (targetEle && headTagMapToc.get(targetEle)) {
    removeAllActive();
    onActive(headTagMapToc.get(targetEle));
  }

});

// 开始监听
allHeads.forEach((head)=>{
  intersectionObserver.observe(head);
})
