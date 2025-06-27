// ------------------------------
// Carousel on home page
// ------------------------------

const carouselImages = [
  'images/vignette1.jpg', 'images/vignette2.jpg', 'images/vignette3.jpg',
  'images/vignette4.jpg', 'images/vignette5.jpg', 'images/vignette6.jpg',
  'images/vignette7.jpg', 'images/vignette8.jpg', 'images/vignette9.jpg',
  'images/vignette10.jpg', 'images/vignette11.jpg', 'images/vignette12.jpg',
  'images/vignette13.jpg', 'images/vignette14.jpg', 'images/vignette15.jpg',
  'images/vignette16.jpg', 'images/vignette17.jpg', 'images/vignette18.jpg',
  'images/vignette19.jpg', 'images/vignette20.jpg'
];

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
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
    img.style.opacity = (img.style.opacity === '1' || img.style.opacity === '') ? '0' : '1';
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
  const newSrc = shuffledImages[currentIndex];
  const tempImg = new Image();
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

// ------------------------------
// DOM Ready Logic
// ------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const img = document.getElementById('carousel-img');
  if (img) {
    img.src = shuffledImages[0];
    img.style.opacity = '1';
    setInterval(rotateCarousel, 3500);
  }

  // Splash page logic
  const enterBtn = document.getElementById('enter-btn');
  if (enterBtn) {
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

    function goToHome() {
      window.location.href = 'home.html';
    }

    enterBtn.addEventListener('click', goToHome);

    // Fix for iPhone / iPad tap not triggering 'click'
    enterBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      goToHome();
    });

    // Support Enter and Space keys (mobile and desktop)
    document.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'Enter' || key === ' ') {
        e.preventDefault();
        goToHome();
      }
    });

    enterBtn.setAttribute('tabindex', '0'); // focusable for keyboard and virtual keyboards
  }

  // Work page logic
  if (isWorkPage()) {
    document.querySelectorAll('.project-vignette').forEach(vignette => {
      vignette.addEventListener('click', () => {
        const project = vignette.getAttribute('data-project');
        window.location.href = project + '.html';
      });
    });
  }

  // Project page logic
  if (isProjectPage()) {
    initProjectCarousel();
  }
});

// ------------------------------
// Page Type Detection
// ------------------------------

function isWorkPage() {
  return document.body.classList.contains('work-page');
}

function isProjectPage() {
  return document.body.classList.contains('project-page');
}

// ------------------------------
// Project Image Viewer
// ------------------------------

const projectImages = {
  polyptychum: { count: 4, prefix: 'polyptychum', folder: 'images' },
  istanbul: { count: 26, prefix: 'istanbul', folder: 'images' },
  gardiensdelart: { count: 9, prefix: 'gardiensdelart', folder: 'images' },
  insidebollards: { count: 13, prefix: 'insidebollards', folder: 'images' },
  visionindirecte: { count: 26, prefix: 'visionindirecte', folder: 'images' },
  bulgaria: { count: 39, prefix: 'bulgaria', folder: 'images' },
  croatia: { count: 56, prefix: 'croatia', folder: 'images' },
  flora: { count: 9, prefix: 'flora', folder: 'images' },
  fragments: { count: 3, prefix: 'fragments', folder: 'images' },

};

function initProjectCarousel() {
  const mainPhoto = document.getElementById('main-photo');
  const thumbnailBar = document.getElementById('thumbnail-bar');
  const arrowLeft = document.getElementById('arrow-left');
  const arrowRight = document.getElementById('arrow-right');
  // Keyboard arrow support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') updateMainPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') updateMainPhoto(currentIndex + 1);
  });


  // Determine project key from URL or title
  const projectName = document.querySelector('.name-title')?.textContent.toLowerCase().replace(/[^a-z]/g, '');
  let projectKey = null;

  for (const key in projectImages) {
    if (window.location.pathname.includes(key)) {
      projectKey = key;
      break;
    }
  }
  if (!projectKey) projectKey = projectName;

  const imagesData = projectImages[projectKey];
  if (!imagesData) {
    console.error('No image data found for project:', projectKey);
    return;
  }

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

    thumbnailBar.querySelectorAll('img').forEach(img => img.classList.remove('active'));
    const activeThumb = thumbnailBar.querySelector(`img[data-index="${currentIndex}"]`);
    if (activeThumb) activeThumb.classList.add('active');
  }

  arrowLeft?.addEventListener('click', () => updateMainPhoto(currentIndex - 1));
  arrowRight?.addEventListener('click', () => updateMainPhoto(currentIndex + 1));
  thumbnailBar?.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') {
      const idx = parseInt(e.target.dataset.index, 10);
      updateMainPhoto(idx);
    }
  });

  updateMainPhoto(0);
}

