const youtubeState = {
    videos: [],
    userVideos: [],
    likes: new Set()
};

document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    loadVideos();
    setupTabNavigation();
    setupUploadForm();
    setupVideoPlayer();
    renderVideoFeed();
    setupRotation();
}

function setupRotation() {
    const rotateBtn = document.getElementById('rotateBtn');
    const wrapper = document.querySelector('.phone-rotate-wrapper');
    
    rotateBtn.addEventListener('click', () => {
        wrapper.classList.toggle('rotated');
        rotateBtn.textContent = wrapper.classList.contains('rotated') ? '↺ Rotate Back' : '↻ Rotate Phone';
    });
}

function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            if (tabName === 'library') {
                renderLibrary();
            }
        });
    });
}

function loadVideos() {
    const stored = localStorage.getItem('youtubeVideos');
    if (stored) {
        youtubeState.videos = JSON.parse(stored);
    } else {
        youtubeState.videos = [];
        saveVideos();
    }
    
    const storedLikes = localStorage.getItem('youtubeLikes');
    if (storedLikes) {
        youtubeState.likes = new Set(JSON.parse(storedLikes));
    }
}

function saveVideos() {
    localStorage.setItem('youtubeVideos', JSON.stringify(youtubeState.videos));
    localStorage.setItem('youtubeLikes', JSON.stringify(Array.from(youtubeState.likes)));
}

function renderVideoFeed() {
    const feed = document.querySelector('.video-feed');
    const emptyMsg = document.querySelector('.empty-feed');
    
    if (youtubeState.videos.length === 0) {
        feed.style.display = 'none';
        emptyMsg.style.display = 'flex';
        return;
    }
    
    feed.style.display = 'flex';
    emptyMsg.style.display = 'none';
    feed.innerHTML = '';
    
    youtubeState.videos.forEach(video => {
        const videoItem = createVideoItem(video);
        feed.appendChild(videoItem);
    });
}

