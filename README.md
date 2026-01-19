# Marki Mark 0.1.0

<img src="app-icon.png" width="150">

MarkiMark is a high-performance, cross-platform Markdown viewer and editor designed for speed and a premium user experience. It leverages a modern desktop stack to provide a native feel on Windows and Linux.

## 🚀 Core Technology Stack

- Backend: Rust (via Tauri 2.0) for native performance, secure file I/O, and a small binary footprint.
- Frontend: React 19 and TypeScript for a robust, type-safe reactive UI.
- Styling: Tailwind CSS v4 using the high-performance Oxide engine for a sleek, "glassmorphic" aesthetic.
- Markdown Engine: react-markdown with GFM (GitHub Flavored Markdown) support and highlight.js for beautiful code syntax highlighting.

## ✨ Key Features

- Multi-Tab Interface: Open and manage multiple Markdown documents simultaneously with a familiar, high-contrast tab bar.
- Live Preview & Editor: Easily switch between a polished, typography-optimized view and a distraction-free mono-spaced editor.
- Session Persistence: Automatically remembers your open tabs and the exact file you were working on, restoring your workspace instantly upon restart.
- Smart Media Handling: Resolves local image paths automatically, allowing you to view images embedded in your local
  .md files without configuration.
- Adaptive UI: A beautiful, theme-aware interface that supports Dark Mode and Light Mode, with smooth transitions and high-contrast accessibility.
- Productivity Tools:
  - Zoom Control: Precise zooming (In/Out/Reset) for comfortable reading.
  - Recent Files: Quick access to your most recently edited documents.
  - Print-Ready: Specialized CSS to ensure your Markdown looks perfect when exported to physical or PDF formats.

## 🛠️ Built with:

- Rust v1.92.0
- Tauri v2.x
- Nodejs v24.x
- React v19.2.1
- TailwindCSS v4.x

## Getting Started

To replicate the development environment or build the application from source, follow these steps.

### Prerequisites

#### Windows

1.  **Node.js**: [Download and install](https://nodejs.org/) (LTS recommended).
2.  **Rust**: Install via [rustup.rs](https://rustup.rs/).
3.  **C++ Build Tools**: Install the "Desktop development with C++" workload from the [Visual Studio Installer](https://visualstudio.microsoft.com/visual-cpp-build-tools/).

#### Linux (Ubuntu/Debian)

Install the necessary system dependencies:

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
```

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/Opie-LocalSecurity/marki-mark.git
    cd marki-mark
    ```

2.  **Install Frontend dependencies**:
    ```bash
    npm install
    ```

### 🚀 Running the App

To start the app in development mode with Hot Module Replacement (HMR):

```bash
npm run tauri dev
```

### 🏗️ Building for Production

To create a production-ready installer:

```bash
npm run tauri build
```

## To Do

- [x] Documenting this file
- [ ] Testing under linux
