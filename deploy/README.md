# Deploy: mumtaaz.xyz

The portfolio runs on the **shared** EC2 host (`ssh applytracker-prod`) next
to confession, journal, store and applytracker. It adds one container and one
nginx vhost. It holds no port 80/443 itself, and it has no database and no
secrets.

```
Cloudflare (proxied, TLS) ──443──▶ host nginx ──▶ 127.0.0.1:32791 ──▶ portfolio-web-1
                                   (vhost: nginx-portfolio.conf)        nginx-unprivileged, read-only
                                                                        serves build/client
```

Files on the host, `~/apps/portfolio/`: `compose.prod.yml` (written by every
deploy) and `.env` (600; `IMAGE_TAG` and `HOST_PORT`, created by the first
deploy if missing).

## What runs where

| Step | Where | What |
|---|---|---|
| Content check, prerender, image | GitHub Actions | `npm ci`, `content:check`, `npm run build` inside `docker build`, then `scripts/smoke-image.sh` runs the image read-only and checks status codes, redirects, headers and caching |
| Image registry | GHCR | `ghcr.io/aremanzh/myportfolio:<sha12>`, newest 5 kept |
| Deploy | Host, via SSM | `docker pull`, `up -d`, wait for healthy, roll back on failure, smoke test through the host nginx |

The host never builds anything (1.9 GB RAM, shared), and port 22 is never
opened to CI. A CMS edit is a commit to `main`, so it goes through the same
pipeline: a bad edit fails `content:check` in CI and never reaches the host.

## 1. DNS (Cloudflare)

`mumtaaz.xyz` (A, apex) and `www` (CNAME to the apex or A) pointing at the
host, **proxied**. SSL/TLS mode Full (strict) or Full: the host serves the
Cloudflare origin certificate.

⚠️ If the apex currently points at another host (the old site), switching
these records is the cutover. Do it after step 4 passes on the host.

## 2. One-time prerequisites

1. **IAM.** Same deploy role as confession-api and JobSphere. Add this repo's
   main branch to the `token.actions.githubusercontent.com:sub` condition in
   the role's trust policy. The condition must be a JSON **list**.

   ⚠️ Check which subject format this repo uses before writing it. The
   format must match exactly:
   ```sh
   gh api repos/aremanzh/myPortfolio/actions/oidc/customization/sub
   ```
   - `use_default: true` gives `repo:aremanzh/myPortfolio:ref:refs/heads/main`.
   - The immutable format, as confession-api has, gives
     `repo:aremanzh@<owner-id>/myPortfolio@<repo-id>:ref:refs/heads/main`.
2. **GitHub → Settings → Secrets and variables → Actions → Variables:**
   `AWS_DEPLOY_ROLE_ARN`, `EC2_INSTANCE_ID`, `AWS_REGION`. Use the same values
   as confession-api. While `AWS_DEPLOY_ROLE_ARN` is empty, the deploy job is
   skipped and only the image is built.
3. **Host GHCR login.** SSM runs as root, so log in as root:
   ```sh
   sudo docker login ghcr.io -u aremanzh   # GitHub token, read:packages only
   ```
   If root already logged in for confession-api with a classic token holding
   `read:packages`, that login covers this package as well.
4. **Host port.** `32791` must be free:
   ```sh
   sudo ss -ltn | grep 3279
   ```
   If it is taken, set `HOST_PORT` in `~/apps/portfolio/.env` and change
   `proxy_pass` in the vhost to match.

## 3. nginx vhost

```sh
scp deploy/nginx-portfolio.conf applytracker-prod:/tmp/
ssh applytracker-prod
sudo grep -rl "server_name.*\bmumtaaz.xyz" /etc/nginx/sites-enabled/   # nothing else may claim the apex
sudo cp /tmp/nginx-portfolio.conf /etc/nginx/sites-available/portfolio
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
sudo nginx -t && sudo systemctl reload nginx
```

The origin certificate in `/etc/cloudflare/live/` must cover the apex as well
as `*.mumtaaz.xyz`. A wildcard alone does not match `mumtaaz.xyz`. Check:

```sh
sudo openssl x509 -in /etc/cloudflare/live/mumtaaz.xyz.pem -noout -ext subjectAltName
```

## 4. First deploy

Push to `main`, or Actions → deploy → Run workflow. The first run creates
`~/apps/portfolio` and `.env`. Before the vhost exists, the final smoke test
fails even though the container is up; install the vhost and re-run.

## Rollback

- **Automatic.** If the new container is not healthy within about 60 s, the
  deploy puts the previous `IMAGE_TAG` back, restarts it and fails the
  workflow.
- **Manual.** Re-run the deploy workflow on an older commit, or on the host:
  ```sh
  cd ~/apps/portfolio
  docker images ghcr.io/aremanzh/myportfolio        # current and previous are kept
  sudo sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=<tag>/' .env
  sudo docker compose -f compose.prod.yml --env-file .env up -d
  ```

## Checklist

- [ ] `curl -I https://mumtaaz.xyz/` returns 200.
- [ ] `curl -I https://mumtaaz.xyz/no-such-page` returns 404. Unknown URLs get
      a real 404 status, with the app's 404 page as the body.
- [ ] `https://www.mumtaaz.xyz/works` returns 301 to `https://mumtaaz.xyz/works`.
- [ ] `https://mumtaaz.xyz/admin` returns 301 to `/admin/`, and the CMS loads.
- [ ] `sudo ss -ltn | grep 32791` shows `127.0.0.1:32791` only.
- [ ] The other apps still return 200 after `nginx reload`.

## Locally

```sh
docker compose up --build                  # production image on http://localhost:8080
docker build -t portfolio:test . && scripts/smoke-image.sh portfolio:test
```
