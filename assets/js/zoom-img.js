const contentDom = document.querySelector("#single-content");
const imgDoms = contentDom.querySelectorAll("img");

const imgZoomDiv = document.getElementById("img-zoom");
const imgContent = document.getElementById("img-content");
let zoomTimes = 0;


function showOrHiddenImgZoomDiv() {
  imgZoomDiv.classList.toggle("hidden");
  imgZoomDiv.classList.toggle("flex");
}

function hiddenImgContent() {
  imgZoomDiv.classList.add("zoomOut");
  imgZoomDiv.classList.remove("zoomIn");

  setTimeout(()=>{
    imgContent.style.backgroundImage = "";
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
    
    imgContent.style.backgroundImage = `url(${imgDom.src})`;
  })
})
