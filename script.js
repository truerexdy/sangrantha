let blogs = [];
const toggleButton = document.getElementById('themeToggle');
const blogListView = document.getElementById('blogListView');
const blogView = document.getElementById('blogView');
const backButton = document.getElementById('backButton');
const blogContent = document.getElementById('blogContent');
const blogTitle = document.getElementById('blogTitle');

function updateToggleIcon(isDark) {
    toggleButton.textContent = isDark ? '🌕' : '☀️';
}

function showBlogList() {
    blogListView.style.display = 'block';
    blogView.style.display = 'none';
    backButton.style.display = 'none';
    document.title = 'Sangrantha';
    history.pushState({view: 'list'}, '', '/');
}

function showBlog(blogId) {
    const blog = blogs.find(b => b.id == blogId);
    if (!blog) return;
    
    blogListView.style.display = 'none';
    blogView.style.display = 'block';
    backButton.style.display = 'block';
    document.title = `${blog.title} - Sangrantha`;
    
    history.pushState({view: 'blog', id: blogId}, '', `/blog/${blogId}`);
    
    blogTitle.textContent = blog.title;
    
    fetch(`/blogs/${blogId}.md`)
        .then(response => {
            if (!response.ok) throw new Error('Blog not found');
            return response.text();
        })
        .then(markdown => {
            let html = marked.parse(markdown);
            html = renderMath(html);
            blogContent.innerHTML = html;
            hljs.highlightAll();
        })
        .catch(error => {
            blogContent.innerHTML = `<h1>Error</h1><p>Blog post not found.</p>`;
        });
}

function renderMath(html) {
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
        try {
            return katex.renderToString(tex, {displayMode: true});
        } catch (e) {
            return match;
        }
    });
    
    html = html.replace(/\$(.*?)\$/g, (match, tex) => {
        try {
            return katex.renderToString(tex, {displayMode: false});
        } catch (e) {
            return match;
        }
    });
    
    return html;
}

function handlePopState(event) {
    const state = event.state;
    if (state && state.view === 'blog') {
        showBlog(state.id);
    } else {
        showBlogList();
    }
}

function initializeFromURL() {
    const path = window.location.pathname;
    const blogMatch = path.match(/^\/blog\/(\d+)$/);
    if (blogMatch) {
        const blogId = parseInt(blogMatch[1]);
        showBlog(blogId);
    } else {
        showBlogList();
    }
}

toggleButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleIcon(isDark);
});

window.addEventListener('popstate', handlePopState);

fetch('blogList.json')
    .then(response => response.json())
    .then(data => {
        blogs = data;
        const blogsGrid = document.getElementById('blogsGrid');
        
        blogs.forEach(blog => {
            const blogDiv = document.createElement('div');
            const dateTime = document.createElement('p');
            const titleLink = document.createElement('a');
            
            blogDiv.className = 'blog';
            titleLink.textContent = blog.title;
            titleLink.href = '#';
            titleLink.addEventListener('click', (e) => {
                e.preventDefault();
                showBlog(blog.id);
            });
            
            blogDiv.appendChild(titleLink);
            dateTime.textContent = new Date(blog.lastUpdatedTime).toLocaleDateString();
            dateTime.className = 'lastUpdatedTime';
            blogDiv.appendChild(dateTime);
            
            blogDiv.addEventListener('click', () => showBlog(blog.id));
            blogsGrid.appendChild(blogDiv);
        });
        
        if (blogs.length > 0) {
            const latestBlogTitleElement = document.getElementById("latestBlogTitle");
            const latestBlogLink = document.createElement('a');
            latestBlogLink.textContent = blogs[0].title;
            latestBlogLink.href = '#';
            latestBlogLink.addEventListener('click', (e) => {
                e.preventDefault();
                showBlog(blogs[0].id);
            });
            latestBlogTitleElement.innerHTML = '';
            latestBlogTitleElement.appendChild(latestBlogLink);
            latestBlogTitleElement.addEventListener('click', () => showBlog(blogs[0].id));
        }
        
        initializeFromURL();
    });

window.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.body.classList.add('dark');
    }
    updateToggleIcon(isDark);
});