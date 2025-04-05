
if (typeof window.Polymer !== 'undefined') {
  window.Polymer = undefined;
  console.log('Disabled Polymer legacy warnings');
}
// Force WebGL backend and configure environment
async function initializeTF() {
  try {
    tf.env().set('WEBGL_CPU_FORWARD', false);
    tf.env().set('WEBGL_PACK', true);
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('TF.js initialized with backend:', tf.getBackend());
  } catch (error) {
    console.error('TF.js initialization failed:', error);
    throw error;
  }
}
const tf = window.tf; // Get TF from global scope

class SignLanguageTranslator {
  constructor() {
    this.model = null;
    this.labels = null;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.isProcessing = false;
    this.lastFrameTime = 0;
  }
  async initialize() {
    try {
      await initializeTF()
      await tf.setBackend('webgl'); // Force WebGL instead of WASM
      await tf.ready();
      console.log('Backend:', tf.getBackend());
      // Verify TensorFlow.js is properly loaded
      if (!tf?.loadGraphModel) {
        throw new Error('TensorFlow.js not loaded. Check manifest file ordering.');
      }

      // Load model and labels in parallel
      [this.model, this.labels] = await Promise.all([
        tf.loadGraphModel(chrome.runtime.getURL('model/model.json')),
        fetch(chrome.runtime.getURL('labels.json')).then(r => r.json())
      ]);

      console.log('Model and labels loaded successfully');
    } catch (error) {
      console.error('Initialization failed:', error);
      throw error;
    }
  }

  preprocessFrame(video) {
    return tf.tidy(() => {
      if (!video.videoWidth || !video.videoHeight) {
        throw new Error('Video frame has invalid dimensions');
      }

      // Maintain aspect ratio while resizing
      const aspectRatio = video.videoWidth / video.videoHeight;
      const [newWidth, newHeight] = aspectRatio > 1
        ? [150, 150 / aspectRatio]
        : [150 * aspectRatio, 150];

      // Clear and draw video frame
      this.ctx.clearRect(0, 0, 150, 150);
      this.ctx.drawImage(
        video,
        0, 0, video.videoWidth, video.videoHeight,
        (150 - newWidth) / 2, (150 - newHeight) / 2,
        newWidth, newHeight
      );

      return tf.browser.fromPixels(this.canvas)
        .expandDims(0) // Add batch dimension
        .toFloat()
        .div(255.0); // Normalize to [0,1]
    });
  }

  async predict(video) {
    return tf.tidy(() => {
      const tensor = this.preprocessFrame(video);
      // Use synchronous execution
      const prediction = this.model.execute(tensor);
      const data = prediction.arraySync()[0];
      tensor.dispose();
      prediction.dispose();
      return data;
    });
  }

  deepQueryVideos(root = document) {
    const videos = Array.from(root.querySelectorAll('video'));
    root.querySelectorAll('*').forEach(element => {
      if (element.shadowRoot) {
        videos.push(...this.deepQueryVideos(element.shadowRoot));
      }
    });
    return videos;
  }

  start() {
    const processVideo = async (video) => {
      if (!video.dataset.slProcessed) {
        video.dataset.slProcessed = true;
        console.log('Found video element:', video);

        const processFrame = async () => {
          try {
            const prediction = await this.predict(video);
            if (prediction) {
              console.log(`[${new Date().toISOString()}] Predicted:`, prediction);
            }
          } finally {
            requestAnimationFrame(processFrame);
          }
        };

        requestAnimationFrame(processFrame);
      }
    };

    // Initial scan with deep shadow DOM query
    this.deepQueryVideos().forEach(processVideo);

    // Mutation observer for dynamic content
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.deepQueryVideos(node).forEach(processVideo);
          }
        });
      });
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });

    console.log('Sign language translator activated');
  }
}

// Startup sequence with proper error handling
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!window.tf) {
      throw new Error('TensorFlow.js not loaded - check manifest.json');
    }

    await tf.ready();
    console.log('TF.js backend:', tf.getBackend());

    const translator = new SignLanguageTranslator();
    await translator.initialize();
    translator.start();
  } catch (error) {
    console.error('Extension failed to initialize:', error);
  }
});