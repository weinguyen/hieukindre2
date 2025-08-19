// Dữ liệu tin nhắn
const messages = [
  "Từ cục nợ của anh, mình hết nợ rồi nhé",
  "Em không đủ gan dạ để tiếp tục chuyện yêu xa",
  "Nhưng tạm biệt anh sẽ là một trong những tiếc nuối lớn nhất của em",
  "Em làm cái này để kết thúc lại chuyện tình mình",
  "Đừng quên em nha đồ xấu xa :<",

]

const fullMessage = `
Gửi híu
Em đã viết thư chia tay anh đi sài gòn mấy lần rồi, nhưng không nghĩ sẽ có ngày thực sự phải gửi đi. Em cứ nghĩ có thể mình sẽ đi, nhưng là đi cùng nhau cơ. 
Anh bảo anh luyện cho em không khóc lúc anh nhắc tới chuyện anh đi, nhưng em vẫn khóc, khóc to vl luôn meo meo suốt. Em chả nỡ rời khỏi anh đâu, muốn anh ôm cơ. 
Đừng có bảo em nhiễu thế nhỉ ☹️ em khôngggg có, giờ em có đòi ôm đòi hôn thì cũng đâu đòi được. 
Mình đã có khoảng thời gian vui vẻ bên nhau, đối với em thế là tốt rồi. Giữa bao nhiêu mối quan hệ mệt mỏi, ít nhất mình cho nhau được kỷ niệm đẹp. Em sẽ nhớ lắm mùa đông mình ôm nhau xem AOT, mùa xuân làm bánh đón sinh nhật 2 đứa và cày avatar. Nhớ cả lúc cao hứng bật nhạc ầm ầm phiền hàng xóm vô cùng. Có những bộ phim mình không được xem phần tiếp theo với nhau rồi, không biết khi anh xem phần mới, anh có nhớ tới em hăm, nhưng em sẽ nhớ anh lắm. Anh ở đó sớm làm quen được bạn bè, sớm thích nghi và đừng dây vào những đứa con gái chỉ tốt bằng nửa em nhé .-.  Yêu anh, Hiếu ạ. Con heo của anh, cục nợ của anh, con vợ iu của anh đi đây, bieeee
`

// Biến global
let currentMessageIndex = 0
let currentCharIndex = 0
const isTyping = false
let isDeleting = false
let currentPage = "main"

// DOM elements
const typewriterText = document.getElementById("typewriter-text")
const cursor = document.getElementById("cursor")
const pages = document.querySelectorAll(".page")
const modal = document.getElementById("message-modal")
const modalBody = document.getElementById("modal-body")
const closeModal = document.getElementById("close-modal")
const videoBtn = document.getElementById("video-btn")
const messageBtn = document.getElementById("message-btn")
const imageGallery = document.getElementById("image-gallery")
const backgroundMusic = document.getElementById("background-music")
const introScreen = document.getElementById("intro-screen")
let hasStarted = false

// Typewriter effect
function typeWriter() {
  const currentMessage = messages[currentMessageIndex]

  if (!isDeleting && currentCharIndex < currentMessage.length) {
    // Typing
    typewriterText.textContent = currentMessage.substring(0, currentCharIndex + 1)
    currentCharIndex++
    setTimeout(typeWriter, 60)
  } else if (isDeleting) {
    // Fade out effect instead of character deletion
    typewriterText.style.opacity = '0'
    typewriterText.style.transform = 'translateY(-10px)'

    setTimeout(() => {
      // Reset for next message
      isDeleting = false
      currentCharIndex = 0
      currentMessageIndex++

      if (currentMessageIndex >= messages.length) {
        // All messages done, go to memories page
        setTimeout(() => {
          showPageWithTransition("memories")
        }, 1000)
        return
      }

      // Reset styles and start next message
      typewriterText.style.opacity = '1'
      typewriterText.style.transform = 'translateY(0)'
      typewriterText.textContent = ''
      setTimeout(typeWriter, 300)
    }, 500) // Fade duration
  } else if (!isDeleting && currentCharIndex === currentMessage.length) {
    // Pause before fading
    setTimeout(() => {
      isDeleting = true
      typeWriter()
    }, 1500)
  }
}

