// Today
const TODAY_ID = "today";
const date_options = {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long'
};

const time_options = {
  timeZone: 'Asia/Ho_Chi_Minh',
  hour12: false,
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
}
try{
setInterval(updateDateAndTime, 1000);
} catch (e){

}

function updateDateAndTime() {
  date = new Date();
  today = date.toLocaleDateString('vi-VN', date_options);
  time = date.toLocaleDateString('vi-VN', time_options);
  document.getElementById("today").innerHTML = time.toString().substr(0, time.toString().indexOf(' ')) + ' • ' + today.toString();
}

// weather
(function (d, s, id) {
  if (d.getElementById(id)) {
    if (window.__TOMORROW__) {
      window.__TOMORROW__.renderWidget();
    }
    return;
  }
  const fjs = d.getElementsByTagName(s)[0];
  const js = d.createElement(s);
  js.id = id;
  js.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";

  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'tomorrow-sdk');

// Carousel
var slideIndex = 0;
const INTERVAL = 3000;
const INDICATORS_CLASS = "carousel_indicator";
const SLIDE_CLASS = "carousel_slide";
const CURRENT_INDICATOR_CLASS = "current-indicator";
const CURRENT_SLIDE_CLASS = "current-carousel_slide";

var intervalID = null;
changeSlide(slideIndex);

function changeSlide(index) {
  slideIndex = index;
  slides = document.getElementsByClassName(SLIDE_CLASS);
  // Remove all current slide
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove(CURRENT_SLIDE_CLASS);
  }
  // add current slide
  slides[index].classList.add(CURRENT_SLIDE_CLASS);

  clearInterval(intervalID);
  intervalID = setInterval(automaticSlides, INTERVAL);
}

function clickIndicators(index) {
  slideIndex = index;
  indicators = document.getElementsByClassName(INDICATORS_CLASS);
  // Remove all current indicator
  for (let i = 0; i < indicators.length; i++) {
    indicators[i].classList.remove(CURRENT_INDICATOR_CLASS);
  }
  // add current indicator
  indicators[index].classList.add(CURRENT_INDICATOR_CLASS);
  changeSlide(index);
}

function nextSlide() {
  indicators = document.getElementsByClassName(INDICATORS_CLASS);
  clickIndicators((slideIndex += 1) % indicators.length);
}
function prevSlide() {
  indicators = document.getElementsByClassName(INDICATORS_CLASS);
  clickIndicators((slideIndex -= 1) % indicators.length);
}

function automaticSlides() {
  indicators = document.getElementsByClassName(INDICATORS_CLASS);
  slides = document.getElementsByClassName(SLIDE_CLASS);
  indicators[slideIndex].classList.remove(CURRENT_INDICATOR_CLASS);
  slides[slideIndex].classList.remove(CURRENT_SLIDE_CLASS);

  slideIndex = (slideIndex + 1) % indicators.length;
  // add current slide
  indicators[slideIndex].classList.add(CURRENT_INDICATOR_CLASS);
  slides[slideIndex].classList.add(CURRENT_SLIDE_CLASS);
}