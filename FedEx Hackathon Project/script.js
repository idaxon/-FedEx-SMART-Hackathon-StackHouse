// Function to navigate to home page
function goHome() {
    window.location.href = 'index.html';
  }
  
  // Function to scroll to Book Now section
  function goToBookNow() {
    document.getElementById("book-now").scrollIntoView({ behavior: 'smooth' });
  }
  
  // Function to scroll to Your Bookings section
  function goToBookings() {
    document.getElementById("your-bookings").scrollIntoView({ behavior: 'smooth' });
  }
  
  // Function to scroll to About Us section
  function goToAboutUs() {
    document.getElementById("about-us").scrollIntoView({ behavior: 'smooth' });
  }
  
  // Function to scroll to Profile section
  function goToProfile() {
    document.getElementById("profile").scrollIntoView({ behavior: 'smooth' });
  }
  
  // Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Detect scrolling and add fade-up animation dynamically
  window.addEventListener('scroll', () => {
    const elements = document.querySelectorAll('.fade-up');
    elements.forEach(element => {
      const position = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (position < windowHeight - 100) {
        element.classList.add('fade-up-active');
      }
    });
  });

  // script.js
document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.getElementById("navbar");
  
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  });
  
  