<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-spinner v-if="images.length === 0" class="loading-spinner"></ion-spinner>

      <!-- Infinite Scroll -->
      <ion-infinite-scroll threshold="50px" @ionInfinite="loadMoreImages">
        <ion-infinite-scroll-content loading-spinner="bubbles" class="mt-16" loading-text="Загружаем ленту...">
          <!-- Image Element -->
          <div v-for="(image, index) in images" :key="index" class="image-container">
            <div class="video-info">
              <h3>{{ image.title }}</h3>
              <p>{{ image.description }}</p>
            </div>
            <img :src="image.src" alt="Image" class="feed-image" />
          </div>
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script>
import data from '../modules/global.js';
export default {
  data() {
    return {
      images: [] // Initial image
    };
  },
  async mounted() {
    const response = await this.$axios.get(data.api.hostname + '/api/videos/');
    this.videos = response.data.map(video => ({
      src: video.videofile.filepond.replace("http://", "https://"),
      title: video.title,
      description: video.description
    }));
    console.log('Videos:', this.videos);
    this.images.push(...this.videos);
    this.setupIntersectionObserver();
    this.scrollToFirstElement(); // Scroll to the first element
  },
  methods: {
    async loadMoreImages(event) {
      try {
        const response = await this.$axios.get(data.api.hostname + '/api/videos/');
        this.videos = response.data.map(video => ({
          src: video.videofile.filepond.replace("http://", "https://"),
          title: video.title,
          description: video.description
        }));
        console.log('Videos:', this.videos);
        this.images.push(...this.videos);
        console.log(this.images);
        event.target.complete();
        this.setupIntersectionObserver(); // Re-setup observer for new elements
        this.scrollToFirstElement(); // Scroll to the first element
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        this.loading = false;
      }
    },
    async loadAllVideos() {
      if (this.loading) return;
      this.loading = true;
    },
    setupIntersectionObserver() {
      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Trigger when 50% of the element is visible
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
      }, options);

      const containers = document.querySelectorAll('.image-container');
      containers.forEach(container => {
        observer.observe(container);
      });
    },
    scrollToFirstElement() {
      const firstElement = document.querySelector('.image-container');
      if (firstElement) {
        const offset = -50; // Offset for the bottom bar
        const elementPosition = firstElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition + offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  }
};
</script>

<style scoped>
.image-container {
  margin-top: -10vh;
  position: relative;
  height: 100vh;
  /* Full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  /* Hide overflow to crop sides */
}

.feed-image {
  height: 100%;
  /* 80% height */
  width: auto;
  /* Maintain aspect ratio */
}

.video-info {
  position: absolute;
  bottom: 17vh;
  width: 100%;
  text-align: left;
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  z-index: 1; /* Ensure the video-info is on top of the video */
}

.video-info h3 {
  margin: 5px 0;
  font-size: 1.2em;
}

.video-info p {
  font-size: 1em;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  margin-left: 45%;
}
</style>