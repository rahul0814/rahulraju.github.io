# Updating your portfolio

You only ever edit **`content.js`** (and drop images into `assets/img/`).
Then redeploy: drag the folder onto Netlify again, or `git push` if the site is connected to GitHub.

```
site/
├── content.js        ← all your text, links and lists (edit this)
├── assets/img/       ← your images
│   ├── certification/
│   ├── education/
│   └── projects/     (create it when you add project screenshots)
├── index.html        ← page shell (only for the <title> and description)
├── app.js            ← builds the page, no need to touch
├── styles.css        ← look and feel, no need to touch
└── netlify.toml
```

Things that update by themselves: years of experience, the certification count, the role and company counts, menu links, certificate filter buttons, job durations ("1 yr 5 mos") and "Present" labels.

---

## Add a certificate

1. Save the badge as `assets/img/certification/cka.png`.
2. In `content.js`, find `certifications` → `items` and add a block after the last one (note the comma before `{`):

```js
,{
  title: "Certified Kubernetes Administrator (CKA)",
  issuer: "CNCF",
  date: "2026-03",
  description: "Running and troubleshooting production Kubernetes clusters.",
  image: "assets/img/certification/cka.png",
  link: "https://www.credly.com/badges/your-badge-id/public_url",
  linkLabel: "Verify on Credly"
}
```

No image yet? Leave `image` out and a glowing badge with the issuer’s initials appears instead.
A new `issuer` automatically gets its own filter button.

## Add a job

Add a block at the **top** of `experience` → `items` (newest first). Leave `end: ""` for your current job.

```js
{
  role: "Lead DevOps Engineer",
  company: "New Company",
  url: "https://newcompany.com",
  start: "2026-12",
  end: "",
  points: [ "What you did, one sentence each." ],
  stack: ["EKS", "ArgoCD", "Terraform"]
},
```

Remember to set `end` on the previous job.

## Add a project

Add to `projects` → `items`:

```js
,{
  title: "GitOps platform on EKS",
  summary: "ArgoCD and Helm managing 40 services across three clusters.",
  icon: "argocd",
  image: "assets/img/projects/gitops.png",
  link: "https://github.com/rahul0814/gitops-platform",
  linkLabel: "View on GitHub",
  tags: ["EKS", "ArgoCD", "Helm"]
}
```

`image` and `link` are optional.

## Add a skill

Add to any group in `skills` → `groups`:

```js
{ name: "ArgoCD", icon: "argocd" }
```

Need a logo that isn’t included? Save the official SVG as `assets/img/icons/karpenter.svg` and use `{ name: "Karpenter", icon: "karpenter" }`. Devicon (devicon.dev) and each vendor’s brand page are good sources.
No logo at all? Use `{ name: "Karpenter", badge: "KP" }` for a text badge.
To add a whole group: `{ name: "Security", note: "devsecops", items: [ { name: "Trivy" }, { name: "Vault", icon: "vault" } ] }`

## Add a brand-new section

1. Add a block to `customSections`:

```js
{
  id: "talks",
  nav: "Talks",
  title: "Talks and articles.",
  subtitle: "Where I share what I’ve learned.",
  layout: "list",                 // "list", "cards" or "text"
  items: [
    { title: "Zero-downtime deploys on EKS", text: "AWS Community Day Chennai", date: "2026-08", icon: "kubernetes", link: "https://..." }
  ]
}
```

2. Add `"talks"` to the `sections` list at the top of `content.js`, wherever you want it to appear.

For `layout: "text"`, use `paragraphs: ["First paragraph.", "Second paragraph."]` instead of `items`.

## Hide or reorder sections

Edit the `sections` list. Remove an id to hide that section; move ids to reorder. The menu follows.

## If the page goes blank

There’s usually a missing comma or quote in `content.js`. The page shows a message saying so; press F12 and open **Console** to see the exact line.