// Page navigation
function showPage(pageName) {
  pages.forEach((page) => page.classList.remove("active"))
  document.getElementById(`${pageName}-page`).classList.add("active")
  currentPage = pageName

  if (pageName === "memories") {
    // Setup gallery scroll IMMEDIATELY when page loads
    setTimeout(() => {
      setupGalleryScroll()
    }, 100) // Very short delay to ensure DOM is ready

    // Start lyrics animation independently
    setTimeout(() => {
      startLyricsAnimation()
    }, 500) // Separate timing for lyrics
  }
}


// Lyrics animation
function startLyricsAnimation() {
  // No animation needed - lyrics are now completely static
  // All lyrics display at once without any highlighting or effects
}// Gallery scroll detection
function setupGalleryScroll() {
  let hasScrolledToNavigation = false
  let autoScrollInterval = null
  const horizontalGallery = document.getElementById("horizontal-gallery")
  const memoryCards = document.querySelectorAll(".memory-card")
  const isMobile = window.innerWidth <= 768

  if (!horizontalGallery) return

  // Mobile-specific: Track which card is currently in view
  function updateVisibleCardOnMobile() {
    if (!isMobile) return

    const galleryRect = horizontalGallery.getBoundingClientRect()
    const galleryCenter = galleryRect.left + galleryRect.width / 2

    let closestCard = null
    let closestDistance = Infinity

    memoryCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect()
      const cardCenter = cardRect.left + cardRect.width / 2
      const distance = Math.abs(cardCenter - galleryCenter)

      if (distance < closestDistance) {
        closestDistance = distance
        closestCard = { card, index }
      }
    })

    // Update active states
    memoryCards.forEach(card => {
      const title = card.querySelector('.memory-title')
      if (title) {
        title.classList.remove('mobile-active')
      }
    })

    if (closestCard) {
      const title = closestCard.card.querySelector('.memory-title')
      if (title) {
        title.classList.add('mobile-active')
      }
    }
  }

  // Auto scroll function (only for desktop)
  function startAutoScroll() {
    if (isMobile) return // Disable auto-scroll on mobile

    let currentIndex = 0
    const cardWidth = 520 // 500px width + 20px gap

    autoScrollInterval = setInterval(() => {
      if (hasScrolledToNavigation) {
        clearInterval(autoScrollInterval)
        return
      }

      // Scroll to next card
      const scrollLeft = currentIndex * cardWidth
      horizontalGallery.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })

      // Show current card title
      showCardTitle(currentIndex)

      currentIndex++

      // Reset to beginning if reached end
      if (currentIndex >= memoryCards.length) {
        setTimeout(() => {
          currentIndex = 0
          horizontalGallery.scrollTo({
            left: 0,
            behavior: 'smooth'
          })
          showCardTitle(0)
        }, 2000)
      }
    }, 3000) // Change image every 3 seconds
  }

  // Function to show card title (desktop only)
  function showCardTitle(index) {
    return
  }

  // Function to show title notification (desktop only)
  function showTitleNotification(titleText) {
    if (isMobile) return // Skip notifications on mobile

    // Remove existing notification
    const existingNotification = document.querySelector('.title-notification')
    if (existingNotification) {
      existingNotification.remove()
    }

    // Create new notification
    const notification = document.createElement('div')
    notification.className = 'title-notification'
    notification.textContent = titleText
    document.body.appendChild(notification)

    // Auto remove after 2.5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 2500)
  }

  // Scroll event listener
  horizontalGallery.addEventListener("scroll", () => {
    if (hasScrolledToNavigation) return

    // Mobile: Update visible card on scroll
    if (isMobile) {
      updateVisibleCardOnMobile()
    } else {
      // Desktop: Stop auto scroll when user manually scrolls
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval)
        autoScrollInterval = null
      }

      // Find current visible card and show its title
      const scrollLeft = horizontalGallery.scrollLeft
      const currentCardIndex = Math.round(scrollLeft / 520)
      showCardTitle(currentCardIndex)
    }

    // Check if scrolled to end for navigation
    const scrollLeft = horizontalGallery.scrollLeft
    const maxScroll = horizontalGallery.scrollWidth - horizontalGallery.clientWidth

    if (scrollLeft >= maxScroll - 50) {
      hasScrolledToNavigation = true
      setTimeout(() => {
        showNavigationSection()
      }, 1500)
    }
  })

  // Initialize
  if (isMobile) {
    // Mobile: Set up initial state and track visible cards
    setTimeout(() => {
      updateVisibleCardOnMobile()
    }, 500)
  } else {
    // Desktop: Start auto scroll after a delay
    setTimeout(() => {
      if (horizontalGallery && !hasScrolledToNavigation) {
        startAutoScroll()
      }
    }, 2000)
  }
}

