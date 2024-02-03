const track = document.getElementById('track'),
  slides = Array.from(track.children),
  nextSlideButton = document.getElementById('carouselNextSlideButton'),
  previousSlideButton = document.getElementById('carouselPreviousSlideButton'),
  carouselNav = document.getElementById('carouselNav'),
  carouselNavDots = Array.from(carouselNav.children);
window.addEventListener('resize', setSlideImagePosition)
//  position slide images parallel to one another horizontally
function setSlideImagePosition() {
  slideXDimension = slides[0].getBoundingClientRect().width;
  for (let index = 0; index < slides.length; index++) { 
    slides[index].style.left = `${index * slideXDimension}px`
  }
  const currentSlide = track.querySelector('.current-slide');
  track.style.transform = `translateX(-${currentSlide.style.left})`
}
setSlideImagePosition();
//  current slide is moved to the left when next button is clicked 
function moveSlide(track, currentSlide, targetSlide) { 
  track.style.transform = `translateX(-${targetSlide.style.left})`;
  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
}
nextSlideButton.addEventListener('click', function () { 
  const currentSlide = track.querySelector('.current-slide');
  const targetSlide = currentSlide.nextElementSibling;
  const currentDot = carouselNav.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling;
  if (targetSlide) {
    moveSlide(track, currentSlide, targetSlide)
    updateCarouselDots(currentDot, nextDot)
  } else { 
    const targetSlide = slides[0];
    const nextDot = carouselNavDots[0]
    moveSlide(track, currentSlide, targetSlide)
    updateCarouselDots(currentDot, nextDot)
  }
})
previousSlideButton.addEventListener('click', function () { 
  const currentSlide = track.querySelector('.current-slide');
  const targetSlide = currentSlide.previousElementSibling;
  const currentDot = carouselNav.querySelector('.current-slide');
  const nextDot = currentDot.previousElementSibling;
  if (targetSlide) {
    moveSlide(track, currentSlide, targetSlide)
    updateCarouselDots(currentDot, nextDot)
  } else { 
    const targetSlide = slides[slides.length - 1];
    const nextDot = carouselNavDots[carouselNavDots.length - 1]
    moveSlide(track, currentSlide, targetSlide)
    updateCarouselDots(currentDot, nextDot)
  }
})
carouselNav.addEventListener('click', function (event) { 
  targetDot = event.target.closest('button');
  console.log(targetDot)
  if (!targetDot) { 
    return
  }
  const currentSlide = track.querySelector('.current-slide'),
        currentDot = carouselNav.querySelector('.current-slide'),
        targetIndex = carouselNavDots.findIndex(dot => dot === targetDot),
        targetSlide = slides[targetIndex];
  moveSlide(track, currentSlide, targetSlide);
  updateCarouselDots(currentDot, targetDot);
})
function updateCarouselDots(currentDot, targetDot) { 
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
} 
slides.forEach(setSlideImagePosition)