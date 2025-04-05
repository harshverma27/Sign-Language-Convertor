# Sign Language Translator Chrome Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TensorFlow.js Version](https://img.shields.io/badge/TensorFlow.js-4.22.0-orange)](https://www.tensorflow.org/js)

A Chrome extension that converts sign language gestures in YouTube videos to text in real-time using machine learning.

![Demo](demo.gif) <!-- Replace with your actual demo GIF -->

---

## 🚀 Features

- 🔍 Real-time sign language detection from video sources  
- 🔡 Recognizes A-Z alphabet and 0-9 digits  
- 📺 Works with YouTube and other HTML5 video elements  
- 🤖 TensorFlow.js custom-trained model integration  
- ⚡ Optimized for 2-5 FPS frame processing  

---

## 🛠 Installation

### Prerequisites

- Google Chrome (v90+ recommended)
- Node.js (v16+ for development)

### Chrome Extension Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sign-language-translator.git
   ```

2. Open Chrome and navigate to:
   ```
   chrome://extensions/
   ```

3. Enable **Developer mode** (toggle in the top-right corner).

4. Click **"Load unpacked"** and select the `extension/` directory.

---

## 📦 Usage

1. Open any YouTube video.  
2. Click the extension icon to activate it.  
3. Sign language predictions will appear:
   - In the Chrome **DevTools console** (F12)
   - As an optional **overlay on the video player**

---

## 🧠 Technical Details

### Tech Stack

- **Machine Learning**: TensorFlow.js (WebGL backend)
- **Image Processing**: Canvas API + Custom preprocessing
- **Browser Integration**: Chrome Extension APIs (Manifest V3)
- **Build Tools**: Webpack (for production builds)

---

## 📁 Project Structure

```
sign-language-translator/
├── extension/               # Chrome extension files
│   ├── content.js           # Main processing script
│   ├── manifest.json        # Extension configuration
│   ├── model/               # TF.js model files
│   └── lib/                 # Third-party libraries
├── training/                # Model training code
│   ├── train_model.py       # Keras training script
│   └── dataset/             # Sample training data
├── docs/                    # Documentation
└── README.md                # This file
```

---

## 🧪 Model Training

- Custom dataset with **35 classes** (A-Z, 0-9)
- CNN with 3 convolutional layers
- Transfer learning from **MobileNetV2**
- Exported to **TensorFlow.js** for browser execution

### To retrain the model:

```bash
cd training/
python train_model.py --epochs 50 --batch_size 32
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository  
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**.  
See [LICENSE](LICENSE) for more information.

---

## 🙏 Acknowledgments

- [TensorFlow.js](https://www.tensorflow.org/js) team for browser ML support  
- Google Creative Lab for sign language dataset inspiration  
- Chrome Extension [developer documentation](https://developer.chrome.com/docs/extensions/)  

---

## 💡 Suggestions for Enhancement

- Add actual screenshots or demo GIF  
- Include system requirements  
- Add link to Chrome Web Store (if available)  
- Display FPS or accuracy metrics in UI  
- Provide support/contact information  
