document.addEventListener('DOMContentLoaded', function() {

  /* =========================================================
     PRELOADER
     ========================================================= */
  var preloader = document.getElementById('preloader');
  var preloaderFill = document.getElementById('preloaderFill');
  var preloaderText = document.getElementById('preloaderText');

  if (sessionStorage.getItem('visited')) {
    if (preloader) preloader.classList.add('done');
  } else {
    var progress = 0;
    var interval = setInterval(function() {
      progress += Math.floor(Math.random() * 25) + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        if (preloaderFill) preloaderFill.style.width = '100%';
        if (preloaderText) preloaderText.textContent = 'SYSTEM READY';
        setTimeout(function() {
          if (preloader) preloader.classList.add('done');
          sessionStorage.setItem('visited', 'true');
        }, 300);
      } else {
        if (preloaderFill) preloaderFill.style.width = progress + '%';
      }
    }, 80);
  }

  /* =========================================================
     BACKGROUND CANVAS (NEURAL NETWORK / PARTICLES)
     ========================================================= */
  var canvas = document.getElementById('bgCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var width = canvas.width = window.innerWidth;
    var height = canvas.height = window.innerHeight;

    window.addEventListener('resize', function() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    var numParticles = Math.min(Math.floor(width / 22), 65);
    var particles = [];
    var mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', function(e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (var i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8
      });
    }

    function animateCanvas() {
      ctx.clearRect(0, 0, width, height);

      for (var a = 0; a < particles.length; a++) {
        var p = particles[a];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(41, 151, 255, 0.45)';
        ctx.fill();

        for (var b = a + 1; b < particles.length; b++) {
          var p2 = particles[b];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = 'rgba(41, 151, 255, ' + (0.16 - dist / 130 * 0.16) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouse.x && mouse.y) {
          var mdx = p.x - mouse.x;
          var mdy = p.y - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(109, 93, 246, ' + (0.25 - mdist / mouse.radius * 0.25) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateCanvas);
    }
    animateCanvas();
  }

  /* =========================================================
     HEADER & SCROLL ACTIVE LINKS
     ========================================================= */
  var header = document.getElementById('header');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function() {
    if (window.scrollY > 40) {
      if (header) header.classList.add('scrolled');
    } else {
      if (header) header.classList.remove('scrolled');
    }

    var top = window.scrollY + 200;
    sections.forEach(function(sec) {
      var sTop = sec.offsetTop;
      var sHeight = sec.offsetHeight;
      var id = sec.getAttribute('id');
      if (top >= sTop && top < sTop + sHeight) {
        navLinks.forEach(function(l) {
          l.classList.remove('active');
          if (l.getAttribute('href') === '#' + id) {
            l.classList.add('active');
          }
        });
      }
    });
  });

  /* =========================================================
     CUSTOM CURSOR (DESKTOP)
     ========================================================= */
  var dot = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    var mx = 0, my = 0, rx = 0, ry = 0;

    window.addEventListener('mousemove', function(e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px, ' + my + 'px)';
    });

    function ringLoop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = 'translate(' + rx + 'px, ' + ry + 'px)';
      requestAnimationFrame(ringLoop);
    }
    ringLoop();

    var hoverables = document.querySelectorAll('a, button, .project-card, .tech-card, .cert-card, input, textarea');
    hoverables.forEach(function(el) {
      el.addEventListener('mouseenter', function() { ring.classList.add('active'); });
      el.addEventListener('mouseleave', function() { ring.classList.remove('active'); });
    });
  }

  /* =========================================================
     AUDIO PLAYBACK (AUTOMATIC TURN ON & LOOP MODE)
     ========================================================= */
  var audioToggle = document.getElementById('audioToggle');
  var bgAudio = document.getElementById('bgAudio');

  if (bgAudio) {
    bgAudio.loop = true;

    function playAudio() {
      bgAudio.play().then(function() {
        if (audioToggle) {
          audioToggle.classList.add('playing');
          var iconOff = audioToggle.querySelector('.icon-sound-off');
          var iconOn = audioToggle.querySelector('.icon-sound-on');
          var audioLabel = audioToggle.querySelector('.audio-label');
          if (iconOff) iconOff.style.display = 'none';
          if (iconOn) iconOn.style.display = 'inline';
          if (audioLabel) audioLabel.textContent = 'Audio On';
        }
      }).catch(function(err) {
        console.log('Autoplay waiting for first interaction:', err);
      });
    }

    // Try automatic play immediately
    playAudio();

    // Interaction fallback for browsers blocking unmuted autoplay
    function enableAudioOnInteraction() {
      if (bgAudio.paused) {
        playAudio();
      }
      window.removeEventListener('click', enableAudioOnInteraction);
      window.removeEventListener('scroll', enableAudioOnInteraction);
      window.removeEventListener('keydown', enableAudioOnInteraction);
      window.removeEventListener('touchstart', enableAudioOnInteraction);
    }

    window.addEventListener('click', enableAudioOnInteraction);
    window.addEventListener('scroll', enableAudioOnInteraction);
    window.addEventListener('keydown', enableAudioOnInteraction);
    window.addEventListener('touchstart', enableAudioOnInteraction);

    if (audioToggle) {
      audioToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (bgAudio.paused) {
          playAudio();
        } else {
          bgAudio.pause();
          audioToggle.classList.remove('playing');
          var iconOff = audioToggle.querySelector('.icon-sound-off');
          var iconOn = audioToggle.querySelector('.icon-sound-on');
          var audioLabel = audioToggle.querySelector('.audio-label');
          if (iconOff) iconOff.style.display = 'inline';
          if (iconOn) iconOn.style.display = 'none';
          if (audioLabel) audioLabel.textContent = 'Muted';
        }
      });
    }
  }

  /* =========================================================
     PORTRAIT CARD CURSOR SPOTLIGHT, SCROLL PARALLAX & FADE IN/OUT LOGIC
     ========================================================= */
  var portraitCard = document.getElementById('portraitCard');
  var portraitImg = document.getElementById('portraitImg');

  if (portraitCard) {
    portraitCard.addEventListener('mousemove', function(e) {
      var rect = portraitCard.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      portraitCard.style.setProperty('--mouse-x', x + '%');
      portraitCard.style.setProperty('--mouse-y', y + '%');
    });

    portraitCard.addEventListener('mouseleave', function() {
      portraitCard.style.setProperty('--mouse-x', '50%');
      portraitCard.style.setProperty('--mouse-y', '35%');
    });
  }

  // Scroll Parallax & IntersectionObserver Fade In / Fade Out
  var fadeElements = document.querySelectorAll('.scroll-parallax-img, .fade-in-out');
  if ('IntersectionObserver' in window) {
    var scrollObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        } else {
          entry.target.classList.remove('in-view');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(function(el) {
      scrollObserver.observe(el);
    });
  }

  // Parallax Shift on Scroll
  window.addEventListener('scroll', function() {
    if (portraitCard && portraitImg) {
      var rect = portraitCard.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        var progress = (vh - rect.top) / (vh + rect.height);
        var translateY = (progress - 0.5) * -24;
        if (!portraitCard.matches(':hover')) {
          portraitImg.style.transform = 'translateY(' + translateY.toFixed(2) + 'px)';
        }
      }
    }
  });

  /* =========================================================
     PROJECT CARD SPOTLIGHT & MODAL
     ========================================================= */
  document.querySelectorAll('.project-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  var projectsData = [
    {
      title: "SkillForge",
      subtitle: "Top 15 Finalist — InnovateX All-India AI Hackathon (13th out of 317 teams)",
      desc: "AI-powered teammate recommendation and compatibility prediction platform for hackathon participants. Utilizes scikit-learn models for skill matching, personality compatibility prediction, and automated team optimization.",
      tech: ["Python", "Flask", "React", "Scikit-learn", "SQLite"],
      achv: "Ranked 13th out of 317 teams nationwide at InnovateX All-India AI Hackathon.",
      demo: "https://skillforge-seven-psi.vercel.app/",
      github: "https://github.com/Guru-CodesAI"
    },
    {
      title: "GitFolio AI",
      subtitle: "AI-powered GitHub Portfolio Analyzer",
      desc: "Evaluates public GitHub repositories, scoring code quality, commit consistency, and project structure while generating actionable developer performance insights.",
      tech: ["Repository Analytics", "AI Scoring", "Insights", "React", "Node.js"],
      demo: "https://githubportfolio-ai.vercel.app/"
    },
    {
      title: "APEX F1",
      subtitle: "Cinematic Formula 1 Content Experience",
      desc: "A high-performance, immersive content platform featuring cinematic storytelling, sleek animations, and responsive web design tailored for F1 enthusiasts.",
      tech: ["Advanced UI", "Cinematic Experience", "Responsive Design", "GSAP"],
      demo: "https://apex-f1-tan.vercel.app/"
    },
    {
      title: "GHOST-COD",
      subtitle: "Fan-made Web Experience (Simon 'Ghost' Riley)",
      desc: "A cinematic, interactive web experience inspired by Simon 'Ghost' Riley. Built with Next.js, Three.js, GSAP, and Tailwind CSS. Not affiliated with Call of Duty or Activision.",
      tech: ["Next.js", "Three.js", "GSAP", "Tailwind CSS"],
      demo: "https://ghost-cod.vercel.app/",
      github: "https://github.com/Guru-CodesAI/GHOST-COD"
    },
    {
      title: "YUVA Expense Tracker",
      subtitle: "Voice-First Tamil Financial Management App",
      desc: "A specialized financial management application designed with simplicity and accessibility in mind. Features a voice-first Tamil experience allowing users to record daily expenses naturally by speaking — making tracking simpler for elderly users.",
      tech: ["Voice-first", "Tamil Language", "Accessibility", "Android APK"],
      demo: "https://github.com/Guru-CodesAI/Yuva-Expense-Tracker/releases/download/v1.0.0/app-release.apk",
      github: "https://github.com/Guru-CodesAI/Yuva-Expense-Tracker"
    }
  ];

  var modal = document.getElementById('projectModal');
  var modalBody = document.getElementById('modalBody');
  var modalBackdrop = document.getElementById('modalBackdrop');
  var modalClose = document.getElementById('modalClose');

  window.openProjectModal = function(index) {
    var p = projectsData[index];
    if (!p || !modal || !modalBody) return;
    
    var html = '<h3>' + p.title + '</h3>';
    if (p.subtitle) html += '<p style="color:var(--primary);font-weight:600;margin-top:-6px;">' + p.subtitle + '</p>';
    html += '<p>' + p.desc + '</p>';
    if (p.achv) html += '<div class="project-achv" style="margin-bottom:20px;">★ ' + p.achv + '</div>';
    
    html += '<div class="modal-tech">';
    p.tech.forEach(function(t) {
      html += '<span class="chip">' + t + '</span>';
    });
    html += '</div>';

    html += '<div class="modal-actions">';
    if (p.demo) {
      var isApk = p.demo.indexOf('.apk') !== -1;
      html += '<a class="btn btn-primary" href="' + p.demo + '" target="_blank" rel="noopener">' + (isApk ? 'Download APK ↗' : 'Live Demo ↗') + '</a>';
    }
    if (p.github) {
      html += '<a class="btn btn-ghost" href="' + p.github + '" target="_blank" rel="noopener">GitHub ↗</a>';
    }
    html += '</div>';

    modalBody.innerHTML = html;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeProjectModal = function() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);
  if (modalClose) modalClose.addEventListener('click', closeProjectModal);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  document.querySelectorAll('.project-card').forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.project-links')) return;
      var idx = parseInt(card.getAttribute('data-project'), 10);
      if (!isNaN(idx)) openProjectModal(idx);
    });
  });

  /* =========================================================
     CERTIFICATIONS — SEARCH & FILTER
     ========================================================= */
  var certGrid = document.getElementById('certGrid');
  var certCards = certGrid ? certGrid.querySelectorAll('.cert-card') : [];
  var certSearch = document.getElementById('certSearch');
  var filterBtns = document.querySelectorAll('.filter-btn');
  var activeFilter = 'all';

  function applyCertFilter() {
    var q = (certSearch ? certSearch.value : '').trim().toLowerCase();
    certCards.forEach(function(card) {
      var cat = card.getAttribute('data-cat');
      var text = card.textContent.toLowerCase();
      var matchesCat = activeFilter === 'all' || cat === activeFilter;
      var matchesQuery = !q || text.indexOf(q) !== -1;
      card.classList.toggle('hide', !(matchesCat && matchesQuery));
    });
  }

  if (certSearch) certSearch.addEventListener('input', applyCertFilter);
  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      applyCertFilter();
    });
  });

  /* =========================================================
     JOURNEY — ACCORDION
     ========================================================= */
  document.querySelectorAll('.timeline-item').forEach(function(item) {
    var btn = item.querySelector('.timeline-btn');
    if (btn) {
      btn.addEventListener('click', function() {
        var wasOpen = item.classList.contains('open');
        document.querySelectorAll('.timeline-item.open').forEach(function(i) { i.classList.remove('open'); });
        if (!wasOpen) item.classList.add('open');
      });
    }
  });

  /* =========================================================
     COPY EMAIL & CONTACT FORM
     ========================================================= */
  var copyBtn = document.getElementById('copyEmailBtn');
  var copyLabel = document.getElementById('copyEmailLabel');
  if (copyBtn) {
    copyBtn.addEventListener('click', function() {
      var email = 'vengaigurunathan2@gmail.com';
      function done() {
        if (copyLabel) copyLabel.textContent = 'Copied to clipboard ✓';
        setTimeout(function() {
          if (copyLabel) copyLabel.textContent = 'Copy Email Address';
        }, 2500);
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(done);
      } else {
        done();
      }
    });
  }

  var contactForm = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');
  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', function() {
      formSuccess.style.display = 'block';
    });
  }

  /* =========================================================
     3D TILT ENGINE & CURSOR PARALLAX
     ========================================================= */
  var tiltCards = document.querySelectorAll('[data-tilt-3d]');
  tiltCards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -12;
      var rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.02, 1.02, 1.02)';
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });

    card.addEventListener('mouseleave', function() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
});

