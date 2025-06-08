// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functionality
  initNavigation();
  initSkillBars();
  initContactForm();
  initScrollEffects();
  initMobileMenu();
  initBackToTop();
});

// Navigation functionality
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  // Handle navbar scroll effect
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // Handle active link highlighting
  window.addEventListener("scroll", function () {
    let current = "";
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Toggle mobile menu
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// Skill bars animation
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  // Intersection Observer for skill bars animation
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const width = progressBar.getAttribute("data-width");

          // Animate the progress bar
          setTimeout(() => {
            progressBar.style.width = width + "%";
          }, 200);

          skillObserver.unobserve(progressBar);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  skillBars.forEach((bar) => {
    skillObserver.observe(bar);
  });
}

// Contact form functionality
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  // Form validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const namePattern = /^[a-zA-Z\s]{2,50}$/;

  // Real-time validation
  nameInput.addEventListener("blur", () =>
    validateField(
      nameInput,
      namePattern,
      "Please enter a valid name (2-50 characters, letters only)"
    )
  );
  emailInput.addEventListener("blur", () =>
    validateField(
      emailInput,
      emailPattern,
      "Please enter a valid email address"
    )
  );
  messageInput.addEventListener("blur", () => validateMessage());

  // Clear errors on focus
  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("focus", () => clearError(input));
  });

  // Form submission
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(
      nameInput,
      namePattern,
      "Please enter a valid name (2-50 characters, letters only)"
    );
    const isEmailValid = validateField(
      emailInput,
      emailPattern,
      "Please enter a valid email address"
    );
    const isMessageValid = validateMessage();

    if (isNameValid && isEmailValid && isMessageValid) {
      // Simulate form submission
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;

      // Show loading state
      submitButton.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitButton.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Show success message
        showNotification(
          "Message sent successfully! I'll get back to you soon.",
          "success"
        );

        // Reset form
        contactForm.reset();

        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }, 2000);
    }
  });

  function validateField(input, pattern, errorMessage) {
    const value = input.value.trim();
    const errorElement = document.getElementById(input.id + "-error");

    if (!value) {
      showError(input, errorElement, "This field is required");
      return false;
    } else if (!pattern.test(value)) {
      showError(input, errorElement, errorMessage);
      return false;
    } else {
      clearError(input);
      return true;
    }
  }

  function validateMessage() {
    const value = messageInput.value.trim();
    const errorElement = document.getElementById("message-error");

    if (!value) {
      showError(messageInput, errorElement, "Please enter a message");
      return false;
    } else if (value.length < 10) {
      showError(
        messageInput,
        errorElement,
        "Message must be at least 10 characters long"
      );
      return false;
    } else if (value.length > 1000) {
      showError(
        messageInput,
        errorElement,
        "Message must be less than 1000 characters"
      );
      return false;
    } else {
      clearError(messageInput);
      return true;
    }
  }

  function showError(input, errorElement, message) {
    input.classList.add("error");
    errorElement.textContent = message;
  }

  function clearError(input) {
    input.classList.remove("error");
    const errorElement = document.getElementById(input.id + "-error");
    errorElement.textContent = "";
  }
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${
              type === "success" ? "fa-check-circle" : "fa-info-circle"
            }"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  }, 5000);

  // Close button functionality
  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => notification.remove(), 300);
  });
}

// Scroll effects
function initScrollEffects() {
  // Fade in animation for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe sections for fade-in effect
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  // Parallax effect for hero section
  const hero = document.querySelector(".hero");
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    hero.style.transform = `translateY(${parallax}px)`;
  });
}

// Back to top button
function initBackToTop() {
  const backToTopButton = document.getElementById("back-to-top");

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  // Smooth scroll to top
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Portfolio item hover effects
document.addEventListener("DOMContentLoaded", function () {
  const portfolioItems = document.querySelectorAll(".portfolio-item");

  portfolioItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});

// Typing animation for hero subtitle
function initTypingAnimation() {
  const subtitle = document.querySelector(".hero-subtitle");
  const text = subtitle.textContent;
  subtitle.textContent = "";

  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  };

  // Start typing animation after a delay
  setTimeout(typeWriter, 1000);
}

// Initialize typing animation when page loads
window.addEventListener("load", initTypingAnimation);

// Smooth reveal animations for portfolio and skills
function initRevealAnimations() {
  const revealElements = document.querySelectorAll(
    ".portfolio-item, .skill-category, .stat"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  revealElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    revealObserver.observe(element);
  });
}

// Initialize reveal animations
document.addEventListener("DOMContentLoaded", initRevealAnimations);

// Handle window resize for responsive adjustments
window.addEventListener(
  "resize",
  debounce(() => {
    // Recalculate navbar height for smooth scrolling
    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar.offsetHeight;

    // Update CSS custom property if needed
    document.documentElement.style.setProperty(
      "--navbar-height",
      navbarHeight + "px"
    );
  }, 250)
);

// Error handling for external resources
window.addEventListener("error", function (e) {
  console.warn("Resource loading error:", e);
  // Fallback for missing external resources
  if (e.target.tagName === "LINK" && e.target.href.includes("googleapis")) {
    // Fallback for Google Fonts
    document.body.style.fontFamily = "Arial, sans-serif";
  }
});

// Accessibility improvements
document.addEventListener("keydown", function (e) {
  // Handle escape key to close mobile menu
  if (e.key === "Escape") {
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");

    if (navMenu.classList.contains("active")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  }

  // Handle tab navigation for accessibility
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation");
  }
});

// Remove keyboard navigation class on mouse use
document.addEventListener("mousedown", function () {
  document.body.classList.remove("keyboard-navigation");
});

// Performance optimization: Lazy load non-critical animations
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!reducedMotion.matches) {
  // Only initialize animations if user hasn't requested reduced motion
  initRevealAnimations();
  initTypingAnimation();
}

// Handle theme preference changes
const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
themeMediaQuery.addEventListener("change", function (e) {
  // Could implement dark mode here if needed
  console.log("Theme preference changed:", e.matches ? "dark" : "light");
});
