const bootScreen = document.getElementById('bootScreen');
const bootProgress = document.getElementById('bootProgress');
const bootPercent = document.getElementById('bootPercent');

if (bootScreen && bootProgress && bootPercent) {
  window.addEventListener('load', () => {
    const progressBar = bootProgress.querySelector('span');
    const startTime = performance.now();
    const duration = 1800;

    const updateProgress = (currentTime) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const percentage = Math.round(progress * 100);

      progressBar.style.width = `${percentage}%`;
      bootProgress.style.setProperty('--boot-progress', percentage);
      bootPercent.textContent = `${percentage}%`;

      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => bootScreen.classList.add('is-hidden'), 250);
      }
    };

    requestAnimationFrame(updateProgress);
  });
}

// Photo frame interaction effects
const photoFrame = document.querySelector('.photo-frame');
const profilePhoto = document.querySelector('.profile-img');

if (photoFrame) {
  photoFrame.addEventListener('mousemove', (e) => {
    const rect = photoFrame.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const angleX = (mouseY - centerY) / 10;
    const angleY = (mouseX - centerX) / 10;
    
    profilePhoto.style.transform = `rotateY(${angleY}deg) rotateX(${angleX}deg)`;
  });

  photoFrame.addEventListener('mouseleave', () => {
    profilePhoto.style.transform = 'rotateY(0deg) rotateX(5deg)';
  });
}

// Observe education cards and resume card to add entrance animation class
const eduCards = document.querySelectorAll('.edu-card');
const resumeCard = document.querySelector('.resume-card');

const enterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('enter');
      enterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

eduCards.forEach(card => enterObserver.observe(card));
if (resumeCard) enterObserver.observe(resumeCard);

// Observe resume list items so each resume box animates on enter (staggered)
const resumeItems = document.querySelectorAll('.resume-item');
resumeItems.forEach((item, idx) => {
  item.style.setProperty('--i', idx);
  enterObserver.observe(item);
});

// Update resume download link to point to user's provided file if available
const resumeDownload = document.getElementById('resumeDownload');
if (resumeDownload) {
  // Use a relative path if the file exists in the project
  // The user provided: c:\Users\DIPAK\Downloads\Resume.pdf
  // We'll map it to `/Resume.pdf` in the site root if the user places it there.
  // Set default href to `/Resume.pdf` so downloading uses that file when present.
  resumeDownload.setAttribute('href', '/Resume.pdf');
}

// Form handling - Works locally and in production
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  // Check if running locally
  const isLocal = window.location.protocol === 'file:';
  
  contactForm.addEventListener('submit', function(e) {
    if (isLocal) {
      // For local development - prevent default and show success
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Get form data
      const formData = new FormData(this);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');
      
      // Validate
      if (!name || !email || !message) {
        formMessage.textContent = '✗ Please fill out all fields';
        formMessage.style.color = '#f87171';
        return;
      }
      
      if (!email.includes('@')) {
        formMessage.textContent = '✗ Please enter a valid email';
        formMessage.style.color = '#f87171';
        return;
      }
      
      // Show sending state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formMessage.textContent = 'Sending your message...';
      formMessage.style.color = '#60a5fa';
      
      // Simulate sending delay
      setTimeout(() => {
        formMessage.textContent = '✓ Thanks! Message received. (Note: Running locally - deploy to send real emails)';
        formMessage.style.color = '#34d399';
        this.reset();
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Clear message after 5 seconds
        setTimeout(() => {
          formMessage.textContent = '';
        }, 5000);
      }, 1000);
    } else {
      // For production - let FormSubmit.co handle it
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      formMessage.textContent = 'Sending your message...';
      formMessage.style.color = '#60a5fa';
    }
  });
}



// Mouse tracking glow effect
document.addEventListener('mousemove', (event) => {
  const mouseX = (event.clientX / window.innerWidth) * 100;
  const mouseY = (event.clientY / window.innerHeight) * 100;
  
  document.body.style.setProperty('--mouse-x', mouseX + '%');
  document.body.style.setProperty('--mouse-y', mouseY + '%');
  
  if (!document.body.classList.contains('mouse-active')) {
    document.body.classList.add('mouse-active');
  }
});

// Project, certification, education and resume card mouse tracking (radial glow)
const interactiveCards = document.querySelectorAll('.project-card, .cert-card, .edu-card, .resume-card, .resume-item');
interactiveCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty('--card-x', x + '%');
    card.style.setProperty('--card-y', y + '%');
  });

  // clear on mouseleave to avoid stale positions
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--card-x', '50%');
    card.style.setProperty('--card-y', '50%');
  });
});

// Scroll reveal animations
const revealElements = document.querySelectorAll('.reveal');
const navLinks = document.querySelectorAll('.nav a');

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${index * 0.12}s`;
  revealObserver.observe(element);
});

// Active navigation highlighting
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const sectionId = entry.target.id;
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    });
  },
  { threshold: 0.55 }
);

document.querySelectorAll('section[id]').forEach((section) => {
  sectionObserver.observe(section);
});

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-theme');
    themeToggle.textContent = document.documentElement.classList.contains('light-theme') ? '🌙' : '🌞';
  });
}

const menuToggle = document.getElementById('menuToggle');
const navigation = document.querySelector('.nav');
const navigationLinks = document.querySelectorAll('.nav a');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navigationLinks.forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
    });
  });
}

const topbar = document.querySelector('.topbar');
if (topbar) {
  const updateTopbar = () => {
    topbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  updateTopbar();
  window.addEventListener('scroll', updateTopbar, { passive: true });
}

// Stat counter animations
const statsCard = document.querySelector('.stats-card');
if (statsCard) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsCard.dataset.counted) {
        statsCard.dataset.counted = 'true';
        const strongElements = statsCard.querySelectorAll('strong');
        strongElements.forEach((el) => {
          const text = el.textContent.replace(/\D/g, '');
          const target = parseInt(text, 10);
          if (!isNaN(target)) {
            animateCounter(el, target);
          }
        });
      }
    });
  }, { threshold: 0.3 });
  
  statsObserver.observe(statsCard);
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 30;
  
  const counter = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(counter);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 20);
}

// Back-to-top button: show on scroll and scroll to navbar
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  const topbar = document.querySelector('.topbar');
  const threshold = 300;

  function updateBackToTop() {
    if (window.scrollY > threshold) {
      backToTop.classList.add('show');
      backToTop.setAttribute('aria-hidden', 'false');
    } else {
      backToTop.classList.remove('show');
      backToTop.setAttribute('aria-hidden', 'true');
    }
  }

  window.addEventListener('scroll', updateBackToTop, { passive: true });
  // initial state
  updateBackToTop();

  backToTop.addEventListener('click', () => {
    const home = document.getElementById('home');
    if (home) {
      home.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (topbar) {
      topbar.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  backToTop.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      backToTop.click();
    }
  });
}

