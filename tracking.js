document.addEventListener('DOMContentLoaded', function() {
    logEvent('view', 'page_load');
    setupEventTracking();
});

function setupEventTracking() {
    document.addEventListener('click', function(event) {
        const element = event.target;
        const eventObject = identifyEventObject(element);
        logEvent('click', eventObject);
    });
    trackSectionViews();
    trackElementViews();
    trackCVLink();
}

function identifyEventObject(element) {
    if (element.tagName === 'IMG') {
        if (element.closest('#That\\'s\\ me')) {
            return `image: profile picture`;
        } else if (element.closest('#birthplace')) {
            return `image: birthplace (${element.alt})`;
        }
        return `image: ${element.alt || 'unnamed'}`;
    }
    if (element.tagName === 'A') {
        if (element.href.includes('resume.pdf')) {
            return `hyperlink: CV/Resume download`;
        }
        if (element.closest('nav')) {
            return `navigation: ${element.textContent.trim()}`;
        }
        return `hyperlink: ${element.textContent.trim()}`;
    }
    if (element.tagName === 'P') {
        if (element.closest('#about')) {
            return `text: about paragraph`;
        }
        return `text: ${element.textContent.substring(0, 20)}...`;
    }
    if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
        return `heading: ${element.textContent.trim()}`;
    }
    if (element.tagName === 'LI') {
        if (element.closest('#education')) {
            return `text: education info`;
        } else if (element.closest('#skills')) {
            return `text: skill item`;
        }
        return `list item: ${element.textContent.substring(0, 20)}...`;
    }
    const section = element.closest('section');
    if (section) {
        return `${element.tagName.toLowerCase()}: in ${section.id || 'unnamed'} section`;
    }
    return `${element.tagName.toLowerCase()}: ${element.className || 'unnamed'}`;
}

function trackSectionViews() {
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    let sectionType = '';
                    switch(section.id) {
                        case 'about':
                            sectionType = 'about paragraph section';
                            break;
                        case 'That\'s me':
                            sectionType = 'profile picture section';
                            break;
                        case 'birthplace':
                            sectionType = 'birthplace images section';
                            break;
                        case 'education':
                            sectionType = 'education background section';
                            break;
                        case 'skills':
                            sectionType = 'technical skills section';
                            break;
                        case 'cv':
                            sectionType = 'CV/Resume section';
                            break;
                        default:
                            sectionType = `${section.id || 'unnamed'} section`;
                    }
                    logEvent('view', sectionType);
                    sectionObserver.unobserve(section);
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll('section').forEach(section => {
            sectionObserver.observe(section);
        });
    }
}

function trackElementViews() {
    if ('IntersectionObserver' in window) {
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    if (element.tagName === 'IMG') {
                        if (element.closest('#That\\'s\\ me')) {
                            logEvent('view', 'image: profile picture');
                        } else if (element.closest('#birthplace')) {
                            logEvent('view', `image: birthplace (${element.alt})`);
                        }
                    }
                    if (element.closest('#about') && element.tagName === 'P') {
                        logEvent('view', 'text: about paragraph');
                    }
                    elementObserver.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('#That\\'s\\ me img, #birthplace img, #about p').forEach(element => {
            elementObserver.observe(element);
        });
    }
}

function trackCVLink() {
    const cvLink = document.querySelector('a[href="resume.pdf"]');
    if (cvLink) {
        cvLink.addEventListener('click', function() {
            logEvent('click', 'hyperlink: CV/Resume download');
        });
    }
}

function logEvent(eventType, eventObject) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}, ${eventType}, ${eventObject}`);
}

window.addEventListener('beforeunload', function() {
    logEvent('view', 'page_exit');
});
