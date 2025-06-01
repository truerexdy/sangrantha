const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

async function loadContent() {
    const response = await fetch("blog.json");
    const data = await response.json();
    document.getElementById("blogTitle").innerText = data.title;
    document.getElementById("blogContent").innerHTML = data.content;
}

loadContent();