// Show navigation section with smooth scroll
function showNavigationSection() {
  const navigationSection = document.getElementById("navigation-section")
  if (navigationSection) {
    // Add animation class
    navigationSection.classList.add('show')

    // Smooth scroll to navigation section
    navigationSection.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }
}


// Modal functions
function showModal(content) {
  modalBody.innerHTML = content
  modal.classList.add("active")
  document.body.style.overflow = "hidden"
}

function hideModal() {
  modal.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Event listeners
closeModal.addEventListener("click", hideModal)

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    hideModal()
  }
})

videoBtn.addEventListener("click", () => {
  const videoContent = `
        <div class="video-modal-content">
            <h2>Video Kỷ Niệm</h2>
            <div class="video-container">
                <video 
                    controls 
                    width="100%" 
                    height="auto"
                    preload="metadata">
                    <source src="./public/bie ck.mp4" type="video/mp4">
                    <source src="./public/bie ck.mp4" type="video/webm">
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
            </div>
            <div class="message-content">

            </div>
        </div>
    `
  showModal(videoContent)
})

messageBtn.addEventListener("click", () => {
  const messageContent = `
        <div class="message-content">
            <h2>Lời Nhắn Cuối</h2>
            ${fullMessage
      .split("\n")
      .map((line) => (line.trim() ? `<p>${line}</p>` : ""))
      .join("")}
        </div>
    `
  showModal(messageContent)
})

// Cinematic page transitions
function showPageWithTransition(pageName) {
  // Fade out current page
  const currentActivePage = document.querySelector(".page.active")
  if (currentActivePage) {
    currentActivePage.style.opacity = "0"
    currentActivePage.style.transform = "translateY(-50px)"
  }

  setTimeout(() => {
    showPage(pageName)
  }, 600)
}

function startExperience() {
  if (hasStarted) return
  hasStarted = true

  // Play background music
  backgroundMusic.play().catch((e) => {
    console.log("[v0] Audio autoplay blocked:", e)
  })

  // Hide intro screen
  introScreen.classList.remove("active")

  // Start typewriter after intro fades
  setTimeout(() => {
    showPage("main")
    setTimeout(typeWriter, 500)
  }, 800)
}

introScreen.addEventListener("click", startExperience)
document.addEventListener("keydown", (e) => {
  if (!hasStarted && (e.key === "Enter" || e.key === " ")) {
    startExperience()
  }
  if (e.key === "Escape") {
    hideModal()
  }
})

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Show intro screen first
  introScreen.classList.add("active")

  // Add fade-in animation to all pages
  pages.forEach((page) => page.classList.add("fade-in"))
})

// Smooth scroll for better UX
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallax = document.querySelector(".container")
  if (parallax) {
    const speed = scrolled * 0.1
    parallax.style.transform = `translateY(${speed}px)`
  }
})