function createVideoItem(video) {
    const item = document.createElement('div');
    item.className = 'video-item';
    item.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2245%22%3E%3Crect fill=%22%23333%22 width=%2280%22 height=%2245%22/%3E%3C/svg%3E'">
        <div class="video-meta">
            <h3>${video.title}</h3>
            <p>${video.views} views • ${video.uploadDate}</p>
        </div>
    `;
    
    item.addEventListener('click', () => openVideoPlayer(video));
    
    return item;
}

function setupVideoPlayer() {
    const modal = document.getElementById('playerModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.addEventListener('click', closeVideoPlayer);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeVideoPlayer();
        }
    });
}

function openVideoPlayer(video) {
    const modal = document.getElementById('playerModal');
    const player = document.getElementById('videoPlayer');
    const title = document.getElementById('playerTitle');
    const desc = document.getElementById('playerDesc');
    const views = document.getElementById('viewCount');
    const date = document.getElementById('uploadDate');
    const likeBtn = document.getElementById('likeBtn');
    
    player.src = video.url;
    title.textContent = video.title;
    desc.textContent = video.description;
    views.textContent = `${video.views} views`;
    date.textContent = video.uploadDate;
    
    const isLiked = youtubeState.likes.has(video.id);
    likeBtn.classList.toggle('liked', isLiked);
    likeBtn.textContent = isLiked ? '👍 Liked' : '👍 Like';
    
    likeBtn.onclick = () => {
        if (youtubeState.likes.has(video.id)) {
            youtubeState.likes.delete(video.id);
            video.likes = Math.max(0, video.likes - 1);
        } else {
            youtubeState.likes.add(video.id);
            video.likes = (video.likes || 0) + 1;
        }
        saveVideos();
        likeBtn.classList.toggle('liked');
        likeBtn.textContent = youtubeState.likes.has(video.id) ? '👍 Liked' : '👍 Like';
    };
    
    modal.classList.add('active');
    player.play();
}

function closeVideoPlayer() {
    const modal = document.getElementById('playerModal');
    const player = document.getElementById('videoPlayer');
    player.pause();
    modal.classList.remove('active');
}

function setupUploadForm() {
    const uploadBtn = document.getElementById('uploadBtn');
    const titleInput = document.getElementById('videoTitle');
    const descInput = document.getElementById('videoDesc');
    const fileInput = document.getElementById('videoFile');
    const thumbnailInput = document.getElementById('thumbnail');
    const statusDiv = document.getElementById('uploadStatus');
    
    uploadBtn.addEventListener('click', async () => {
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        const videoFile = fileInput.files[0];
        const thumbnailFile = thumbnailInput.files[0];
        
        if (!title) {
            showUploadStatus('Please enter a title', 'error');
            return;
        }
        
        if (!videoFile) {
            showUploadStatus('Please select a video file', 'error');
            return;
        }
        
        if (videoFile.size > 52428800) {
            showUploadStatus('Video file is too large (max 50MB)', 'error');
            return;
        }
        
        uploadBtn.disabled = true;
        showUploadStatus('Uploading...', 'info');
        
        try {
            const videoBase64 = await fileToBase64(videoFile);
            
            let thumbnailBase64 = null;
            if (thumbnailFile) {
                thumbnailBase64 = await fileToBase64(thumbnailFile);
            } else {
                thumbnailBase64 = generateThumbnail(title);
            }
            
            const newVideo = {
                id: `video-${Date.now()}`,
                title: title,
                description: desc,
                url: videoBase64,
                thumbnail: thumbnailBase64,
                views: 0,
                uploadDate: new Date().toLocaleDateString(),
                likes: 0
            };
            
            youtubeState.videos.unshift(newVideo);
            saveVideos();
            
            titleInput.value = '';
            descInput.value = '';
            fileInput.value = '';
            thumbnailInput.value = '';
            
            showUploadStatus('Video uploaded successfully!', 'success');
            renderVideoFeed();
            setTimeout(() => {
                document.querySelector('[data-tab="feed"]').click();
            }, 1500);
            
        } catch (error) {
            console.error('Upload error:', error);
            showUploadStatus('Upload failed. Please try again.', 'error');
        } finally {
            uploadBtn.disabled = false;
        }
    });
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function generateThumbnail(title) {
    const canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 45;
    const ctx = canvas.getContext('2d');
    
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillRect(0, 0, 80, 45);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title.substring(0, 10), 40, 23);
    
    return canvas.toDataURL();
}

function showUploadStatus(message, type) {
    const statusDiv = document.getElementById('uploadStatus');
    statusDiv.textContent = message;
    statusDiv.className = `upload-status ${type}`;
}

function renderLibrary() {
    const libraryList = document.querySelector('.library-list');
    const emptyMsg = document.querySelector('.empty-library');
    
    const userVideos = youtubeState.videos;
    
    if (userVideos.length === 0) {
        libraryList.style.display = 'none';
        emptyMsg.style.display = 'flex';
        return;
    }
    
    libraryList.style.display = 'flex';
    emptyMsg.style.display = 'none';
    libraryList.innerHTML = '';
    
    userVideos.forEach((video, index) => {
        const libItem = document.createElement('div');
        libItem.className = 'library-item';
        libItem.innerHTML = `
            <img src="${video.thumbnail}" alt="${video.title}" class="library-thumbnail" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2260%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%2260%22/%3E%3C/svg%3E'">
            <div class="library-info">
                <h4>${video.title}</h4>
                <p>${video.views} views • ${video.uploadDate}</p>
                <div class="library-actions">
                    <button onclick="playVideoFromLibrary('${video.id}')">Play</button>
                    <button class="delete-btn" onclick="deleteVideo('${video.id}')">Delete</button>
                </div>
            </div>
        `;
        libraryList.appendChild(libItem);
    });
}

function playVideoFromLibrary(videoId) {
    const video = youtubeState.videos.find(v => v.id === videoId);
    if (video) {
        openVideoPlayer(video);
    }
}

function deleteVideo(videoId) {
    if (confirm('Are you sure you want to delete this video?')) {
        youtubeState.videos = youtubeState.videos.filter(v => v.id !== videoId);
        youtubeState.likes.delete(videoId);
        saveVideos();
        renderLibrary();
        renderVideoFeed();
    }
}

function openApp(url) {
    window.location.href = url;
}
