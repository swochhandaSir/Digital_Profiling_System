# Local setup

Follow the root README. Start MongoDB, configure `Backend/.env`, seed accounts using `npm run seed`, then start with `npm run dev`. The API health endpoint is `http://localhost:4000/api/health`.

For production, serve the Vite build from a static host and the API behind HTTPS. Set `CLIENT_ORIGIN` to the exact frontend origin and set `VITE_API_URL` at build time. Store secrets in the deployment secret manager. Configure database backups and a documented retention process before loading actual citizen data.
