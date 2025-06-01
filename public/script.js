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

fetch('blogList.json')
  .then(response => response.json())
  .then(blogs => {
    const blogsGrid = document.getElementById('blogsGrid');
    blogs.forEach(blog => {
     const blogDiv = document.createElement('div');
      const dateTime = document.createElement('p');
      const titleLink = document.createElement('a');
      blogDiv.className = 'blog';
      titleLink.textContent = blog.title;
      titleLink.href = `blogs/${blog.id.toString()}`;
      blogDiv.appendChild(titleLink);
      dateTime.textContent = new Date(blog.lastUpdatedTime).toLocaleDateString();
      dateTime.className = 'lastUpdatedTime';
      blogDiv.appendChild(dateTime);
      blogsGrid.appendChild(blogDiv);
    });
    const latestBlogTitleElement = document.getElementById("latestBlogTitle");
    const latestBlogLink = document.createElement('a');
    latestBlogLink.textContent = blogs[0].title;
    latestBlogLink.href = `blogs/${blogs[0].id.toString()}`;
    latestBlogTitleElement.innerHTML = '';
    latestBlogTitleElement.appendChild(latestBlogLink);
  });

window.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark');
  }
  updateToggleIcon(isDark);
});