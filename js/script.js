// Carousel images list
const carouselImages = [
  'images/vignette1.jpg',
  'images/vignette2.jpg',
  'images/vignette3.jpg',
  'images/vignette4.jpg',
  'images/vignette5.jpg',
  'images/vignette6.jpg',
  'images/vignette7.jpg',
  'images/vignette8.jpg',
  'images/vignette9.jpg',
  'images/vignette10.jpg',
  'images/vignette11.jpg',
  'images/vignette12.jpg',
  'images/vignette13.jpg',
  'images/vignette14.jpg',
  'images/vignette15.jpg',
  'images/vignette16.jpg',
  'images/vignette17.jpg',
  'images/vignette18.jpg',
  'images/vignette19.jpg',
  'images/vignette20.jpg'
];

// Shuffle function (Fisher-Yates)
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

let shuffledImages = shuffle([...carouselImages]);
let currentIndex = 0;

function blinkImage(img, times, callback) {
  let count = 0;
  function blink() {
    img.style.opacity = (img.style.opacity == '1' || img.style.opacity === '') ? '0' : '1';
    count++;
    if (count < times * 2) {
      setTimeout(blink, 100);
    } else {
      callback();
    }
  }
  blink();
}

function rotateCarousel() {
  const img = document.getElementById('carousel-img');
  if (!img) return;

  currentIndex = (currentIndex + 1) % shuffledImages.length;
  let newSrc = shuffledImages[currentIndex];
  let tempImg = new Image();
  tempImg.src = newSrc;

  tempImg.onload = () => {
    blinkImage(img, 3, () => {
      img.src = newSrc;
      img.style.opacity = '1';
    });
  };

  tempImg.onerror = () => {
    console.warn('Image failed to load:', newSrc);
    shuffledImages.splice(currentIndex, 1);
    currentIndex = currentIndex % shuffledImages.length;
    rotateCarousel();
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('carousel-img');
  if (img) {
    img.src = shuffledImages[0];
    img.style.opacity = '1';
  }

  setInterval(rotateCarousel, 3500);

  // Enter button logic on splash page
  const enterBtn = document.getElementById('enter-btn');
  if (!enterBtn) return;

  let vx = 2;
  let vy = 2;

  function moveButton() {
    const parent = enterBtn.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const btnRect = enterBtn.getBoundingClientRect();

    let left = enterBtn.offsetLeft + vx;
    let top = enterBtn.offsetTop + vy;

    if (left + btnRect.width > parentRect.width || left < 0) vx = -vx;
    if (top + btnRect.height > parentRect.height || top < 0) vy = -vy;

    enterBtn.style.left = left + 'px';
    enterBtn.style.top = top + 'px';

    requestAnimationFrame(moveButton);
  }

  enterBtn.style.position = 'absolute';
  enterBtn.style.left = Math.random() * (enterBtn.parentElement.clientWidth - enterBtn.clientWidth) + 'px';
  enterBtn.style.top = Math.random() * (enterBtn.parentElement.clientHeight - enterBtn.clientHeight) + 'px';

  moveButton();

  enterBtn.addEventListener('click', () => {
    window.location.href = 'home.html';
  });

  // ✅ Spacebar also triggers enter (desktop only)
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      enterBtn.click();
    }
  });
});

// Fixed name on work page: no special JS needed, CSS sticky handles it

// Project image data
const projectImages = {
  polyptychum: {
    count: 5,
    prefix: 'polyptychum',
    folder: 'images'
  },
  istanbul: {
    count: 26,
    prefix: 'istanbul',
    folder: 'images'
  },
  gardiensdelart: {
    count: 20,
    prefix: 'gardiensdelart',
    folder: 'images'
  }
};

function isWorkPage() {
  return document.body.classList.contains('work-page');
}

function isProjectPage() {
  return document.body.classList.contains('project-page');
}

// --- WORK PAGE ---
if (isWorkPage()) {
  document.querySelectorAll('.project-vignette').forEach(vignette => {
    vignette.addEventListener('click', () => {
      const project = vignette.getAttribute('data-project');
      window.location.href = project + '.html';
    });
  });
}

// --- PROJECT PAGE CAROUSEL ---
if (isProjectPage()) {
  const mainPhoto = document.getElementById('main-photo');
  const thumbnailBar = document.getElementById('thumbnail-bar');
  const arrowLeft = document.getElementById('arrow-left');
  const arrowRight = document.getElementById('arrow-right');

  const projectName = document.querySelector('.name-title').textContent.toLowerCase().replace(/[^a-z]/g, '');

  let projectKey = null;
  for (const key in projectImages) {
    if (window.location.pathname.includes(key)) {
      projectKey = key;
      break;
    }
  }

  if (!projectKey) {
    projectKey = projectName;
  }

  const imagesData = projectImages[projectKey];
  if (!imagesData) {
    console.error('No image data found for project:', projectKey);
  } else {
    let currentIndex = 0;

    for (let i = 1; i <= imagesData.count; i++) {
      const thumb = document.createElement('img');
      thumb.src = `${imagesData.folder}/${imagesData.prefix}${i}.jpg`;
      thumb.alt = `${imagesData.prefix} photo ${i}`;
      thumb.dataset.index = i - 1;
      if (i === 1) thumb.classList.add('active');
      thumbnailBar.appendChild(thumb);
    }

    function updateMainPhoto(index) {
      if (index < 0) index = imagesData.count - 1;
      if (index >= imagesData.count) index = 0;
      currentIndex = index;
      mainPhoto.src = `${imagesData.folder}/${imagesData.prefix}${currentIndex + 1}.jpg`;

      thumbnailBar.querySelectorAll('img').forEach(img => {
        img.classList.remove('active');
      });
      thumbnailBar.querySelector(`img[data-index="${currentIndex}"]`).classList.add('active');
    }

    arrowLeft.addEventListener('click', () => {
      updateMainPhoto(currentIndex - 1);
    });

    arrowRight.addEventListener('click', () => {
      updateMainPhoto(currentIndex + 1);
    });

    thumbnailBar.addEventListener('click', e => {
      if (e.target.tagName === 'IMG') {
        const idx = parseInt(e.target.dataset.index, 10);
        updateMainPhoto(idx);
      }
    });

    updateMainPhoto(0);
  }
}

