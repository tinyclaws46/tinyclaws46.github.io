document.addEventListener('DOMContentLoaded', function () {
    logEvent('view', 'page_load');
    setupEventTracking();
  });
  
  function setupEventTracking() {
    document.addEventListener('click', function (event) {
      const element = event.target;
      const eventObject = identifyEventObject(element);
      logEvent('click', eventObject);
    });
  
    observeSections();
    observeElements();
    observeCVLink();
  }
  
  function identifyEventObject(element) {
    if (element.tagName === 'IMG') {
      if (element.closest('#That\\\'s\\ me')) {
        return 'image: profile picture';
      } else if (element.closest('#birthplace')) {
        return `image: birthplace (${element.alt})`;
      }
      return `image: ${element.alt || 'unnamed'}`;
    }
  
    if (element.tagName === 'A') {
      if (element.href.includes('resume.pdf')) {
        return 'hyperlink: CV/Resume download';
      }
      if (element.closest('nav')) {
        return `navigation: ${element.textContent.trim()}`;
      }
      return `hyperlink: ${element.textContent.trim()}`;
    }
  
    if (element.tagName === 'P') {
      if (element.closest('#about')) {
        return 'text: about yourself';
      }
      if (element.closest('#cv')) {
        return 'text: CV section description';
      }
      return `text: ${element.textContent.slice(0, 25)}...`;
    }
  
    if (element.tagName === 'LI') {
      if (element.closest('#education')) {
        return 'list: education detail';
      }
      if (element.closest('#skills')) {
        return 'list: technical skill';
      }
      return 'list item';
    }
  
    if (['H1', 'H2', 'H3'].includes(element.tagName)) {
      return `heading: ${element.textContent.trim()}`;
    }
  
    return `${element.tagName.toLowerCase()}: general element`;
  }
  
  function observeSections() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            let sectionName = '';
  
            switch (id) {
              case 'about':
                sectionName = 'about yourself section';
                break;
              case 'That\'s me':
                sectionName = 'profile picture section';
                break;
              case 'birthplace':
                sectionName = 'birthplace images section';
                break;
              case 'education':
                sectionName = 'education background section';
                break;
              case 'skills':
                sectionName = 'technical skills section';
                break;
              case 'cv':
                sectionName = 'CV download section';
                break;
              default:
                sectionName = `${id} section`;
            }
  
            logEvent('view', sectionName);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
  
      document.querySelectorAll('section').forEach(section => observer.observe(section));
    }
  }
  
  function observeElements() {
    if ('IntersectionObserver' in window) {
      const elementObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
  
            if (el.tagName === 'IMG') {
              if (el.closest('#That\\\'s\\ me')) {
                logEvent('view', 'image: profile picture');
              } else if (el.closest('#birthplace')) {
                logEvent('view', `image: birthplace (${el.alt})`);
              }
            }
  
            if (el.tagName === 'P' && el.closest('#about')) {
              logEvent('view', 'text: about yourself');
            }
  
            elementObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
  
      document.querySelectorAll('#That\\\'s\\ me img, #birthplace img, #about p').forEach(el => elementObserver.observe(el));
    }
  }
  
  function observeCVLink() {
    const link = document.querySelector('a[href="resume.pdf"]');
    if (link) {
      link.addEventListener('click', () => {
        logEvent('click', 'hyperlink: CV/Resume download');
      });
    }
  }
  
  function logEvent(eventType, eventObject) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, ${eventType}, ${eventObject}`);
  }
  
  window.addEventListener('beforeunload', function () {
    logEvent('view', 'page_exit');
  });
  