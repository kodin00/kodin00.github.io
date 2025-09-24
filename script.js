let carouselPositions = {
    'projects-carousel': 0,
    'blogs-carousel': 0
};

function moveCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const container = carousel.querySelector('.carousel-container');
    const items = container.querySelectorAll('.carousel-item');
    const itemWidth = items[0].offsetWidth + 20; // item width + gap
    const visibleItems = 3;
    const maxPosition = Math.max(0, items.length - visibleItems);

    carouselPositions[carouselId] += direction;

    if (carouselPositions[carouselId] < 0) {
        carouselPositions[carouselId] = 0;
    }

    if (carouselPositions[carouselId] > maxPosition) {
        carouselPositions[carouselId] = maxPosition;
    }

    const translateX = -carouselPositions[carouselId] * itemWidth;
    container.style.transform = `translateX(${translateX}px)`;

    updateButtons(carouselId, maxPosition);
}

function updateButtons(carouselId, maxPosition) {
    const carouselSection = document.querySelector(`#${carouselId}`).parentElement;
    const prevBtn = carouselSection.querySelector('.prev');
    const nextBtn = carouselSection.querySelector('.next');

    if (carouselPositions[carouselId] === 0) {
        prevBtn.disabled = true;
    } else {
        prevBtn.disabled = false;
    }

    if (carouselPositions[carouselId] >= maxPosition) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
}

function initializeCarousels() {
    const carouselIds = ['projects-carousel', 'blogs-carousel'];

    carouselIds.forEach(carouselId => {
        const carousel = document.getElementById(carouselId);
        const container = carousel.querySelector('.carousel-container');
        const items = container.querySelectorAll('.carousel-item');
        const maxPosition = Math.max(0, items.length - 3);

        updateButtons(carouselId, maxPosition);
    });
}

function handleResize() {
    carouselPositions['projects-carousel'] = 0;
    carouselPositions['blogs-carousel'] = 0;

    const carouselIds = ['projects-carousel', 'blogs-carousel'];
    carouselIds.forEach(carouselId => {
        const carousel = document.getElementById(carouselId);
        const container = carousel.querySelector('.carousel-container');
        container.style.transform = 'translateX(0px)';
    });

    initializeCarousels();
}

document.addEventListener('DOMContentLoaded', function() {
    // Load data first, then initialize everything
    loadData();

    window.addEventListener('resize', handleResize);
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        moveCarousel('projects-carousel', -1);
    } else if (e.key === 'ArrowRight') {
        moveCarousel('projects-carousel', 1);
    } else if (e.key === 'Escape') {
        closePopup();
    }
});

// Data storage
let projectsData = [];
let blogsData = [];
let backgroundData = [];
let itemData = {};

// Load data from JSON files
async function loadData() {
    try {
        // Fetch projects
        const projectsResponse = await fetch('data/projects.json');
        projectsData = await projectsResponse.json();

        // Fetch blogs
        const blogsResponse = await fetch('data/blogs.json');
        blogsData = await blogsResponse.json();

        // Fetch background
        const backgroundResponse = await fetch('data/background.json');
        backgroundData = await backgroundResponse.json();

        // Create itemData object for popup functionality
        projectsData.forEach(project => {
            itemData[project.id] = project;
        });

        blogsData.forEach(blog => {
            itemData[blog.id] = blog;
        });

        // Generate content
        generateBackgroundContent();
        generateCarouselContent();

    } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to show loading error
        document.querySelector('#projects-carousel .carousel-container').innerHTML =
            '<div class="error-message">Error loading projects</div>';
        document.querySelector('#blogs-carousel .carousel-container').innerHTML =
            '<div class="error-message">Error loading blogs</div>';
        document.querySelector('.history-timeline').innerHTML =
            '<div class="error-message">Error loading background</div>';
    }
}

function showPopup(itemId) {
    const data = itemData[itemId];
    if (!data) return;

    document.getElementById('popup-title').textContent = data.title;
    document.getElementById('popup-description').textContent = data.description;
    document.getElementById('popup-technologies').textContent = data.technologies;

    // Handle optional duration
    const durationElement = document.getElementById('popup-duration');
    const durationRow = durationElement.closest('.detail-item');
    if (data.duration) {
        durationElement.textContent = data.duration;
        durationRow.style.display = 'flex';
    } else {
        durationRow.style.display = 'none';
    }

    // Handle optional link
    const linkElement = document.getElementById('popup-link');
    const linkRow = linkElement.closest('.detail-item');
    if (data.link) {
        linkElement.href = data.link;
        linkElement.textContent = data.link.includes('github') ? 'View on GitHub' : 'Read Article';
        linkRow.style.display = 'flex';
    } else {
        linkRow.style.display = 'none';
    }

    const overlay = document.getElementById('popup-overlay');
    overlay.classList.add('active');

    // Prevent body scroll when popup is open
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    const overlay = document.getElementById('popup-overlay');
    overlay.classList.remove('active');

    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close popup when clicking outside the content
document.getElementById('popup-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closePopup();
    }
});

// Generate carousel content dynamically
function generateCarouselContent() {
    generateProjectsCarousel();
    generateBlogsCarousel();
    initializeCarousels();
}

function generateProjectsCarousel() {
    const container = document.querySelector('#projects-carousel .carousel-container');
    container.innerHTML = '';

    projectsData.forEach(project => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.innerHTML = `
            <div class="project-card" onclick="showPopup('${project.id}')">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 100)}...</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// Generate background content dynamically
function generateBackgroundContent() {
    const container = document.querySelector('.history-timeline');
    container.innerHTML = '';

    backgroundData.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="year">${item.year}</div>
            <div class="title">${item.title}</div>
            <div class="subtitle">${item.subtitle}</div>
            <div class="description">${item.description}</div>
        `;
        container.appendChild(historyItem);
    });
}

function generateBlogsCarousel() {
    const container = document.querySelector('#blogs-carousel .carousel-container');
    container.innerHTML = '';

    blogsData.forEach(blog => {
        const item = document.createElement('div');
        item.className = 'carousel-item';
        item.innerHTML = `
            <div class="blog-card" onclick="showPopup('${blog.id}')">
                <h3>${blog.title}</h3>
                <p>${blog.description.substring(0, 100)}...</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// Generate background content dynamically
function generateBackgroundContent() {
    const container = document.querySelector('.history-timeline');
    container.innerHTML = '';

    backgroundData.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="year">${item.year}</div>
            <div class="title">${item.title}</div>
            <div class="subtitle">${item.subtitle}</div>
            <div class="description">${item.description}</div>
        `;
        container.appendChild(historyItem);
    });
}
// Toggle between regular and technical about text
function toggleAboutVersion() {
    const checkbox = document.getElementById('technical-toggle');
    const aboutText = document.getElementById('about-text');

    const regularText = "Deliver fast & reliable solutions, leveraging the latest technologies and best practices to ensure performance, maintainability, and cost.";

    const technicalText = "This web made with the basic 3 (html+css+js, no framework) for performance, deployed with Docker on an efficient selfhosted Proxmox server leveraging Cloudflare for optimal speed and security.";

    if (checkbox.checked) {
        aboutText.innerHTML = technicalText;
    } else {
        aboutText.innerHTML = regularText;
    }
}
