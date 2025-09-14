# Shopify Sync Vue.js Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-green)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-purple)](https://vitejs.dev/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.11-blue)](https://element-plus.org/)

A Vue.js frontend application to view and synchronize Shopify products.

This project was developed as part of a **technical assessment**: synchronize Shopify products using **Vue.js** for the frontend and **Laravel** for the backend (visit the repo here: [shopify-sync-backend-laravel](https://github.com/luvittor/shopify-sync-backend-laravel)).

The application provides a clean interface to view, sync, and clear products from the Laravel backend API.

## Requirements

* Node.js 20 or higher
* npm 10 or higher
* Vue.js 3.5
* TypeScript 5.9
* Vite 7.1
* Element Plus 2.11

## Features

* Display products in a responsive table with pagination
* Sync products from backend API
* Clear all products from local database
* Real-time loading states and user feedback
* Modern UI with Element Plus components
* TypeScript support for better development experience

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file and configure the backend API URL:
   * `VITE_API_BASE_URL` – Your Laravel backend URL (default: http://localhost:8000)
4. Start the development server with `npm run dev`
5. Access the application at `http://localhost:5173`

## Available Scripts

* **`npm run dev`** – Start development server with hot reload
* **`npm run build`** – Build for production

## Project Structure

```
src/
├── components/
│   └── ProductPanel.vue   # Main product management interface
├── services/
│   └── api.ts             # API service for backend communication
├── App.vue                # Root component
├── main.ts                # Application entry point
└── style.css              # Global styles
```

## API Integration

The frontend communicates with the Laravel backend through these endpoints:

* **GET** `/api/v1/products` – Fetch products with pagination
* **POST** `/api/v1/products/sync` – Trigger product synchronization
* **DELETE** `/api/v1/products/clear` – Clear all products

All API responses include proper error handling and loading states for better user experience.

## UI Components

The application uses **Element Plus** for consistent and professional UI components:

* **Table** – Displays products with sorting and formatting
* **Buttons** – Action buttons with loading states
* **Messages** – Success and error notifications
* **Loading** – Visual feedback during API operations

## Architecture Decisions

The project follows Vue 3 composition API patterns and TypeScript best practices:

* `ProductPanel.vue` manages the main product interface and state
* `api.ts` handles all backend communication with proper typing
* Components use reactive state management with Vue's composition API
* TypeScript interfaces ensure type safety across the application

### GitHub Actions

This project is set up to deploy/audit automatically using GitHub Actions:
* [deploy.yml](.github/workflows/deploy.yml)
* [audit.yml](.github/workflows/audit.yml)

## Credits

Created for technical assessment by **Luciano Vettoretti**.

* [LinkedIn](https://www.linkedin.com/in/luvittor/)