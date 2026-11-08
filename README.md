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

## CI/CD and deployment

Every push to a PR runs CI. Every merge to `main` builds the image on GitHub, pushes it to GHCR and deploys it to the DigitalOcean droplet over Tailscale. Cost: $0 (GitHub Actions on a public repo, GHCR, Tailscale Personal).

```
PR          -> verify (lint, tsc, next build) + docker build (no push, no secrets)
merge main  -> verify -> publish ghcr.io/kdgerona/portfolio-v2:{<sha>,latest}
                      -> deploy: join tailnet (ephemeral) -> ssh deploy@droplet -> scripts/deploy.sh <sha>
                         pull, up -d, wait for healthy, roll back to previous sha on failure, prune old images
```

Workflow: `.github/workflows/ci.yml`. Deploy script: `scripts/deploy.sh` (runs on the droplet). Offline test of the script, including rollback: `scripts/test-deploy.sh`.

How files reach the droplet: the deploy job copies `docker-compose.yml`, `Caddyfile` and `scripts/deploy.sh` from the exact commit being deployed into `~/portfolio` on the droplet (tar over SSH). There is no git checkout on the droplet. The image tag in use is recorded in `~/portfolio/.env` (`IMAGE_TAG=<sha>`).

Safety: deploy and publish jobs run only for `push` to `main`. Nothing uses `pull_request_target`, and the only secrets live in the deploy job, so fork PRs can never reach them or the droplet. Deploys are serialized by a `concurrency` group.

### One-time setup (Board)

Do these in order. Do not merge to `main` until step 8 is done, because the first merge triggers a real deploy.

**1. Tailscale account and tailnet policy.** Sign up at <https://login.tailscale.com> (Personal plan, free). Open *Access controls > JSON editor* and replace the policy with the one below, so CI can only reach the droplet's SSH port (`you@example.com` is your Tailscale login):

```json
{
  "tagOwners": {
    "tag:ci":      ["you@example.com"],
    "tag:droplet": ["you@example.com"]
  },
  "acls": [
    {"action": "accept", "src": ["autogroup:member"], "dst": ["*:*"]},
    {"action": "accept", "src": ["tag:ci"], "dst": ["tag:droplet:22"]}
  ]
}
```

Remove the default allow-all (`"*"`) rule: `*` also matches tagged devices, so it would let `tag:ci` reach everything. The first rule above keeps access for your own devices; the second limits `tag:ci` to the droplet on port 22.

**2. OAuth client for CI.** *Settings > Trust credentials > Credential > OAuth*. Step 1 (Settings): name it `github-ci`. Step 2 (Scopes): leave *Custom scopes*, tick nothing under General or Devices, scroll to **Keys > Auth Keys** and tick **Write** only. Choosing that scope makes a *Tags* field appear: select `tag:ci`. Generate, then save the client ID and secret for step 6 (the secret is shown once).

