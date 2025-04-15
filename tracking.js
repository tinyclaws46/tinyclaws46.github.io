document.addEventListener('DOMContentLoaded', function() {
    console.log(`${getTimestamp()}, view, page_load`);
    initializeTracking();
});

function initializeTracking() {
    document.addEventListener('click', function(event) {
        const target = event.target;
        let elementType = getElementType(target);
        console.log(`${getTimestamp()}, click, ${elementType}`);
    });

    setupViewTracking();
    trackNavigation();
    trackSpecificElements();
}

function getElementType(element) {
    if (element.tagName === 'A') {
        if (element.href.endsWith('.pdf')) return `cv_download: ${element.textContent.trim()}`;
        return `link: ${element.textContent.trim() || element.href}`;
    }
    if (element.tagName === 'IMG') {
        const imgAlt = element.alt || 'unnamed image';
        const imgSrc = element.src.split('/').pop();
        return `image: ${imgAlt} (${imgSrc})`;
    }
    if (element.tagName === 'BUTTON') return `button: ${element.textContent.trim()}`;
    if (element.tagName === 'LI') return `list_item: ${element.textContent.trim().substring(0, 30)}...`;
    if (element.tagName === 'H1' || element.tagName === 'H2' || element.tagName === 'H3') {
        return `heading: ${element.textContent.trim()}`;
    }
    if (element.tagName === 'P') return `text: ${element.textContent.trim().substring(0, 30)}...`;
    
    if (element.closest('header')) return `header_element: ${element.tagName}`;
    if (element.closest('footer')) return `footer_element: ${element.tagName}`;
    if (element.closest('nav')) return `navigation_element: ${element.tagName}`;
    
    if (element.closest('section')) {
        const section = element.closest('section');
        const sectionId = section.id || 'unnamed section';
        return `section_element: ${sectionId} - ${element.tagName}`;
    }

    return `${element.tagName.toLowerCase()}: ${element.className || 'no-class'}`;
}

function setupViewTracking() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const elementType = getElementType(entry.target);
                    console.log(`${getTimestamp()}, view, ${elementType}`);
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.5});
        
        const elementsToTrack = document.querySelectorAll('img, section, .profile-img');
        elementsToTrack.forEach(element => {
            observer.observe(element);
        });
    } else {
        console.log(`${getTimestamp()}, view, fallback_view_tracking_enabled`);
        
        window.addEventListener('scroll', debounce(function() {
            document.querySelectorAll('section').forEach(section => {
                if (isElementInViewport(section)) {
                    console.log(`${getTimestamp()}, view, section: ${section.id || 'unnamed'}`);
                }
            });
        }, 300));
    }
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

function trackNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('href').substring(1);
            console.log(`${getTimestamp()}, click, navigation: link to ${sectionId} section`);
        });
    });
}

function trackSpecificElements() {
    const resumeLink = document.querySelector('a[href="resume.pdf"]');
    if (resumeLink) {
        resumeLink.addEventListener('click', function() {
            console.log(`${getTimestamp()}, click, cv_download: resume.pdf`);
        });
    }
    
    const birthplaceImages = document.querySelectorAll('#birthplace img');
    birthplaceImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            console.log(`${getTimestamp()}, click, birthplace_image: ${img.alt || 'image-' + (index+1)}`);
        });
    });
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString();
}

window.addEventListener('beforeunload', function() {
    console.log(`${getTimestamp()}, view, page_exit`);
});

document.addEventListener('change', function(event) {
    if (event.target.tagName === 'SELECT') {
        console.log(`${getTimestamp()}, click, drop-down: ${event.target.name || event.target.id || 'unnamed'} (selected: ${event.target.value})`);
    }
});
