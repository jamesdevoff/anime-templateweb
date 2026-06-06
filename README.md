# James Portal

A modern, high-tech portfolio interface for James Official, featuring a custom dark mode, a glitched boot sequence, an ambient soundscape, and a fully interactive project library.

## Deployment Tutorial

This application is built with standard web technologies (React, Vite, Tailwind CSS) and can be easily deployed to any host that supports static sites or Node.js containers.

### Prerequisites
- Node.js (v18 or higher recommended)
- `npm` or `yarn`

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open the browser to the provided local URL (typically `http://localhost:3000`).

### Production Build

To bundle the application for production deployment:

```bash
npm run build
```

This will create an optimized build of the site in the `dist` folder. You can serve this static directory using any standard web server like Nginx, Apache, or a cloud static hosting provider.

### Containerized Deployment (Docker/Cloud)

While a `Dockerfile` isn't included by default, the app compiles to a standard express server if you run `npm run start`. It is fully compatible with platform-as-a-service (PaaS) providers that support container builds via `npm run build` & `npm run start`.

1. **Build the image (Standard workflow):**
   ```bash
   docker build -t james-portal .
   ```
2. **Run the container:**
   ```bash
   docker run -p 3000:3000 james-portal
   ```

### Configuration

- **Images and SEO:** Open Graph data and site metadata are located in `index.html`. You can replace `public/james_tech.png` to update your link preview across social platforms.
- **Projects List:** To add or manage projects, update the `projectList` array in `src/Projects.tsx`.
- **Socials:** Add your WhatsApp number and adjust your Telegram/GitHub links directly in `src/Dashboard.tsx` in the social toggle menu.

## Technologies Used
- React (18+)
- Vite
- Tailwind CSS
- Framer Motion (for bootup and transition animations)
