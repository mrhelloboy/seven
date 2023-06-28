const contentDom = document.querySelector("#single-content");
const imgDoms = contentDom.querySelectorAll("img");

const imgZoomDiv = document.getElementById("img-zoom");
const imgContent = document.getElementById("img-content");
let zoomTimes = 0;


function showOrHiddenImgZoomDiv() {
  imgZoomDiv.classList.toggle("hidden");
  imgZoomDiv.classList.toggle("fixed");
}

function hiddenImgContent() {
  imgZoomDiv.classList.add("zoomOut");
  imgZoomDiv.classList.remove("zoomIn");

  setTimeout(()=>{
    imgContent.src = "";
    showOrHiddenImgZoomDiv();
    zoomTimes = 0;
  }, 900);
}

imgZoomDiv.addEventListener('click', (e) => {
  hiddenImgContent();
})

imgDoms.forEach((imgDom)=>{
  imgDom.addEventListener("click", (e)=>{
    imgZoomDiv.classList.add("zoomIn");
    imgZoomDiv.classList.remove("zoomOut");
    showOrHiddenImgZoomDiv();
    
    imgContent.src = imgDom.src;
  })
})

window.addEventListener("scroll", (e)=>{
  if(imgZoomDiv.classList.contains("fixed") && zoomTimes === 0) {
    zoomTimes += 1;
    hiddenImgContent();
  }
})