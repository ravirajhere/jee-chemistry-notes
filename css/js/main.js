/* ============================================
   JEE Chemistry Notes - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  initTabs();
  highlightActiveNav();
});

/* ---------- TABS FUNCTIONALITY ---------- */
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  if (tabButtons.length === 0) return;
  
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetId = this.getAttribute('data-tab');
      
      // Remove active from all buttons
      document.querySelectorAll('.tab-btn').forEach(function (b) {
        b.classList.remove('active');
      });
      
      // Remove active from all content
      document.querySelectorAll('.tab-content').forEach(function (c) {
        c.classList.remove('active');
      });
      
      // Add active to clicked button
      this.classList.add('active');
      
      // Add active to target content
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
  
  // Activate first tab by default
  tabButtons[0].click();
}

/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
function highlightActiveNav() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.navbar-links a');
  
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== 'index.html' && href !== '../index.html') {
      link.classList.add('active');
    }
  });
}
