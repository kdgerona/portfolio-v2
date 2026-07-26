This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Run with Docker

`docker compose up --build` runs two services: the `portfolio` app (internal only) behind `caddy`, which terminates TLS and automatically obtains/renews a Let's Encrypt certificate for the domain in `Caddyfile` (currently `kdgerona.com` / `www.kdgerona.com`). For this to work in production, that domain's DNS must point at the host, and ports 80/443 must be reachable from the internet.

```bash
docker compose up --build
```

For local testing without a domain, run the app container directly instead (bypasses Caddy/TLS):

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 portfolio
```

Open [http://localhost:3000](http://localhost:3000) once the container is running.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
