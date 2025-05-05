// Portfolio data management
const PortfolioManager = {
    // Initialize portfolio functionality
    init: function() {
        console.log('Portfolio Manager initialized');
        this.setupPortfolioItems();
    },

    // Setup click handlers for portfolio items
    setupPortfolioItems: function() {
        const portfolioItems = document.querySelectorAll('.single-portfolio-item .live-view-btn');
        console.log(`Found ${portfolioItems.length} portfolio items`);

        portfolioItems.forEach((item) => {
            item.addEventListener('click', (e) => this.handlePortfolioClick(e, item));
        });
    },

    // Handle portfolio item click
    handlePortfolioClick: function(e, item) {
        console.log('Portfolio item clicked:', item);
        console.log('Item href:', item.getAttribute('href'));
        
        if (!item.getAttribute('href')?.includes('singleproject.html')) {
            console.log('Not a singleproject link, skipping');
            return;
        }

        e.preventDefault();
        console.log('Preventing default navigation');

        // Get project data
        const projectData = this.getProjectData(item);
        console.log('Project data extracted:', projectData);

        // Store data and navigate
        this.storeProjectData(projectData);
        
        // Verify data was stored
        const storedData = localStorage.getItem('projectData');
        console.log('Verifying stored data:', storedData);
        
        if (!storedData) {
            console.error('Data was not stored in localStorage!');
            return;
        }

        console.log('Navigating to:', item.getAttribute('href'));
        window.location.href = item.getAttribute('href');
    },

    // Get project data from portfolio item
    getProjectData: function(item) {
        console.log('Getting project data from item:', item);
        const portfolioItem = item.closest('.single-portfolio-item');
        console.log('Found portfolio item:', portfolioItem);
        
        // Get basic project info
        const title = portfolioItem.querySelector('.bottom-part-portfolio h3').textContent;
        const category = portfolioItem.querySelector('.sub-portfolio-item p.mb-2').textContent.replace('Catagory: ', '');
        const description = portfolioItem.querySelector('.sub-portfolio-item p:nth-child(3)').textContent.replace('Description: ', '');
        
        console.log('Extracted info:', { title, category, description });

        // Get images
        const mainImage = item.getAttribute('data-main-image');
        console.log('Main image:', mainImage);
        
        let galleryData = this.parseGalleryData(item.getAttribute('data-gallery'));
        console.log('Gallery data:', galleryData);
        
        // If no gallery data, use main image
        if (galleryData.length === 0 && mainImage) {
            galleryData = [mainImage];
            console.log('Using main image as gallery');
        }

        // Get links
        const liveLink = item.getAttribute('data-live-link');
        const behanceLink = item.getAttribute('data-behance-link');
        console.log('Links:', { liveLink, behanceLink });

        const projectData = {
            title,
            category,
            description,
            mainImage,
            gallery: galleryData,
            liveLink,
            behanceLink,
            timestamp: Date.now() // Add timestamp
        };

        console.log('Final project data:', projectData);
        return projectData;
    },

    // Parse gallery data from string
    parseGalleryData: function(galleryString) {
        try {
            return JSON.parse(galleryString);
        } catch (error) {
            console.error('Error parsing gallery data:', error);
            return [];
        }
    },

    // Store project data in localStorage
    storeProjectData: function(projectData) {
        try {
            localStorage.setItem('projectData', JSON.stringify(projectData));
            console.log('Project data stored in localStorage');
        } catch (error) {
            console.error('Error storing project data:', error);
        }
    },

    // Load project data in singleproject.html
    loadProjectData: function() {
        try {
            console.log('Loading project data');
            
            // First try to get project ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const projectId = urlParams.get('id');
            
            if (projectId) {
                console.log('Project ID from URL:', projectId);
                // Try to find project data from portfolio items
                const projectData = this.findProjectDataById(projectId);
                if (projectData) {
                    console.log('Found project data from portfolio items');
                    this.updateProjectPage(projectData);
                    return;
                }
            }

            // If no project ID or data not found, try localStorage
            console.log('Trying to load from localStorage');
            const storedData = localStorage.getItem('projectData');
            
            if (storedData) {
                const projectData = JSON.parse(storedData);
                // Check if data is less than 5 minutes old
                if (Date.now() - projectData.timestamp < 5 * 60 * 1000) {
                    console.log('Using recent localStorage data');
                    this.updateProjectPage(projectData);
                    return;
                }
            }

            // If we get here, show error state
            console.log('No valid project data found');
            this.showErrorState();
        } catch (error) {
            console.error('Error loading project data:', error);
            this.showErrorState();
        }
    },

    // Find project data by ID from portfolio items
    findProjectDataById: function(projectId) {
        const portfolioItems = document.querySelectorAll('.single-portfolio-item .live-view-btn');
        for (const item of portfolioItems) {
            const href = item.getAttribute('href');
            if (href && href.includes(`id=${projectId}`)) {
                return this.getProjectData(item);
            }
        }
        return null;
    },

    // Update singleproject.html content
    updateProjectPage: function(projectData) {
        console.log('Updating project page with:', projectData);
        
        // Update title and description
        const titleElement = document.getElementById('project-title');
        const categoryElement = document.getElementById('project-category');
        const descriptionElement = document.getElementById('project-description');
        
        console.log('Found elements:', {
            title: titleElement,
            category: categoryElement,
            description: descriptionElement
        });

        if (!titleElement || !categoryElement || !descriptionElement) {
            console.error('Required elements not found on page');
            this.showErrorState();
            return;
        }

        titleElement.textContent = projectData.title;
        categoryElement.textContent = projectData.category;
        descriptionElement.textContent = projectData.description;

        // Update main image
        const projectImage = document.getElementById('project-main-img');
        console.log('Updating main image:', projectImage);
        if (projectImage) {
            projectImage.src = projectData.mainImage;
            projectImage.alt = projectData.title;
            projectImage.onerror = () => {
                console.log('Main image failed to load, using default');
                projectImage.src = 'assets/images/portfolio/default.jpg';
            };
        }

        // Update gallery
        this.updateGallery(projectData.gallery, projectData.title);

        // Update links
        this.updateProjectLinks(projectData.liveLink, projectData.behanceLink);
    },

    // Update project gallery
    updateGallery: function(galleryData, projectTitle) {
        const galleryElement = document.getElementById('project-gallery');
        if (!galleryElement) return;

        galleryElement.innerHTML = '';
        galleryData.forEach((imageUrl, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <a href="${imageUrl}" data-lightbox="project-gallery" data-title="${projectTitle} - Image ${index + 1}">
                    <img src="${imageUrl}" alt="${projectTitle} - Image ${index + 1}" loading="lazy">
                </a>
            `;
            galleryElement.appendChild(galleryItem);
        });
    },

    // Update project links
    updateProjectLinks: function(liveLink, behanceLink) {
        const liveLinkElement = document.getElementById('project-live-link');
        const behanceLinkElement = document.getElementById('project-behance-link');

        if (liveLinkElement) {
            if (liveLink && liveLink !== 'null') {
                liveLinkElement.href = liveLink;
                liveLinkElement.style.display = 'inline-block';
            } else {
                liveLinkElement.style.display = 'none';
            }
        }

        if (behanceLinkElement) {
            if (behanceLink && behanceLink !== 'null') {
                behanceLinkElement.href = behanceLink;
                behanceLinkElement.style.display = 'inline-block';
            } else {
                behanceLinkElement.style.display = 'none';
            }
        }
    },

    // Show error state
    showErrorState: function() {
        console.log('Showing error state');
        const titleElement = document.getElementById('project-title');
        const descriptionElement = document.getElementById('project-description');
        const categoryElement = document.getElementById('project-category');
        const mainImageElement = document.getElementById('project-main-img');
        const galleryElement = document.getElementById('project-gallery');
        const liveLinkElement = document.getElementById('project-live-link');
        const behanceLinkElement = document.getElementById('project-behance-link');

        if (titleElement) titleElement.textContent = 'Project Not Found';
        if (descriptionElement) descriptionElement.textContent = 'Please access this page from the portfolio section.';
        if (categoryElement) categoryElement.textContent = 'Error';
        if (mainImageElement) mainImageElement.src = 'assets/images/portfolio/default.jpg';
        if (galleryElement) galleryElement.innerHTML = `
            <div class="gallery-item">
                <img src="assets/images/portfolio/default.jpg" alt="Project Not Found">
            </div>
        `;
        if (liveLinkElement) liveLinkElement.style.display = 'none';
        if (behanceLinkElement) behanceLinkElement.style.display = 'none';
    },

    updateProjectDetails(project) {
        // Update main image
        const mainImage = document.getElementById('project-main-image');
        mainImage.src = project.image;
        mainImage.alt = project.title;

        // Update title
        document.getElementById('project-title').textContent = project.title;

        // Update description
        document.getElementById('project-description').textContent = project.description;

        // Update category
        document.getElementById('project-category').textContent = project.category;

        // Update links
        const liveLink = document.getElementById('project-live-link');
        const behanceLink = document.getElementById('project-behance-link');

        if (project.liveLink) {
            liveLink.href = project.liveLink;
            liveLink.style.display = 'inline-block';
        } else {
            liveLink.style.display = 'none';
        }

        if (project.behanceLink) {
            behanceLink.href = project.behanceLink;
            behanceLink.style.display = 'inline-block';
        } else {
            behanceLink.style.display = 'none';
        }

        // Update gallery
        this.updateGallery(project.gallery);
    }
};

// Initialize portfolio manager on index.html
if (document.querySelector('.single-portfolio-item')) {
    console.log('Initializing portfolio manager on index.html');
    document.addEventListener('DOMContentLoaded', () => PortfolioManager.init());
}

// Load project data on singleproject.html
if (document.getElementById('project-title')) {
    console.log('Loading project data on singleproject.html');
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, loading project data');
        PortfolioManager.loadProjectData();
    });
} 