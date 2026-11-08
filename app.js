/* =========================================================================
   Portfolio engine. You normally don't need to edit this file.
   All content comes from content.js.
   ========================================================================= */
(() => {
  'use strict';
  const D = window.PORTFOLIO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  if (!D) {
    $('#preloader')?.remove();
    document.body.classList.remove('locked');
    $('#app').innerHTML = '<div class="wrap" style="padding:160px 24px"><h2>content.js didn’t load</h2><p class="sec-lede">There’s probably a missing comma or quote in content.js. Open the browser console (F12) to see the line number.</p></div>';
    return;
  }

  /* ---------------- helpers ---------------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arr = a => Array.isArray(a) ? a : [];
  const exp = arr(D.experience?.items);
  const certs = arr(D.certifications?.items);

  const parseYM = s => { if (!s) return null; const [y, m] = String(s).split('-').map(Number); return y ? new Date(y, (m || 1) - 1, 1) : null; };
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const fmtYM = s => { const d = parseYM(s); return d ? `${MONTHS[d.getMonth()]} ${d.getFullYear()}` : esc(s); };
  const range = (a, b) => `${a ? fmtYM(a) : ''}${a ? ' – ' : ''}${b ? fmtYM(b) : (a ? 'Present' : '')}`;
  function duration(a, b) {
    const s = parseYM(a); if (!s) return '';
    const e = parseYM(b) || new Date();
    let m = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
    if (!b) m += 1;
    m = Math.max(1, m);
    const y = Math.floor(m / 12), r = m % 12;
    return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', r ? `${r} mo${r > 1 ? 's' : ''}` : ''].filter(Boolean).join(' ');
  }

  const earliest = exp.map(e => parseYM(e.start)).filter(Boolean).sort((a, b) => a - b)[0];
  const TOK = {
    years: (D.profile && String(D.profile.experienceYears || '').trim()) || (earliest ? Math.max(0, Math.floor((Date.now() - earliest) / (365.25 * 864e5))) : 0),
    roles: exp.length,
    companies: new Set(exp.map(e => (e.company || '').trim().toLowerCase())).size,
    certs: certs.length,
    name: D.profile?.name || ''
  };
  const fill = s => String(s ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in TOK ? TOK[k] : m));
  const md = s => esc(fill(s)).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const initials = s => /^[A-Za-z0-9]{1,4}$/.test(String(s || '').trim()) ? String(s).trim().toUpperCase() : String(s || '?').replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 3).toUpperCase() || '•';

  const ICONS = {
    aws: 'amazonwebservices/amazonwebservices-original-wordmark', kubernetes: 'kubernetes/kubernetes-plain', k8s: 'kubernetes/kubernetes-plain',
    docker: 'docker/docker-original', terraform: 'terraform/terraform-original', jenkins: 'jenkins/jenkins-original',
    grafana: 'grafana/grafana-original', prometheus: 'prometheus/prometheus-original', gitlab: 'gitlab/gitlab-original',
    github: 'github/github-original', python: 'python/python-original', bash: 'bash/bash-original', linux: 'linux/linux-original',
    git: 'git/git-original', ansible: 'ansible/ansible-original', helm: 'helm/helm-original', argocd: 'argocd/argocd-original',
    azure: 'azure/azure-original', gcp: 'googlecloud/googlecloud-original', nginx: 'nginx/nginx-original', vault: 'vault/vault-original',
    go: 'go/go-original-wordmark', java: 'java/java-original', nodejs: 'nodejs/nodejs-original', mysql: 'mysql/mysql-original',
    postgresql: 'postgresql/postgresql-original', redis: 'redis/redis-original', mongodb: 'mongodb/mongodb-original',
    elasticsearch: 'elasticsearch/elasticsearch-original', vscode: 'vscode/vscode-original', jira: 'jira/jira-original',
    sonarqube: 'sonarqube/sonarqube-original', kafka: 'apachekafka/apachekafka-original', apache: 'apache/apache-original',
    ubuntu: 'ubuntu/ubuntu-plain', redhat: 'redhat/redhat-original', powershell: 'powershell/powershell-original',
    windows: 'windows11/windows11-original', yaml: 'yaml/yaml-original', githubactions: 'githubactions/githubactions-original'
  };
  const iconUrl = k => {
    if (!k) return null;
    k = String(k).trim();
    if (/^https?:\/\//.test(k) || k.includes('/') || /\.(png|jpe?g|svg|webp|gif)$/i.test(k)) return k;
    const key = k.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!key) return null;
    // any name works: drop my-tool.svg into assets/img/icons/ and use icon: 'my-tool'
    // official logos are bundled in assets/img/icons/ (no outside requests needed)
    return (window.PORTFOLIO_ICONS && window.PORTFOLIO_ICONS[key]) || `assets/img/icons/${key}.svg`;
  };
  // image that turns into a text badge if it fails to load
  const img = (src, abbr, alt = '') => `<img src="${esc(src)}" alt="${esc(alt)}" data-abbr="${esc(abbr)}" loading="lazy">`;

  const SOCIAL = {
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.3 8.4L23 22h-6.6l-5.2-6.8L5.2 22H2l7.8-9L1.5 2h6.7l4.7 6.2zm-1.1 18h1.8L7.3 3.9H5.4z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>'
  };
  SOCIAL.twitter = SOCIAL.x;
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  const DOWNLOAD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14"/></svg>';
  const CHECK = '<svg class="chk" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>';
  const STAGE_ICONS = {
    commit: '<circle cx="12" cy="12" r="3"/><path d="M3 12h6m6 0h6"/>',
    build: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
    test: '<path d="M9 3h6M10 3v6L4 19a1.5 1.5 0 0 0 1.3 2h13.4a1.5 1.5 0 0 0 1.3-2L14 9V3"/>',
    scan: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
    deploy: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2m9-14c-4 0-8 3-10 8l4 4c5-2 8-6 8-10V4z"/>',
    monitor: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
    _: '<circle cx="12" cy="12" r="4"/>'
  };

  const P = D.profile || {};
  const resolveHref = h => h === 'resume' ? P.resume : h;
  const ext = h => /^https?:|\.pdf$/i.test(h || '') ? ' target="_blank" rel="noopener"' : '';
  const head = (id, s) => `
    <p class="path reveal">~/${esc(id)}</p>
    ${s.title ? `<h2 class="reveal scramble">${md(s.title)}</h2>` : ''}
    ${s.subtitle ? `<p class="sec-lede reveal">${md(s.subtitle)}</p>` : ''}`;
  const tags = list => arr(list).length ? `<div class="stack">${arr(list).map(t => `<span>${esc(t)}</span>`).join('')}</div>` : '';
  const iconBox = (icon, label, cls = 'proj-ic') => {
    const u = iconUrl(icon);
    return `<span class="${cls}">${u ? img(u, initials(label)) : `<span>${esc(initials(label))}</span>`}</span>`;
  };

  /* ---------------- section renderers ---------------- */
  const R = {};

  /* DevOps infinity loop: a light runs Dev -> Ops and each phase lights up as it passes */
  function loopSVG(L) {
    const PATH = 'M200,100 C160,40 60,40 60,100 C60,160 160,160 200,100 C240,40 340,40 340,100 C340,160 240,160 200,100';
    const ph = arr(L.phases).slice(0, 8);
    const spots = [[150, 34], [78, 34], [78, 176], [150, 176], [250, 34], [322, 34], [322, 176], [250, 176]];
    const when = [.06, .19, .31, .44, .56, .69, .81, .94];
    return `<svg class="loop" viewBox="0 0 400 200" aria-hidden="true">
      <defs>
        <linearGradient id="lg" x1="0" x2="1"><stop offset="0" stop-color="#a48bff"/><stop offset=".5" stop-color="#7c5cff"/><stop offset="1" stop-color="#2ee6f6"/></linearGradient>
        <filter id="lglow" x="-20%" y="-40%" width="140%" height="180%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <path d="${PATH}" fill="none" stroke="url(#lg)" stroke-width="14" stroke-linecap="round" opacity=".18"/>
      <path d="${PATH}" fill="none" stroke="url(#lg)" stroke-width="5" stroke-linecap="round" filter="url(#lglow)"/>
      <path class="loop-flow" d="${PATH}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="3 9" opacity=".7"/>
      <path class="loop-comet" d="${PATH}" pathLength="1000" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="70 930" filter="url(#lglow)">
        ${reduce ? '' : '<animate attributeName="stroke-dashoffset" from="70" to="-930" dur="8s" repeatCount="indefinite"/>'}
      </path>
      ${reduce ? '' : `<circle r="6" fill="#fff" filter="url(#lglow)"><animateMotion dur="8s" repeatCount="indefinite" path="${PATH}"/></circle>`}
      <text class="loop-word" x="125" y="108" text-anchor="middle">${esc(L.left || 'DEV')}</text>
      <text class="loop-word" x="275" y="108" text-anchor="middle">${esc(L.right || 'OPS')}</text>
      ${ph.map((p, i) => `<text class="loop-phase" x="${spots[i][0]}" y="${spots[i][1]}" text-anchor="middle" style="animation-delay:${(when[i] * 8 - .4).toFixed(2)}s">${esc(p)}</text>`).join('')}
    </svg>`;
  }

  R.hero = () => {
    const h = D.hero || {};
    const orbit = arr(h.orbit);
    const step = orbit.length ? 360 / orbit.length : 0;
    const socials = arr(P.socials).map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.label)}">${SOCIAL[(s.icon || '').toLowerCase()] || SOCIAL.link}</a>`).join('')
      + (P.email ? `<a href="mailto:${esc(P.email)}" aria-label="Email">${SOCIAL.email}</a>` : '');
    const stages = arr(D.pipeline?.stages);
    return `
<section class="hero" id="home">
  <div class="wrap">
    <div class="hero-grid">
      <div>
        ${h.status ? `<div class="status fade-in" style="--dl:.05s"><span class="pulse-dot"></span><span>${md(h.status)}</span></div>` : ''}
        <h1 id="heroTitle">${esc(fill(h.headline || P.name))}</h1>
        ${h.intro ? `<p class="lede fade-in" style="--dl:.7s">${md(h.intro)}</p>` : ''}
        ${arr(h.typedCommands).length ? `<p class="typed fade-in" style="--dl:.85s"><span class="pr">${esc((P.logoText || 'me').split(/\W/)[0] || 'me')}@prod:~$</span> <span id="typed"></span><span class="cur"></span></p>` : ''}
        <div class="cta-row fade-in" style="--dl:1s">
          ${arr(h.buttons).map(b => { const href = resolveHref(b.href); return href ? `<a class="btn ${b.style === 'ghost' ? 'btn-ghost' : 'btn-primary'} magnetic" href="${esc(href)}"${ext(href)}>${b.icon === 'download' ? DOWNLOAD : ''}${esc(b.label)}</a>` : ''; }).join('')}
        </div>
        <div class="socials fade-in" style="--dl:1.15s">${socials}</div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="orb-wrap" id="orb">
          <div class="halo"></div><div class="ring r2"></div><div class="ring r1"></div><div class="ring r3"></div>${P.photo ? `<div class="avatar">${img(P.photo, initials(P.name), P.name || 'Profile photo')}</div>` : `<div class="core${h.loop && h.loop.show !== false ? ' dim' : ''}"></div>`}
          ${h.loop && h.loop.show !== false ? loopSVG(h.loop) : ''}
          <div class="orbit">
            ${orbit.map((o, i) => { const u = iconUrl(o); return `<span class="chip${String(o).toLowerCase() === 'aws' ? ' wide' : ''}" style="--a:${(i * step).toFixed(2)}deg">${u ? img(u, initials(o)) : `<span class="chip-txt">${esc(initials(o))}</span>`}</span>`; }).join('')}
          </div>
        </div>
      </div>
    </div>
    ${D.pipeline?.show !== false && stages.length ? `
    <div class="pipeline reveal" role="img" aria-label="Animated CI/CD pipeline">
      <div class="pipe-head"><span>Pipeline <b>#<span id="runNo">412</span></b> on <b>main</b></span><span class="pipe-status" id="pipeStatus">running</span></div>
      <div class="stage-wrap">
        <div class="track" style="left:calc(100%/${stages.length * 2});right:calc(100%/${stages.length * 2})"><i id="trackFill"></i></div>
        <ol class="stages" style="grid-template-columns:repeat(${stages.length},1fr)">
          ${stages.map(s => `<li class="stage"><span class="dot"><svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${STAGE_ICONS[String(s).toLowerCase()] || STAGE_ICONS._}</svg>${CHECK}</span>${esc(s)}</li>`).join('')}
        </ol>
      </div>
    </div>` : ''}
    <div class="scroll-cue" aria-hidden="true"><span></span></div>
  </div>
</section>
${arr(D.marquee).length ? `<div class="marquee" aria-hidden="true"><div class="marquee-track" id="marquee">${arr(D.marquee).map(m => `<span>${esc(m)}</span>`).join('')}</div></div>` : ''}`;
  };

  R.about = (id, s) => `
<section class="block" id="${id}"><div class="wrap">
  ${head(id, { title: s.title })}
  <div class="about-grid">
    <div class="card spot about-text reveal">
      ${arr(s.paragraphs).map(p => `<p>${md(p)}</p>`).join('')}
      <div class="facts">
        ${P.email ? `<div class="fact"><small>Email</small><a href="mailto:${esc(P.email)}">${esc(P.email)}</a></div>` : ''}
        ${P.phone ? `<div class="fact"><small>Phone</small><a href="tel:${esc(P.phone.replace(/[^+\d]/g, ''))}">${esc(P.phone)}</a></div>` : ''}
        ${P.location ? `<div class="fact"><small>Location</small><span>${esc(P.location)}</span></div>` : ''}
        ${P.role ? `<div class="fact"><small>Current role</small><span>${esc(P.role)}</span></div>` : ''}
      </div>
    </div>
    <div class="stats">
      ${arr(s.stats).map((st, i) => `<div class="card spot stat reveal" style="--dl:${(i + 1) * .1}s"><span class="num" data-value="${esc(fill(st.value))}">${esc(fill(st.value))}</span><p>${md(st.label)}</p></div>`).join('')}
    </div>
  </div>
  ${arr(s.interests).length ? `<div class="card spot interests reveal"><h3>${md(s.interestsTitle || 'Interests')}</h3><ul class="tags">${arr(s.interests).map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>` : ''}
</div></section>`;

  R.experience = (id, s) => `
<section class="block" id="${id}"><div class="wrap">
  ${head(id, s)}
  <div class="timeline" id="timeline">
    ${arr(s.items).map(j => `
    <article class="job reveal${j.end ? '' : ' current'}"><span class="node"></span>
      <div class="card spot">
        <div class="job-top">
          <div><h3>${esc(j.role)}</h3>${j.url ? `<a class="company" href="${esc(j.url)}" target="_blank" rel="noopener">${esc(j.company)}</a>` : `<span class="company">${esc(j.company)}</span>`}${j.location ? `<span class="o" style="color:var(--muted)">, ${esc(j.location)}</span>` : ''}</div>
          <div><span class="when${j.end ? '' : ' now'}">${range(j.start, j.end)}</span>${j.start ? `<span class="dur">${duration(j.start, j.end)}</span>` : ''}</div>
        </div>
        ${arr(j.points).length ? `<ul>${arr(j.points).map(p => `<li>${md(p)}</li>`).join('')}</ul>` : ''}
        ${tags(j.stack)}
      </div>
    </article>`).join('')}
  </div>
</div></section>`;

  const cardHTML = (it, i) => {
    const link = it.link ? `<a class="more" href="${esc(it.link)}" target="_blank" rel="noopener">${esc(it.linkLabel || 'Open')} ${ARROW}</a>` : '';
    return `
    <article class="card spot proj glow-border reveal" style="--dl:${(i % 3) * .08}s">
      <span class="idx" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      ${it.image ? `<div class="proj-img">${img(it.image, '', it.title)}</div>` : iconBox(it.icon, it.title)}
      ${it.date ? `<p class="cert-meta">${fmtYM(it.date)}</p>` : ''}
      <h3>${md(it.title)}</h3>
      ${(it.summary || it.text) ? `<p>${md(it.summary || it.text)}</p>` : ''}
      ${tags(it.tags)}
      ${link}
    </article>`;
  };

  R.projects = (id, s) => `
<section class="block" id="${id}"><div class="wrap">
  ${head(id, s)}
  <div class="grid-cards bento">${arr(s.items).map(cardHTML).join('')}</div>
</div></section>`;

  /* radar chart for the tech stack rating */
  function graphHTML(g) {
    const items = arr(g.items).slice(0, 8), n = items.length, C = 200, Rr = 130;
    const pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [C + r * Math.cos(a), C + r * Math.sin(a)]; };
    const poly = r => items.map((_, i) => pt(i, r).map(v => v.toFixed(1)).join(',')).join(' ');
    const val = it => Math.max(0, Math.min(100, +it.level || 0));
    const shape = items.map((it, i) => pt(i, Rr * val(it) / 100).map(v => v.toFixed(1)).join(',')).join(' ');
    const word = l => l >= 85 ? 'Expert' : l >= 70 ? 'Advanced' : l >= 50 ? 'Proficient' : 'Familiar';
    return `
    <div class="card graph-card reveal" style="--dl:.1s">
      <div class="graph-head"><h3>${esc(g.title || 'Tech stack rating')}</h3>${g.note ? `<small>${esc(g.note)}</small>` : ''}</div>
      <svg class="radar" viewBox="-70 0 540 400" role="img" aria-label="${esc(items.map(it => `${it.name} ${val(it)} out of 100`).join(', '))}">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff" stop-opacity=".75"/><stop offset="1" stop-color="#2ee6f6" stop-opacity=".45"/></linearGradient>
          <filter id="rglow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        ${[.25, .5, .75, 1].map(f => `<polygon class="ring-line" points="${poly(Rr * f)}"/>`).join('')}
        ${items.map((_, i) => { const [x, y] = pt(i, Rr); return `<line class="axis" x1="${C}" y1="${C}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`; }).join('')}
        <g class="radar-shape">
          <polygon points="${shape}" fill="url(#rg)" stroke="#2ee6f6" stroke-width="2" filter="url(#rglow)"/>
          ${items.map((it, i) => { const [x, y] = pt(i, Rr * val(it) / 100); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" class="radar-dot"/>`; }).join('')}
        </g>
        ${items.map((it, i) => {
          const [x, y] = pt(i, Rr + 30), a = Math.abs(x - C) < 8 ? 'middle' : x > C ? 'start' : 'end';
          return `<text class="radar-label" x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${a}">${esc(it.name)}<tspan class="radar-val" x="${x.toFixed(1)}" dy="18">${val(it)}</tspan></text>`;
        }).join('')}
      </svg>
      <ul class="graph-legend">
        ${items.map((it, i) => `<li style="--lv:${val(it)}%;--k:${i}"><span>${esc(it.name)}</span><b>${word(val(it))}</b><div class="bar"><i></i></div></li>`).join('')}
      </ul>
    </div>`;
  }

  R.skills = (id, s) => `
<section class="block" id="${id}"><div class="wrap">
  ${head(id, s)}
  <div class="skills-grid">
    <div class="skill-groups">
      ${arr(s.groups).map((g, i) => {
        const items = arr(g.items).map(t => typeof t === 'string' ? { name: t } : t);
        const ic = it => { const u = iconUrl(it.icon); return u ? `<i${/^aws-/i.test(it.icon || '') ? ' class="tile"' : ''}>${img(u, it.badge || initials(it.name))}</i>` : `<i class="txt">${esc(it.badge || initials(it.name))}</i>`; };
        const word = l => l >= 85 ? 'Expert' : l >= 70 ? 'Advanced' : l >= 50 ? 'Proficient' : 'Familiar';
        const rated = items.filter(it => typeof it.level === 'number');
        const avg = rated.length ? Math.round(rated.reduce((a, b) => a + b.level, 0) / rated.length) : null;
        return `
      <div class="card spot group reveal" style="--dl:${i * .08}s">
        <h3>${esc(g.name)} ${avg !== null ? `<small>avg ${avg}%</small>` : g.note ? `<small>${esc(g.note)}</small>` : ''}</h3>
        ${rated.length ? `<div class="rates">${items.map((it, k) => typeof it.level === 'number' ? `
          <div class="rate" style="--lv:${Math.max(0, Math.min(100, it.level))}%;--k:${k}">
            <div class="rate-top">${ic(it)}<span class="rate-name">${esc(it.name)}</span><span class="rate-word" title="${it.level}%">${word(it.level)}</span></div>
            <div class="bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${it.level}" aria-label="${esc(it.name)} ${word(it.level)}"><i></i></div>
          </div>` : `<span class="tool">${ic(it)}${esc(it.name)}</span>`).join('')}</div>`
        : `<div class="tools">${items.map((it, k) => `<span class="tool" style="--k:${k}">${ic(it)}${esc(it.name)}</span>`).join('')}</div>`}
      </div>`;
      }).join('')}
    </div>
    ${s.side === 'graph' && arr(s.graph && s.graph.items).length >= 3 ? graphHTML(s.graph) : arr(s.terminal).length ? `
    <div class="terminal reveal" style="--dl:.1s" role="img" aria-label="Animated terminal showing DevOps commands">
      <div class="term-bar"><i></i><i></i><i></i><span>${esc(s.terminalTitle || 'terminal')}</span></div>
      <div class="term-body" id="term"></div>
    </div>` : ''}
  </div>
</div></section>`;

  R.certifications = (id, s) => {
    const items = arr(s.items).slice().sort((a, b) => (parseYM(b.date) || 0) - (parseYM(a.date) || 0));
    const issuers = [...new Set(items.map(c => c.issuer).filter(Boolean))];
    const badge = c => {
      const logo = iconUrl(c.logo);
      const fallback = logo
        ? `<div class="cert-logo">${img(logo, initials(c.issuer || c.title), c.issuer + ' logo')}</div>`
        : `<div class="cert-fallback"><span>${esc(initials(c.issuer || c.title))}</span></div>`;
      if (!c.image) return fallback;
      return `<button type="button" data-zoom="${esc(c.image)}" data-cap="${esc(c.title)}" data-fallback-html="${esc(fallback)}" aria-label="Enlarge ${esc(c.title)}">${img(c.image, initials(c.issuer || c.title), c.title + ' badge')}</button>`;
    };

    return `
<section class="block" id="${id}"><div class="wrap">
  ${head(id, s)}
  ${issuers.length > 1 ? `<div class="filters reveal" role="group" aria-label="Filter certifications">
     <button type="button" aria-pressed="true" data-filter="*">All<b>${items.length}</b></button>
     ${issuers.map(x => `<button type="button" aria-pressed="false" data-filter="${esc(x)}">${esc(x)}<b>${items.filter(c => c.issuer === x).length}</b></button>`).join('')}
   </div>` : ''}
  <div class="certs">
    ${items.map((c, i) => `
    <article class="card spot cert tilt glow-border reveal" data-issuer="${esc(c.issuer || '')}" style="--dl:${(i % 3) * .1}s">
      <div class="cert-img">${badge(c)}</div>
      <div class="issuer-row">
        ${iconUrl(c.issuerIcon) ? `<span class="issuer-ic">${img(iconUrl(c.issuerIcon), initials(c.issuer), '')}</span>` : ''}
        <div><strong>${esc(c.issuer || '')}</strong>${c.date ? `<small>Issued ${fmtYM(c.date)}</small>` : ''}</div>
      </div>
      <h3>${md(c.title)}</h3>
      ${c.description ? `<p>${md(c.description)}</p>` : ''}
      ${c.credentialId ? `<p class="cred-id">Credential ID ${esc(c.credentialId)}</p>` : ''}
      ${c.link ? `<a href="${esc(c.link)}" target="_blank" rel="noopener">${esc(c.linkLabel || 'View credential')} ${ARROW}</a>` : ''}
    </article>`).join('')}
  </div>
</div></section>`;
  };

  R.education = (id, s) => `
<section class="block" id="${id}"><div class="wrap">
  ${head(id, s)}
  <div class="edu-list">
    ${arr(s.items).map(e => `
    <article class="card spot edu reveal"${e.image ? '' : ' style="grid-template-columns:1fr"'}>
      ${e.image ? `<div class="edu-img">${img(e.image, '', e.school || e.degree)}</div>` : ''}
      <div>
        ${(e.start || e.end) ? `<span class="when">${range(e.start, e.end)}</span>` : ''}
        <h3 style="margin-top:16px">${md(e.degree)}</h3>
        ${e.school ? `<p style="color:var(--cyan);font-weight:700;margin:-4px 0 12px">${esc(e.school)}</p>` : ''}
        ${e.description ? `<p>${md(e.description)}</p>` : ''}
        ${tags(e.tags)}
      </div>
    </article>`).join('')}
  </div>
</div></section>`;

  R.contact = (id, s) => {
    const rows = [];
    if (P.email) rows.push({ ic: SOCIAL.email, label: 'Email', value: P.email, href: 'mailto:' + P.email, copy: P.email });
    if (P.phone) rows.push({ ic: SOCIAL.phone, label: 'Phone', value: P.phone, href: 'tel:' + P.phone.replace(/[^+\d]/g, '') });
    arr(P.socials).forEach(x => rows.push({ ic: SOCIAL[(x.icon || '').toLowerCase()] || SOCIAL.link, label: x.label, value: x.handle || x.url, href: x.url, ext: true }));
    return `
<section class="block" id="${id}"><div class="wrap">
  <p class="path reveal">~/${id}</p>
  <div class="contact-grid"${s.form === false ? ' style="grid-template-columns:1fr"' : ''}>
    <div>
      <h2 class="contact-big reveal">${md(s.title || 'Get in touch.')}</h2>
      ${s.text ? `<p class="sec-lede reveal" style="margin-bottom:30px">${md(s.text)}</p>` : ''}
      <div class="contact-list">
        ${rows.map((r, i) => `
        <div class="card spot c-item reveal" style="--dl:${i * .08}s">
          <span class="ic">${r.ic}</span>
          <div><small>${esc(r.label)}</small><a href="${esc(r.href)}"${r.ext ? ' target="_blank" rel="noopener"' : ''}><strong>${esc(r.value)}</strong></a></div>
          ${r.copy ? `<button class="copy" type="button" data-copy="${esc(r.copy)}">Copy</button>` : ''}
        </div>`).join('')}
      </div>
    </div>
    ${s.form === false ? '' : `
    <form class="card spot reveal" name="contact" method="POST" id="contactForm" style="--dl:.1s">
      <input type="hidden" name="form-name" value="contact">
      <p hidden><label>Leave this empty: <input name="bot-field"></label></p>
      <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-email">Your email</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required></textarea></div>
      <button class="btn btn-primary magnetic" type="submit" id="sendBtn">Send message</button>
      <p class="form-msg" id="formMsg" role="status"></p>
    </form>`}
  </div>
</div></section>`;
  };

  R.custom = (id, s) => {
    const items = arr(s.items);
    let body = '';
    if (s.layout === 'text') {
      body = `<div class="card spot c-text reveal">${arr(s.paragraphs || items.map(i => i.text || i)).map(p => `<p>${md(p)}</p>`).join('')}</div>`;
    } else if (s.layout === 'list') {
      body = `<div class="c-list">${items.map((it, i) => `
        <div class="card spot c-row glow-border reveal" style="--dl:${i * .06}s">
          ${iconBox(it.icon, it.title)}
          <div><h3>${it.link ? `<a href="${esc(it.link)}" target="_blank" rel="noopener">${md(it.title)}</a>` : md(it.title)}</h3>${it.text ? `<p>${md(it.text)}</p>` : ''}</div>
          ${it.date || it.end ? `<span class="when">${it.end !== undefined ? range(it.date, it.end) : fmtYM(it.date)}</span>` : ''}
        </div>`).join('')}</div>`;
    } else {
      body = `<div class="grid-cards">${items.map(cardHTML).join('')}</div>`;
    }
    return `<section class="block" id="${id}"><div class="wrap">${head(id, s)}${body}</div></section>`;
  };

  const DEFAULT_NAV = { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', certifications: 'Certifications', education: 'Education', contact: 'Contact' };

  /* ---------------- build page ---------------- */
  function build() {
    const order = arr(D.sections).length ? D.sections : Object.keys(DEFAULT_NAV);
    const custom = Object.fromEntries(arr(D.customSections).map(c => [c.id, c]));
    let html = R.hero();
    const nav = [];
    order.forEach(raw => {
      const id = String(raw).trim().replace(/[^\w-]/g, '');
      try {
        if (R[id] && id !== 'custom' && id !== 'hero' && D[id]) {
          html += R[id](id, D[id]);
          nav.push([id, D[id].nav || DEFAULT_NAV[id] || id]);
        } else if (custom[id]) {
          html += R.custom(id, custom[id]);
          nav.push([id, custom[id].nav || id]);
        } else {
          console.warn(`[portfolio] section "${id}" is in "sections" but has no content.`);
        }
      } catch (err) { console.error(`[portfolio] couldn’t build section "${id}":`, err); }
    });
    $('#app').innerHTML = html;

    $('#logo').innerHTML = `${P.avatar ? '' : `<span class="logo-mark">${esc(initials(P.name).slice(0, 1))}</span>`}<span>${esc(P.logoText || P.name)}<span class="caret"></span></span>`;
    $('#logo').setAttribute('aria-label', `${P.name || 'Home'}, back to top`);
    if (P.avatar) {
      // round photo before the name; clicking it opens a full-size preview
      const wrap = document.createElement('div'); wrap.className = 'logo-wrap';
      $('#logo').before(wrap);
      wrap.innerHTML = `<button type="button" class="logo-avatar" data-zoom="${esc(P.avatar)}" data-cap="${esc(P.name || '')}" aria-label="View ${esc(P.name || 'profile')} photo">${img(P.avatar, initials(P.name).slice(0, 1), '')}</button>`;
      wrap.appendChild($('#logo'));
    }
    $('#links').innerHTML = nav.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join('')
      + (P.resume ? `<li class="mobile-only"><a href="${esc(P.resume)}" target="_blank" rel="noopener">Resume</a></li>` : '');
    if (nav.length > 7) $('#nav').classList.add('nav-many');
    const nr = $('#navResume');
    if (P.resume) nr.href = P.resume; else nr.remove();
    const wm = $('#wordmark'); if (wm) wm.textContent = P.name || '';
    $('#footText').textContent = `© ${new Date().getFullYear()} ${P.name || ''}. ${fill(D.footer || '')}`;

    // broken images become text badges, never broken icons
    $$('img[data-abbr]').forEach(im => {
      const fail = () => {
        const a = im.dataset.abbr, host = im.closest('.chip, .tool i, .proj-ic, .cert-img button, .proj-img, .edu-img');
        if (!host) { im.remove(); return; }
        if (host.matches('.cert-img button')) { host.outerHTML = host.dataset.fallbackHtml || `<div class="cert-fallback"><span>${esc(a || '•')}</span></div>`; return; }
        if (host.matches('.proj-img, .edu-img')) { host.remove(); return; }
        if (host.matches('.cert-logo')) { host.outerHTML = `<div class="cert-fallback"><span>${esc(a || '•')}</span></div>`; return; }
        if (host.matches('.issuer-ic')) { host.remove(); return; }
        if (host.matches('.logo-avatar')) { host.outerHTML = `<span class="logo-mark">${esc(a || 'R')}</span>`; return; }
        if (host.matches('.avatar')) { host.outerHTML = '<div class="core"></div>'; return; }
        if (host.matches('.tool i, .rate-top i')) host.classList.add('txt');
        host.innerHTML = `<span class="chip-txt">${esc(a || '•')}</span>`;
      };
      im.addEventListener('error', fail, { once: true });
      if (im.complete && im.naturalWidth === 0 && im.src) fail();
    });
  }

  build();

  /* =====================================================================
     Effects and interactions
     ===================================================================== */

  /* headline: word-by-word reveal with one continuous gradient */
  const h1 = $('#heroTitle');
  if (h1) {
    const text = h1.textContent;
    h1.setAttribute('aria-label', text);
    h1.innerHTML = text.split(' ').map((w, i) => `<span class="w" aria-hidden="true"><span style="--d:${i}">${esc(w)}</span></span>`).join(' ');
    const align = () => {
      const hr = h1.getBoundingClientRect();
      $$('.w', h1).forEach(w => {
        const r = w.getBoundingClientRect(), s = w.firstElementChild;
        s.style.backgroundSize = `${hr.width}px ${hr.height}px`;
        s.style.backgroundPosition = `${hr.left - r.left}px ${hr.top - r.top}px`;
      });
    };
    align(); addEventListener('resize', align);
    if (document.fonts) document.fonts.ready.then(align);
  }

  /* boot screen */
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  async function boot() {
    const pre = $('#preloader'), box = $('#bootLines'), bar = $('#bootBar');
    if (reduce || ss.get('booted')) { pre.classList.add('done'); start(); return; }
    const lines = [['$ git push origin main', 'hi'], ['› pipeline triggered on main', ''], ['› build ✓   test ✓   scan ✓', ''], [`› deploying ${(P.logoText || 'portfolio').replace(/\W/g, '-')}…`, ''], ['✓ live', 'ok']];
    for (let i = 0; i < lines.length; i++) {
      const d = document.createElement('div'); if (lines[i][1]) d.className = lines[i][1]; box.appendChild(d);
      for (const ch of lines[i][0]) { d.textContent += ch; await sleep(i === 0 ? 22 : 9); }
      bar.style.width = ((i + 1) / lines.length * 100) + '%';
      await sleep(140);
    }
    await sleep(250);
    pre.classList.add('done'); ss.set('booted', '1');
    start();
  }
  function start() {
    document.body.classList.remove('locked');
    requestAnimationFrame(() => document.body.classList.add('loaded'));
    typeLoop(); pipeline();
  }

  /* typed commands */
  async function typeLoop() {
    const el = $('#typed'); const words = arr(D.hero?.typedCommands).map(fill);
    if (!el || !words.length) return;
    if (reduce) { el.textContent = words[0]; return; }
    for (let i = 0; ; i++) {
      const w = words[i % words.length];
      for (let c = 1; c <= w.length; c++) { el.textContent = w.slice(0, c); await sleep(45); }
      await sleep(1600);
      for (let c = w.length; c >= 0; c--) { el.textContent = w.slice(0, c); await sleep(18); }
      await sleep(300);
    }
  }

  /* pipeline loop */
  function pipeline() {
    const stages = $$('.stage'), fillEl = $('#trackFill'), status = $('#pipeStatus'), runNo = $('#runNo');
    if (!stages.length) return;
    let i = -1, run = 412; const n = stages.length;
    const paint = () => {
      stages.forEach((s, k) => { s.classList.toggle('done', k < i); s.classList.toggle('active', k === i); });
      fillEl.style.width = (n > 1 ? Math.max(0, Math.min(i, n - 1)) / (n - 1) * 100 : 100) + '%';
    };
    const step = () => {
      i++;
      if (i === 0) { status.textContent = 'running'; status.classList.remove('pass'); }
      if (i < n) { paint(); setTimeout(step, 800); return; }
      paint();
      status.textContent = `passed in ${1 + Math.floor(Math.random() * 3)}m ${10 + Math.floor(Math.random() * 49)}s`; status.classList.add('pass');
      if (!reduce) setTimeout(() => { i = -1; runNo.textContent = ++run; step(); }, 2600);
    };
    if (reduce) { i = n; paint(); status.textContent = 'passed'; status.classList.add('pass'); return; }
    step();
  }

  /* particle network background */
  (function net() {
    const cv = $('#net'), cx = cv.getContext('2d');
    let W, H, pts = [], mouse = { x: -999, y: -999 }, raf;
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px'; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
      pts = Array.from({ length: Math.round(Math.min(85, W * H / 17000)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
    }
    function frame() {
      cx.clearRect(0, 0, W, H);
      for (const p of pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0; }
      for (let a = 0; a < pts.length; a++) {
        const p = pts[a];
        for (let b = a + 1; b < pts.length; b++) {
          const q = pts[b], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 16900) { cx.strokeStyle = `rgba(124,92,255,${(1 - d / 16900) * .35})`; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); }
        }
        const mx = p.x - mouse.x, my = p.y - mouse.y, m2 = mx * mx + my * my;
        if (m2 < 32400) { cx.strokeStyle = `rgba(46,230,246,${(1 - m2 / 32400) * .6})`; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mouse.x, mouse.y); cx.stroke(); }
        cx.fillStyle = 'rgba(190,180,255,.8)'; cx.beginPath(); cx.arc(p.x, p.y, 1.4, 0, 6.283); cx.fill();
      }
      if (!reduce) raf = requestAnimationFrame(frame);
    }
    size(); frame();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduce) frame(); }, 150); });
    addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    document.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
    document.addEventListener('visibilitychange', () => { if (reduce) return; if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame); });
  })();

  /* pointer effects */
  if (fine && !reduce) {
    const glow = $('#glow'); let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; }, { passive: true });
    (function loop() { gx += (tx - gx) * .12; gy += (ty - gy) * .12; glow.style.transform = `translate(${gx}px,${gy}px)`; requestAnimationFrame(loop); })();
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
    $$('.tilt').forEach(c => {
      c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-4px)`; });
      c.addEventListener('mouseleave', () => { c.style.transform = ''; });
    });
    const orb = $('#orb');
    if (orb) addEventListener('mousemove', e => { const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5; orb.style.transform = `translate(${x * 24}px,${y * 24}px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`; }, { passive: true });
  }
  document.addEventListener('pointermove', e => {
    const c = e.target.closest && e.target.closest('.spot'); if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* heading decode effect */
  const GLYPHS = '<>/\\_=+*#{}[]01';
  function scramble(el) {
    if (reduce || el.dataset.done) return; el.dataset.done = 1;
    const nodes = []; const walk = n => n.childNodes.forEach(c => c.nodeType === 3 ? nodes.push([c, c.textContent]) : walk(c)); walk(el);
    const t0 = performance.now(), dur = 900;
    (function tick(t) {
      const p = Math.min(1, (t - t0) / dur);
      nodes.forEach(([node, orig]) => {
        const keep = Math.floor(orig.length * p);
        node.textContent = orig.slice(0, keep) + [...orig.slice(keep)].map(ch => ch === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0]).join('');
      });
      if (p < 1) requestAnimationFrame(tick); else nodes.forEach(([node, orig]) => node.textContent = orig);
    })(t0);
  }

  /* reveal + count-up */
  function countUp(el) {
    const raw = el.dataset.value || '', m = raw.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!m || reduce) return;
    const [, pre, num, suf] = m, target = +num, dec = (num.split('.')[1] || '').length, t0 = performance.now();
    (function tick(t) {
      const p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (target * e).toFixed(dec) + (p === 1 ? suf : '');
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const t = en.target; t.classList.add('in');
    $$('[data-value]', t).forEach(countUp);
    if (t.classList.contains('scramble')) setTimeout(() => scramble(t), 150);
    io.unobserve(t);
  }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* scroll: progress, nav, timeline */
  const nav = $('#nav'), prog = $('#progress'), tl = $('#timeline');
  function onScroll() {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
    nav.classList.toggle('scrolled', scrollY > 30);
    if (tl) { const r = tl.getBoundingClientRect(); tl.style.setProperty('--p', Math.min(1, Math.max(0, (innerHeight * .6 - r.top) / r.height)).toFixed(3)); }
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const navLinks = $$('.links a[href^="#"]');
  const linksEl = $('#links'), ind = document.createElement('li');
  ind.className = 'nav-ind'; ind.setAttribute('aria-hidden', 'true'); linksEl.prepend(ind);
  const moveInd = () => {
    const a = $('.links a.active');
    if (!a || nav.classList.contains('menu-open')) { ind.style.opacity = 0; return; }
    ind.style.opacity = 1; ind.style.width = a.offsetWidth + 'px'; ind.style.transform = `translateX(${a.offsetLeft}px)`;
  };
  addEventListener('resize', moveInd);
  const secIO = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id)); moveInd(); } }), { rootMargin: '-45% 0px -50% 0px' });
  addEventListener('scroll', () => { if (scrollY < innerHeight * .4) { navLinks.forEach(a => a.classList.remove('active')); moveInd(); } }, { passive: true });
  $$('main section[id]').forEach(s => secIO.observe(s));

  const menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  $$('.links a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', false); }));

  /* terminal */
  const term = $('#term');
  if (term) {
    const script = arr(D.skills?.terminal);
    const runTerm = async () => {
      if (reduce) {
        term.innerHTML = script.map(s => `<span class="p">$</span> ${esc(s.cmd)}\n${arr(s.out).map(o => `<span class="o">${esc(o)}</span>\n`).join('')}${s.result ? `<span class="g">${esc(s.result)}</span>\n` : ''}`).join('');
        return;
      }
      for (;;) {
        term.innerHTML = '';
        for (const s of script) {
          const line = document.createElement('div');
          line.innerHTML = '<span class="p">$</span> <span class="cmd"></span><span class="cur"></span>';
          term.appendChild(line);
          const cmd = $('.cmd', line);
          for (const ch of s.cmd || '') { cmd.textContent += ch; await sleep(26 + Math.random() * 30); }
          await sleep(350); $('.cur', line).remove();
          for (const o of [...arr(s.out).map(t => [t, 'o']), ...(s.result ? [[s.result, 'g']] : [])]) {
            const d = document.createElement('div'); d.className = o[1]; d.textContent = o[0]; term.appendChild(d); await sleep(420);
          }
          await sleep(500);
        }
        const end = document.createElement('div'); end.innerHTML = '<span class="p">$</span> <span class="cur"></span>'; term.appendChild(end);
        await sleep(3200);
      }
    };
    new IntersectionObserver((en, obs) => { if (en[0].isIntersecting) { obs.disconnect(); runTerm(); } }, { threshold: .3 }).observe(term);
  }

  /* marquee duplicate for a seamless loop */
  const mq = $('#marquee'); if (mq) mq.innerHTML += mq.innerHTML;

  /* certificate filters */
  $$('.filters button').forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filter;
    $$('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    $$('.cert').forEach(c => {
      const show = f === '*' || c.dataset.issuer === f;
      c.classList.toggle('hide', !show);
      if (show) { c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop'); }
    });
  }));

  /* lightbox */
  const lb = $('#lightbox');
  document.addEventListener('click', e => {
    const z = e.target.closest('[data-zoom]'); if (!z || !lb.showModal) return;
    $('#lbImg').src = z.dataset.zoom; $('#lbImg').alt = z.dataset.cap; $('#lbCap').textContent = z.dataset.cap;
    lb.showModal();
  });
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });

  /* copy buttons */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Copied'; } catch (e) { b.textContent = 'Press Ctrl+C'; }
    setTimeout(() => b.textContent = 'Copy', 1800);
  }));

  /* contact form: mailto, Netlify Forms or Formspree (contact.formMode in content.js) */
  const form = $('#contactForm');
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    const msg = $('#formMsg'), send = $('#sendBtn'), mode = String((D.contact && D.contact.formMode) || 'mailto');
    const fd = new FormData(form);
    msg.className = 'form-msg'; msg.textContent = '';
    if (mode === 'mailto') {
      const subject = `Portfolio enquiry from ${fd.get('name') || 'a visitor'}`;
      const body = `${fd.get('message') || ''}\n\n${fd.get('name') || ''}\n${fd.get('email') || ''}`;
      location.href = `mailto:${P.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      msg.classList.add('ok'); msg.textContent = 'Your email app should open with the message ready to send.';
      return;
    }
    send.disabled = true; send.textContent = 'Sending…';
    try {
      const isNetlify = mode === 'netlify';
      const res = await fetch(isNetlify ? '/' : mode, isNetlify
        ? { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd).toString() }
        : { method: 'POST', headers: { Accept: 'application/json' }, body: fd });
      if (!res.ok) throw new Error(res.status);
      form.reset(); msg.classList.add('ok'); msg.textContent = 'Message sent. I’ll reply to your email soon.';
    } catch (err) {
      msg.classList.add('err'); msg.textContent = `Couldn’t send right now. Email me at ${P.email || 'the address above'} instead.`;
    }
    send.disabled = false; send.textContent = 'Send message';
  });

  /* floating back-to-top with scroll progress ring */
  const topBtn = $('#toTop');
  if (topBtn) {
    const ring = $('circle.prog', topBtn), C = 2 * Math.PI * 22;
    ring.style.strokeDasharray = C;
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight, p = h > 0 ? scrollY / h : 0;
      ring.style.strokeDashoffset = C * (1 - p);
      topBtn.classList.toggle('show', scrollY > innerHeight * .8);
    };
    addEventListener('scroll', upd, { passive: true }); upd();
    topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  }

  boot();
})();