**3. Install Tailscale on the droplet** (SSH in the way you do today):

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --advertise-tags=tag:droplet --hostname=portfolio-droplet
# it prints a URL: open it in your browser, log in with the same Tailscale
# account as step 1 and approve the device. The command then returns by itself.
tailscale ip -4      # prints 100.x.y.z when it joined
```

Yes, this needs one browser login, once. Afterwards the droplet stays on the tailnet by itself (reboot-safe). In the admin console *Machines* tab, `portfolio-droplet` should show tag `tag:droplet`. If it shows your user instead of a tag, re-run `sudo tailscale up --advertise-tags=tag:droplet --hostname=portfolio-droplet --reset`. Optional: on that machine's `...` menu choose *Disable key expiry* so it never drops off the tailnet after 180 days.

**4. 1 GB swap on the droplet** (512 MB RAM safety margin):

```bash
sudo fallocate -l 1G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h
```

**5. Create the `deploy` user** (non-root, can run docker, key-only). Generate the key on your laptop; the private key goes into GitHub in step 6, never into the repo:

This is a key pair: the public half goes on the droplet (so it accepts GitHub), the private half goes into GitHub (step 6). Generating it on your laptop means the private key never sits on the server. Any machine you control works (not the droplet, unless you delete the private key afterwards).

```bash
# on your laptop
ssh-keygen -t ed25519 -N '' -C 'github-actions-deploy' -f ./deploy_key
cat deploy_key.pub        # paste into the command below
```

```bash
# on the droplet
sudo adduser --disabled-password --gecos '' deploy
sudo usermod -aG docker deploy
sudo install -d -m 700 -o deploy -g deploy /home/deploy/.ssh /home/deploy/portfolio
echo '<PASTE deploy_key.pub CONTENTS>' | sudo tee /home/deploy/.ssh/authorized_keys
sudo chown deploy:deploy /home/deploy/.ssh/authorized_keys && sudo chmod 600 /home/deploy/.ssh/authorized_keys
# if the site is currently running from another checkout, stop it first to free ports 80/443:
#   cd <old checkout> && docker compose down
ssh-keyscan -t ed25519 localhost 2>/dev/null | sed 's/^localhost/portfolio-droplet/'   # host key for DEPLOY_KNOWN_HOSTS
```

Note: `docker` group membership is root-equivalent on that host. That is accepted here because the key only works over the tailnet and only from `tag:ci`.

**6. GitHub repository secrets** (*Settings > Secrets and variables > Actions > New repository secret*):

| Secret | Value |
|---|---|
| `TS_OAUTH_CLIENT_ID` | OAuth client ID from step 2 |
| `TS_OAUTH_SECRET` | OAuth client secret from step 2 |
| `DEPLOY_HOST` | `portfolio-droplet` (MagicDNS name) or the tailnet IP from step 3 |
| `DEPLOY_SSH_KEY` | full contents of `deploy_key` (private key, including BEGIN/END lines) |
| `DEPLOY_KNOWN_HOSTS` | one line: `<DEPLOY_HOST value> ssh-ed25519 AAAA...` (output of the `ssh-keyscan` line in step 5, with the host name equal to `DEPLOY_HOST`) |

Then delete the local key: `shred -u deploy_key deploy_key.pub`.

**7. Confirm Tailscale SSH access from your laptop** (with Tailscale installed on it and logged in): `ssh deploy@portfolio-droplet 'docker ps'` must work using the same key.

**8. Merge the PR to `main`.** The first run publishes the image, but the deploy job's pull will fail until the package is public (step 9). That is expected on the first run only.

**9. Make the GHCR package public.** GitHub > your profile > *Packages* > `portfolio-v2` > *Package settings* > *Change visibility* > Public. Then re-run the failed workflow run (*Re-run failed jobs*). The droplet pulls without any registry login.

**10. Close public port 22** in the DigitalOcean Cloud Firewall (remove the inbound SSH rule), only after steps 7 and 9 succeeded. Keep ports 80 and 443 open. Recovery if you lock yourself out: DO web console (Droplet > Access > Launch console).

### After merging: check

- Actions tab: `CI` run on `main` is green for verify, publish and deploy.
- `ssh deploy@portfolio-droplet 'cd ~/portfolio && cat .env && docker compose ps'` shows `IMAGE_TAG=<merge commit sha>` and `portfolio` as `healthy`.
- <https://kdgerona.com> loads.

### Logs

- Deploy output: the `Deploy to droplet` job log in GitHub Actions.
- App/proxy logs on the droplet: `cd ~/portfolio && docker compose logs --tail 100 portfolio caddy`.

### Rolling back

Automatic: if the new container is not healthy within 180 s, `deploy.sh` restarts the previous SHA and the job fails (red run).

Manual, to any earlier commit (its image must still exist in GHCR; the droplet keeps only current + previous locally and pulls the rest):

```bash
ssh deploy@portfolio-droplet '~/portfolio/scripts/deploy.sh <full-40-char-sha>'
```

or re-run the workflow run of the good commit (*Re-run all jobs*). Note a later merge to `main` will deploy forward again, so revert the bad commit on `main` as well.

### Local development is unchanged

`docker compose up --build` still builds locally (the `build:` block is kept) and tags the result `ghcr.io/kdgerona/portfolio-v2:latest`.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
