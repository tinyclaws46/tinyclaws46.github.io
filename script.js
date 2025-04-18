document.addEventListener('DOMContentLoaded', function() {
  // Smooth scrolling on navigation click
  document.querySelectorAll('nav a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
              window.scrollTo({
                  top: targetElement.offsetTop - 20,
                  behavior: 'smooth'
              });
              history.pushState(null, null, targetId);
          }
      });
  });

  // Modal functionality
  const images = document.querySelectorAll('#birthplace img, #thats-me img');
  
  // Create modal only after images are loaded
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.style.cssText = `
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.9);
    display: none;
    justify-content: center;
    align-items: center;
  `;

  const modalImg = document.createElement('img');
  modalImg.className = 'modal-content';
  modalImg.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    box-shadow: 0 0 20px rgba(255,255,255,0.3);
  `;

  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  closeBtn.className = 'close-modal';
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 35px;
    color: #f1f1f1;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
  `;

  modal.appendChild(modalImg);
  modal.appendChild(closeBtn);
  document.body.appendChild(modal);

  // Show modal with clicked image
  images.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function() {
          modalImg.src = this.src;
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden'; // Disable scrolling
      });
  });
  
  // Close modal functionality
  const closeModal = () => {
    modal.style.display = 'none';
    modalImg.src = ''; // Clear the image source
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  closeBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside of the image
  modal.addEventListener('click', function(e) {
      if (e.target === modal) {
          closeModal();
      }
  });

  // Scroll highlight for active section in navigation
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('nav a');
  
  window.addEventListener('scroll', function() {
      let current = '';
      
      sections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.clientHeight;
          
          if (pageYOffset >= sectionTop - 60) {
              current = section.getAttribute('id');
          }
      });
      
      navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href').substring(1) === current) {
              link.classList.add('active');
          }
      });
  });

  // Add custom styles for active navigation link
  const style = document.createElement('style');
  style.textContent = `
      nav a.active {
          color: red !important;
          text-decoration: underline !important;
          font-weight: bold;
      }
  `;
  document.head.appendChild(style);
});
