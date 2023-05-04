'use strict';

////////////////////////
//    DOM ELEMENTS    //
////////////////////////

const allSections = document.querySelectorAll('.section');
const allWrappers = document.querySelectorAll('.wrapper');

const slides = document.querySelectorAll('.slide');
const portfolioBtns = document.querySelectorAll('.portfolio__btn');
const tabBar = document.querySelector('.tabs');
const tabs = document.querySelectorAll('.tab');
const allContent = document.querySelectorAll('.content');

const nav = document.querySelector('.nav');

////////////////////////
//     FUNCTIONS      //
////////////////////////

// ANIMATION FUNCTIONS

// Set nav icon active

const animateNavIcon = icon => {
  document
    .querySelectorAll('.nav__icon_wrapper')
    .forEach(navWrapper => navWrapper.setAttribute('data-active', 'false'));

  icon.setAttribute('data-active', 'true');
};

const convertToIconID = sections => {
  const [section] = sections;
  const icon = document.getElementById(`icon--${section.target.id.slice(5)}`);

  animateNavIcon(icon);
};

const sectionIconObserver = new IntersectionObserver(convertToIconID, {
  root: null,
  threshold: 0.6,
});

allSections.forEach(section => sectionIconObserver.observe(section));

// Reveal sections

const revealWrapper = function (entries, observer) {
  const [wrapper] = entries;

  if (!wrapper.isIntersecting) return;

  wrapper.target.classList.remove('wrapper--hidden');

  observer.unobserve(wrapper.target);
};

const wrapperObserver = new IntersectionObserver(revealWrapper, {
  root: null,
  threshold: 0,
});

allWrappers.forEach(wrapper => {
  wrapperObserver.observe(wrapper);
  wrapper.classList.add('wrapper--hidden');
});

// Tab Selector

const animateTab = el => {
  const cur = document.getElementById(`${el.id}--text`);

  tabs.forEach(tab => tab.classList.remove('tab--active'));
  allContent.forEach(c => c.classList.add('text--hidden'));

  el.classList.add('tab--active');
  cur.classList.remove('text--hidden');
};

// Slider Component

let currentSlide = 0;
const maxSlide = slides.length;

const nextSlide = function () {
  if (currentSlide === maxSlide) currentSlide = 0;
  if (currentSlide < 0) currentSlide = maxSlide - 1;

  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${(i - currentSlide) * 100}%)`)
  );
};

nextSlide(0);

// Regular Functions

function resetFields() {
  document.getElementById('fullName').value =
    document.getElementById('email_id').value =
    document.getElementById('number').value =
    document.getElementById('message').value =
      '';
}

function toggleMessage(sent, text) {
  const message = document.querySelector('.email__status');

  message.setAttribute('data-sent', sent);

  message.innerHTML = text;

  setTimeout((message.style.opacity = '1'), 1);

  setTimeout(() => {
    message.style.opacity = '0';
  }, 2000);
}

const emailSent = function (status) {
  if (status === 200) {
    // Email sent, give confirmation
    toggleMessage('true', 'Your message has been sent');
  } else {
    // Something went wrong, give error
    toggleMessage('false', `Your message could not be sent! Error: ${status}`);
  }
};

function SendMail() {
  const params = {
    from_name: document.getElementById('fullName').value,
    email_id: document.getElementById('email_id').value,
    number: document.getElementById('number').value,
    message: document.getElementById('message').value,
  };

  if (params.from_name && params.email_id && params.number && params.message)
    emailjs
      .send('service_umljrts', 'template_wcqt77j', params)
      .then(function (res) {
        emailSent(res.status);
        resetFields();
      });
  else toggleMessage('false', 'Please fill in all fields');
}

////////////////////////
//  EVENT LISTENERS   //
////////////////////////

nav.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.nav__icon_wrapper');

  if (!clicked) return;

  const sectionID = clicked.id.slice(6);
  const section = document.getElementById(`sec--${sectionID}`);
  section.scrollIntoView({ behavior: 'smooth' });
});

tabBar.addEventListener('click', function (e) {
  e.preventDefault();
  const clicked = e.target.closest('.tab');

  if (!clicked) return;

  animateTab(clicked);
});

portfolioBtns.forEach(btn =>
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const clicked = e.target.closest('i');

    if (!clicked) return;

    if (clicked.id === 'left') {
      currentSlide--;
      nextSlide(-1);
    } else if (clicked.id === 'right') {
      currentSlide++;
      nextSlide();
    }
  })
);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    currentSlide++;
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    currentSlide--;
    nextSlide();
  }
});
