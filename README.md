# Timing Chart Editor

[English](#english) | [日本語](#japanese)

<a name="english"></a>

## 🇬🇧 English

**Timing Chart Editor** is a desktop application designed for creating and editing timing charts efficiently. It is built using modern web technologies including Electron, Next.js, and TypeScript.

### Features

- **Visual Editing**: Create timing charts with an intuitive graphical interface.
- **Cross-Platform**: Runs on macOS and Windows.
- **Modern Stack**: Built with React, Material UI, and Konva for high performance and responsiveness.

### Tech Stack

- **Electron**: Desktop application framework.
- **Next.js**: React framework for the renderer process.
- **TypeScript**: Static typing for better code quality.
- **Rent-Konva**: Canvas library for drawing charts.
- **Material UI**: UI component library.

### Getting Started

#### Prerequisites

- Node.js (v18 or later recommended)
- npm

#### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd timing_chart_editor
npm install
```

#### Development

To start the application in development mode with hot-reloading:

```bash
npm run dev
```

#### Build & Distribution

To build the application for production:

```bash
# Build for current OS
npm run build
npm run dist

# Build for Windows (x64)
npm run build-win
```

### Project Structure

- `electron-src/`: Main process code (Electron).
- `renderer/`: Renderer process code (Next.js pages and components).
- `renderer/pages/chart/`: Logic for the timing chart editor.

---

<a name="japanese"></a>

## 🇯🇵 日本語

**Timing Chart Editor** は、タイミングチャートを効率的に作成・編集するために設計されたデスクトップアプリケーションです。Electron、Next.js、TypeScript などの最新の Web 技術を使用して構築されています。

### 特徴

- **視覚的な編集**: 直感的なグラフィカルインターフェースでタイミングチャートを作成できます。
- **クロスプラットフォーム**: macOS および Windows で動作します。
- **モダンな技術スタック**: React、Material UI、Konva を採用し、高いパフォーマンスと応答性を実現しています。

### 使用技術

- **Electron**: デスクトップアプリケーションフレームワーク。
- **Next.js**: レンダラープロセス用の React フレームワーク。
- **TypeScript**: コード品質向上のための静的型付け。
- **React-Konva**: チャート描画用の Canvas ライブラリ。
- **Material UI**: UI コンポーネントライブラリ。

### 始め方

#### 前提条件

- Node.js (v18 以降推奨)
- npm

#### インストール

リポジトリをクローンし、依存関係をインストールします。

```bash
git clone <repository-url>
cd timing_chart_editor
npm install
```

#### 開発

開発モード（ホットリロード有効）でアプリケーションを起動するには：

```bash
npm run dev
```

#### ビルドと配布

本番用にアプリケーションをビルドするには：

```bash
# 現在の OS 向けにビルド
npm run build
npm run dist

# Windows (x64) 向けにビルド
npm run build-win
```

### プロジェクト構成

- `electron-src/`: メインプロセスのコード (Electron)。
- `renderer/`: レンダラープロセスのコード (Next.js のページとコンポーネント)。
- `renderer/pages/chart/`: タイミングチャートエディタのロジック。
