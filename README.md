# aithernet-site

The **public static website** for Aithernet — served at
**https://www.aithernet.online** via GitHub Pages.

## What this repository is

This repository contains **only** the public marketing and documentation site:
static HTML, CSS and a `CNAME`. Nothing here is dynamic.

It is intentionally separate from the Aithernet product code.

## What this repository is NOT

This repository must **never** contain:

- backend / control-plane code, or any Python application code;
- the customer portal or administrator portal source;
- authentication, database, object-store, or ingestion code;
- secrets of any kind — `.env` files, API keys, SMTP credentials,
  signing keys, OAuth tokens, session secrets;
- customer data;
- developer-local paths, `localhost`/LAN URLs, or internal hostnames.

The dynamic services run separately and are **not** part of this repo:

| Host                         | What runs there                                  |
| ---------------------------- | ------------------------------------------------ |
| `www.aithernet.online`       | This static site (GitHub Pages)                  |
| `app.aithernet.online`       | Customer portal + hosted control plane (dynamic) |
| `admin.aithernet.online`     | Administrator portal (dynamic, access-protected) |

## Layout

```
public/
  index.html              overview / landing
  supported-systems.html  OS + runtime requirements
  hardware.html           qualified hardware matrix + profiles
  install.html            installation, verification, enrollment
  docs.html               documentation index
  api.html                public API overview
  rf-notices.html         RF component provenance + GPL source notice
  privacy.html            privacy & credential/data handling
  release-notes.html      release channel status
  CNAME                   custom domain (www.aithernet.online)
  .nojekyll               disable Jekyll processing
  assets/style.css        single stylesheet
.github/workflows/pages.yml  GitHub Pages deployment
```

## Preview locally

No build step is required. Serve the `public/` directory with any static
file server, for example:

```bash
cd public
python3 -m http.server 8000
# then open http://localhost:8000
```

(Use the site's relative root-absolute links, e.g. `/install.html`, which a
root-serving static server resolves correctly.)

## How deployment works

Pushing to `main` triggers `.github/workflows/pages.yml`, which uploads the
`public/` directory as a Pages artifact and deploys it with the official
GitHub Pages Actions flow. The custom domain is configured by:

1. setting the Pages custom domain to `www.aithernet.online` in the
   repository settings (or via the committed `public/CNAME`);
2. a DNS `CNAME` record `www` → `adityapawar0401.github.io` at the domain's
   DNS provider (Cloudflare).

## Truthfulness policy

Aithernet is in **invitation-only early access**. This site:

- offers **no** self-service signup and **no** downloads;
- claims only hardware and capabilities that have actually been tested;
- links access requests to email (`adityapawar@aithernet.online`) until the
  end-to-end request-access flow ships in the portal.
