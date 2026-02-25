# 👁️ Vision Trainer: Browser-Based Intelligence

**Vision Trainer** is a high-performance, privacy-focused Teachable Machine clone that allows anyone to train and deploy machine learning models directly in their browser. Built with a premium aesthetic and powered by TensorFlow.js, it transforms your webcam into an intelligent sensor within seconds.

🚀 **Live Demo:** [https://unique-dark-theme-ui-1.vercel.app](https://unique-dark-theme-ui-1.vercel.app)

---

## ✨ Key Features

-   🧠 **Real-time On-Device ML:** Powered by **TensorFlow.js** and **MobileNet**. Your images never leave your computer—all training and inference happens locally.
-   📸 **Burst Capture Mode:** Hold down the capture button to rapidly gather training samples, making data collection seamless and fast.
-   💾 **Model Portability (Export/Import):** Save your trained models as `.json` files and reload them later or share them with others to skip the training phase.
-   🎨 **Premium Aesthetic:** A stunning dark-mode interface with glassmorphism effects, smooth animations (Framer Motion), and a hybrid slate/dark theme for maximum readability.
-   ⚡ **Optimized Performance:** Uses a lightweight MobileNet V1 architecture (alpha 0.25) for ultra-fast performance even on lower-end devices.

---

## 🛠️ Technology Stack

-   **Frontend:** [Next.js](https://nextjs.org/) (App Router)
-   **AI Engine:** [TensorFlow.js](https://www.tensorflow.org/js)
-   **Base Model:** [MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) (Transfer Learning)
-   **Classifier:** KNN Classifier
-   **Styling:** Tailwind CSS + Lucide Icons
-   **Animations:** Framer Motion

---

## 🚀 How to Use

1.  **Collect Data:** Create classes (e.g., "Empty", "My Face", "Phone") and use your webcam to capture samples. Use the **Hold to Capture** feature for efficiency.
2.  **Train:** Click "Start Training". The specialized AI will learn the visual patterns of your classes using transfer learning.
3.  **Predict:** Scroll to the Inference section. The live webcam feed will now show real-time confidence scores for each class.
4.  **Export:** Go to the Model Intelligence section to download your model for future use.

---

## 💻 Local Development

First, clone the repository and install dependencies:

```bash
npm install
# or
pnpm install
```

Run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🔐 Privacy Note

Privacy is at the core of Vision Trainer. No images are ever uploaded to a server. The "Brain" of the AI lives entirely within your browser tab. When you close the tab, your data is gone unless you explicitly choose to **Export** your model.

---

Built with ❤️ 
