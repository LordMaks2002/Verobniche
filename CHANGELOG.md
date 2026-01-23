# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-01-23

### Added

-   **Project Initialization**: Set up a new Vite project with a Vanilla JS template.
-   **Clock Module**: Implemented a live clock module (`src/modules/clock.js`) to display the current time, updating every second.
-   **Weather Module**: Implemented a weather module (`src/modules/weather.js`) to fetch and display weather data from the Open-Meteo API for a hardcoded location (Kyiv).
-   **PWA Capabilities**:
    -   Integrated `vite-plugin-pwa` to transform the application into a Progressive Web App.
    -   Configured the plugin to automatically generate a service worker (`sw.js`) for offline caching using Workbox.
    -   Set up `@vite-pwa/assets-generator` to automatically create all necessary PWA icons and splash screen assets from a single `vite.svg` source file.
    -   Created `vite.config.js` and `pwa-assets.config.js` to manage the build and PWA-specific configurations.
-   **Documentation**:
    -   Created `PROMPTS.md` to keep a record of the prompts used with the Gemini CLI.
    -   Initialized this `CHANGELOG.md` to track notable changes to the project.

### Changed

-   **Application Entry Point (`src/main.js`)**: Modified to initialize the clock and weather modules and render them in the main application div.
-   **Package Dependencies**: Added `vite-plugin-pwa` and `@vite-pwa/assets-generator` as development dependencies in `package.json`.
-   **Git History**: Rewrote the Git history to be more granular and reflect the development process more accurately, breaking down one large commit into several smaller, more descriptive commits.
