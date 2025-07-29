// Testimonials Carousel
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".testimonials-carousel");
  const track = document.querySelector(".testimonials-track");
  const cards = document.querySelectorAll(".testimonial-card");
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");

  if (!carousel || !track || !cards.length) return;

  let currentIndex = 0;
  const cardWidth = cards[0].offsetWidth;
  const gap = 20; // Gap between cards
  let cardsPerView = getCardsPerView();

  // Initialize carousel
  function initCarousel() {
    updateCarousel();
    updateButtonStates();
  }

  // Get number of cards visible based on screen size
  function getCardsPerView() {
    if (window.innerWidth >= 1200) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  // Update carousel position
  function updateCarousel() {
    const translateX = -(currentIndex * (cardWidth + gap));
    track.style.transform = `translateX(${translateX}px)`;
  }

  // Update button states
  function updateButtonStates() {
    const maxIndex = Math.max(0, cards.length - cardsPerView);

    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex >= maxIndex;

    // Update ARIA attributes
    prevButton.setAttribute("aria-disabled", prevButton.disabled);
    nextButton.setAttribute("aria-disabled", nextButton.disabled);
  }

  // Navigate to previous card
  function goToPrev() {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
      updateButtonStates();
      updateActiveCard();
    }
  }

  // Navigate to next card
  function goToNext() {
    const maxIndex = Math.max(0, cards.length - cardsPerView);
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
      updateButtonStates();
      updateActiveCard();
    }
  }

  // Update active card for screen readers
  function updateActiveCard() {
    cards.forEach((card, index) => {
      const isVisible =
        index >= currentIndex && index < currentIndex + cardsPerView;
      card.setAttribute("aria-hidden", !isVisible);

      if (isVisible && index === currentIndex) {
        card.setAttribute("aria-current", "true");
      } else {
        card.removeAttribute("aria-current");
      }
    });
  }

  // Handle window resize
  function handleResize() {
    const newCardsPerView = getCardsPerView();
    if (newCardsPerView !== cardsPerView) {
      cardsPerView = newCardsPerView;
      currentIndex = Math.min(
        currentIndex,
        Math.max(0, cards.length - cardsPerView)
      );
      updateCarousel();
      updateButtonStates();
      updateActiveCard();
    }
  }

  // Event listeners
  prevButton.addEventListener("click", goToPrev);
  nextButton.addEventListener("click", goToNext);

  // Keyboard navigation
  carousel.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goToNext();
    }
  });

  // Touch/swipe support for mobile
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", function (e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener("touchmove", function (e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
    e.preventDefault();
  });

  track.addEventListener("touchend", function (e) {
    if (!isDragging) return;

    const diffX = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }

    isDragging = false;
  });

  // Window resize handler
  window.addEventListener("resize", handleResize);

  // Initialize on load
  initCarousel();

  // Add smooth transition after initial load
  setTimeout(() => {
    track.style.transition = "transform 0.3s ease-in-out";
  }, 100);
});
