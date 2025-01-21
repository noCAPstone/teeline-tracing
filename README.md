# Teeline Tracing

![Teeline Tracers](./public/ttlogo.png)


## Overview
Teeline Tracing is a web application designed to help users learn the Teeline shorthand alphabet. Inspired by Duolingo's tracing system for non-Romanized characters (e.g., learning Hanzi in Mandarin) and Teeline-Online's resources, this app provides an interactive and engaging way to practice shorthand writing.

Using a handwriting component built with the Konva canvas library, users can trace SVG-based letter cards to learn Teeline symbols. Traces are automatically categorized into "good" and "need more practice" piles, allowing users to focus on areas where they need improvement.

## Features
- **Interactive Tracing:** Users can trace over SVG letters to practice writing Teeline symbols.
- **Feedback System:** Traces are evaluated and sorted into two piles: "good" and "need more practice."
- **Teeline Alphabet:** The app focuses on the Teeline shorthand alphabet, using SVGs sourced from Teeline-Online.
- **User-Friendly Interface:** A simple and intuitive design makes it easy for anyone to get started.

## Inspiration
This project draws inspiration from:
- **Duolingo:** Specifically, the tracing system used for learning Hanzi in Mandarin, which allows users to interactively practice character writing.
- [**Teeline-Online:**](https://teeline.online/) The base SVGs for the Teeline symbols were sourced from this website, which provides a wealth of resources for learning Teeline shorthand.

## Technologies Used
- **TypeScript, React, and Vite:** For building the app's frontend.
- **Konva Canvas Library:** For creating the handwriting and tracing components.
- **SVG Graphics:** For rendering Teeline symbols.

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/toeten/teeline-practice-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd teeline-practice-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the app in your browser at `http://localhost:3000`.

## Usage
1. Select a letter card to begin tracing.
2. Use your mouse or touch input to trace the displayed symbol.
3. Complete your trace and see instant feedback on accuracy.
4. Continue practicing until all letters are in the "good" pile!

## Acknowledgments
- **Duolingo:** For inspiring the interactive tracing feature.
- **Teeline-Online:** For providing the SVG resources that form the foundation of this app.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---
Happy learning and tracing!

