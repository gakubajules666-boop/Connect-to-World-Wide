// Main JavaScript for video streaming platform

// Video data storage
let videos = [];
let userEarnings = 0;
let todayViews = 0;
let watchHistory = [];

// Load data from localStorage
function loadData() {
    const savedVideos = localStorage.getItem('videos');
    const savedEarnings = localStorage.getItem('totalEarnings');
    const savedTodayViews = localStorage.getItem('todayViews');
    const lastDate = localStorage.getItem('lastDate');
    
    const today = new Date().toDateString();
    
    // Reset daily earnings if new day
    if (lastDate !== today) {
        todayViews = 0;
        localStorage.setItem('todayViews', '0');
        localStorage.setItem('lastDate', today);
    } else {
        todayViews = parseInt(savedTodayViews) || 0;
    }
    
    userEarnings = parseFloat(savedEarnings) || 0;
    
    if (savedVideos) {
        videos = JSON.parse(savedVideos);
    } else {
        // Default videos
        videos = [
            {
                id: 1,
                title: "Love in Kigali - Romantic Movie",
                description: "A beautiful love story set in Rwanda's capital",
                videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
                thumbnail: "https://via.placeholder.com/320x180?text=Love+in+Kigali",
                views: 0,
                category: "entertainment"
            },
            {
                id: 2,
                title: "Rwandan Comedy Special",
                description: "Stand-up comedy from local artists",
                videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
                thumbnail: "https://via.placeholder.com/320x180?text=Comedy",
                views: 0,
                category: "comedy"
            },
            {
                id: 3,
                title: "Travel Guide: Rwanda",
                description: "Explore the land of a thousand hills",
                videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_5mb.mp4",
                thumbnail: "https://via.placeholder.com/320x180?text=Travel+Rwanda",
                views: 0,
                category: "education"
            }
        ];
        saveVideos();
    }
    
    updateDisplay();
}

// Save videos to localStorage
function saveVideos() {
    localStorage.setItem('videos', JSON.stringify(videos));
}

// Update earnings display
function updateDisplay() {
    const todayEarningsElement = document.getElementById('todayEarnings');
    const totalEarningsElement = document.getElementById('totalEarnings');
    
    const todayEarnings = todayViews * 0.005;
    
    if (todayEarningsElement) {
        todayEarningsElement.textContent = `$${todayEarnings.toFixed(4)}`;
    }
    
    if (totalEarningsElement) {
        totalEarningsElement.textContent = `$${userEarnings.toFixed(2)}`;
    }
}

// Track view and earnings
function trackView(videoId) {
    todayViews++;
    userEarnings += 0.005;
    
    // Update video view count
    const video = videos.find(v => v.id === videoId);
    if (video) {
        video.views++;
    }
    
    // Save to localStorage
    localStorage.setItem('totalEarnings', userEarnings.toString());
    localStorage.setItem('todayViews', todayViews.toString());
    localStorage.setItem('lastDate', new Date().toDateString());
    saveVideos();
    
    // Add to watch history
    watchHistory.unshift({
        videoId: videoId,
        videoTitle: video.title,
        timestamp: new Date().toISOString(),
        earned: 0.005
    });
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory.slice(0, 50)));
    
    updateDisplay();
    
    // Show notification
    showNotification(`+$0.005 earned! Total: $${userEarnings.toFixed(4)}`);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `💰 ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Play video with ad
function playVideo(video) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div id="ad-container" class="ad-overlay">
                <h3>📢 Advertisement</h3>
                <p>Your video will start in</p>
                <div class="ad-timer">5</div>
                <small>You earn $0.005 from this ad</small>
            </div>
            <video id="modalVideo" controls>
                <source src="${video.videoUrl}" type="video/mp4">
            </video>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    const videoPlayer = modal.querySelector('#modalVideo');
    const adContainer = modal.querySelector('#ad-container');
    const timerElement = modal.querySelector('.ad-timer');
    
    let countdown = 5;
    const timer = setInterval(() => {
        countdown--;
        if (timerElement) {
            timerElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(timer);
            if (adContainer) {
                adContainer.remove();
            }
            videoPlayer.play();
            
            // Track earnings after ad completes
            trackView(video.id);
        }
    }, 1000);
    
    // Close modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => {
        clearInterval(timer);
        modal.remove();
    };
    
    // Click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) {
            clearInterval(timer);
            modal.remove();
        }
    };
}

// Render video grid
function renderVideoGrid() {
    const videoGrid = document.getElementById('videoGrid');
    if (!videoGrid) return;
    
    videoGrid.innerHTML = '';
    
    videos.forEach(video => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-card';
        videoCard.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" onerror="this.src='https://via.placeholder.com/320x180?text=Video'">
            <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-views">${video.views.toLocaleString()} views</p>
                <button class="watch-btn" data-id="${video.id}">Watch & Earn $0.005</button>
            </div>
        `;
        
        videoGrid.appendChild(videoCard);
        
        const watchBtn = videoCard.querySelector('.watch-btn');
        watchBtn.addEventListener('click', () => playVideo(video));
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderVideoGrid();
});

// Export functions for other scripts
window.trackView = trackView;
window.videos = () => videos;
window.userEarnings = () => userEarnings;
window.todayViews = () => todayViews;
