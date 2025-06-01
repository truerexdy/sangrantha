const toggleButton = document.getElementById('themeToggle');

function updateToggleIcon(isDark) {
  toggleButton.textContent = isDark ? '🌕' : '☀️';
}

toggleButton.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateToggleIcon(isDark);
  console.log('toggleButton:', isDark);
});

window.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark');
  }
  updateToggleIcon(isDark);
});
