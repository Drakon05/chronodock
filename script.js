/**
 * ChronoDock — Interactive Storefront & Configurator Logic
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. Product Catalogue Data (Concise Copy)
     ========================================================================== */
  const CATALOGUE = {
    standard: {
      id: 'standard',
      name: 'ChronoDock Standard',
      price: 5000,
      priceFormatted: '₹5,000',
      darkStage: false,
      description: 'Minimal single-watch dock in matte resin for everyday desk and bedside placement.',
      specs: {
        body: 'Matte Polyurethane',
        optics: '65 mm 3× Lens',
        light: 'Warm Cordless LED',
        support: 'Inner Cuff + Silicone Feet',
      },
      finishes: [
        {
          id: 'charcoal',
          name: 'Matte Charcoal',
          sku: '01 / STANDARD · CHARCOAL',
          swatch: '#23201D',
          views: [
            {
              label: 'Dual Profile',
              caption: 'MATTE CHARCOAL',
              src: 'images/41.png',
              alt: 'ChronoDock Standard in Matte Charcoal',
            },
            {
              label: 'Side View',
              caption: 'SIDE CUFF PROFILE',
              src: 'images/20.png',
              alt: 'ChronoDock side view with watch on internal cuff',
            },
          ],
        },
        {
          id: 'ivory',
          name: 'Warm Ivory',
          sku: '01 / STANDARD · IVORY',
          swatch: '#EAE0D0',
          views: [
            {
              label: 'Front View',
              caption: 'WARM IVORY',
              src: 'images/1.png',
              alt: 'ChronoDock in Warm Ivory front view',
            },
            {
              label: 'Side View',
              caption: 'SIDE CUFF PROFILE',
              src: 'images/20.png',
              alt: 'ChronoDock side profile',
            },
            {
              label: 'Bedside',
              caption: 'BEDSIDE CONTEXT',
              src: 'images/0.png',
              alt: 'ChronoDock on a bedside table',
            },
          ],
        },
      ],
    },
    premium: {
      id: 'premium',
      name: 'ChronoDock Premium',
      price: 10000,
      priceFormatted: '₹10,000',
      darkStage: false,
      description: 'CNC-finished walnut body with a 65 mm optical chamber and warm grazing light.',
      specs: {
        body: 'CNC Walnut & Brass',
        optics: '65 mm 3× High-Clarity Lens',
        light: 'Warm Cordless LED',
        support: 'Soft Cuff + Silicone Feet',
      },
      finishes: [
        {
          id: 'walnut',
          name: 'Natural Walnut',
          sku: '02 / PREMIUM · WALNUT',
          swatch: '#6A4733',
          views: [
            {
              label: 'Studio View',
              caption: 'NATURAL WALNUT',
              src: 'images/40.png',
              alt: 'ChronoDock Premium in Natural Walnut',
            },
            {
              label: 'Desk Context',
              caption: 'WORKSPACE CONTEXT',
              src: 'images/58.png',
              alt: 'ChronoDock Premium Walnut on a wooden desk',
            },
          ],
        },
      ],
    },
    grand: {
      id: 'grand',
      name: 'ChronoDock Grand Edition',
      price: 20000,
      priceFormatted: '₹20,000',
      darkStage: true,
      description: 'A 45° dual-mirror optical periscope showcase in dark wood, brass and glass.',
      specs: {
        body: 'Dark Wood, Brass & Glass',
        optics: '45° Periscope + Convex Lens',
        light: 'Vertical Chamber Light',
        support: 'Plush Cushion + Weighted Base',
      },
      finishes: [
        {
          id: 'ebony-brass',
          name: 'Ebony & Brass',
          sku: '03 / GRAND EDITION',
          swatch: '#191714',
          views: [
            {
              label: 'Architecture',
              caption: 'PERISCOPE MECHANISM',
              src: 'images/50.png',
              alt: 'ChronoDock Grand Edition periscope showcase',
            },
          ],
        },
      ],
    },
  };

  /* ==========================================================================
     2. Sticky Header & Mobile Navigation
     ========================================================================== */
  const siteHeader = document.getElementById('site-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-nav');

  const handleScroll = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (mobileMenuBtn && primaryNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     3. Hero Stage View Switcher
     ========================================================================== */
  const HERO_VIEWS = {
    walnut: {
      src: 'images/58.png',
      alt: 'ChronoDock Premium in natural walnut finish on a wooden desk',
      caption: '01 / WALNUT DESK',
      contain: false,
    },
    bedside: {
      src: 'images/0.png',
      alt: 'ChronoDock in warm ivory finish on a bedside table',
      caption: '02 / BEDSIDE TABLE',
      contain: false,
    },
    cutaway: {
      src: 'images/20.png',
      alt: 'Side view of ChronoDock showing internal watch cuff and warm light',
      caption: '03 / SIDE PROFILE',
      contain: true,
    },
  };

  const heroImg = document.getElementById('hero-stage-img');
  const heroCaption = document.getElementById('hero-stage-caption');
  const heroBtns = document.querySelectorAll('[data-hero-view]');

  heroBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const viewKey = btn.getAttribute('data-hero-view');
      const viewData = HERO_VIEWS[viewKey];
      if (!viewData || !heroImg) return;

      heroBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      heroImg.src = viewData.src;
      heroImg.alt = viewData.alt;
      heroImg.classList.toggle('is-contain', viewData.contain);
      if (heroCaption) heroCaption.textContent = viewData.caption;
    });
  });

  /* ==========================================================================
     4. Interactive Studio Configurator
     ========================================================================== */
  let activeTierKey = 'premium';
  let activeFinishIndex = 0;
  let activeViewIndex = 0;

  const configGalleryStage = document.getElementById('config-gallery-stage');
  const configSkuCode = document.getElementById('config-sku-code');
  const configViewLabel = document.getElementById('config-view-label');
  const configMainImg = document.getElementById('config-main-img');
  const configThumbs = document.getElementById('config-thumbs');
  const configTitle = document.getElementById('config-title');
  const configDesc = document.getElementById('config-desc');
  const finishLabel = document.getElementById('finish-label');
  const finishOptionsContainer = document.getElementById('finish-options-container');
  const specBody = document.getElementById('spec-body');
  const specOptics = document.getElementById('spec-optics');
  const specLight = document.getElementById('spec-light');
  const specSupport = document.getElementById('spec-support');
  const configPrice = document.getElementById('config-price');
  const configTierTabs = document.querySelectorAll('[data-config-tier]');
  const collectionCards = document.querySelectorAll('.product-card[data-tier]');

  function renderConfigurator() {
    const tier = CATALOGUE[activeTierKey];
    if (!tier) return;

    const finish = tier.finishes[activeFinishIndex] || tier.finishes[0];
    const view = finish.views[activeViewIndex] || finish.views[0];

    if (configGalleryStage) {
      configGalleryStage.classList.toggle('is-dark-stage', Boolean(tier.darkStage));
      configGalleryStage.style.backgroundColor = tier.darkStage ? '#0B0A09' : 'var(--cd-bone)';
    }

    if (configSkuCode) configSkuCode.textContent = finish.sku;
    if (configViewLabel) configViewLabel.textContent = view.caption;
    if (configMainImg) {
      configMainImg.src = view.src;
      configMainImg.alt = view.alt;
    }

    if (configThumbs) {
      configThumbs.innerHTML = '';
      finish.views.forEach((v, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'thumb-btn';
        btn.setAttribute('aria-pressed', String(idx === activeViewIndex));
        btn.textContent = v.label;
        btn.addEventListener('click', () => {
          activeViewIndex = idx;
          renderConfigurator();
        });
        configThumbs.appendChild(btn);
      });
    }

    configTierTabs.forEach((tab) => {
      const isMatch = tab.getAttribute('data-config-tier') === activeTierKey;
      tab.setAttribute('aria-selected', String(isMatch));
    });

    collectionCards.forEach((card) => {
      card.classList.toggle('is-selected', card.getAttribute('data-tier') === activeTierKey);
    });

    if (configTitle) configTitle.textContent = tier.name;
    if (configDesc) configDesc.textContent = tier.description;
    if (finishLabel) finishLabel.textContent = `Finish: ${finish.name}`;

    if (finishOptionsContainer) {
      finishOptionsContainer.innerHTML = '';
      tier.finishes.forEach((f, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'finish-chip';
        chip.setAttribute('role', 'radio');
        chip.setAttribute('aria-checked', String(idx === activeFinishIndex));

        const dot = document.createElement('span');
        dot.className = 'swatch-dot';
        dot.style.backgroundColor = f.swatch;
        dot.setAttribute('aria-hidden', 'true');

        const text = document.createElement('span');
        text.textContent = f.name;

        chip.append(dot, text);
        chip.addEventListener('click', () => {
          activeFinishIndex = idx;
          activeViewIndex = 0;
          renderConfigurator();
        });
        finishOptionsContainer.appendChild(chip);
      });
    }

    if (specBody) specBody.textContent = tier.specs.body;
    if (specOptics) specOptics.textContent = tier.specs.optics;
    if (specLight) specLight.textContent = tier.specs.light;
    if (specSupport) specSupport.textContent = tier.specs.support;
    if (configPrice) configPrice.textContent = tier.priceFormatted;
  }

  function selectTier(tierKey, scrollToStudio = false) {
    if (!CATALOGUE[tierKey]) return;
    activeTierKey = tierKey;
    activeFinishIndex = 0;
    activeViewIndex = 0;
    renderConfigurator();

    if (scrollToStudio) {
      const studioEl = document.getElementById('studio-configurator');
      if (studioEl) studioEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  configTierTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      selectTier(tab.getAttribute('data-config-tier'), false);
    });
  });

  document.querySelectorAll('[data-select-tier]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectTier(btn.getAttribute('data-select-tier'), true);
    });
  });

  renderConfigurator();

  /* ==========================================================================
     5. Interactive Front / Side Profile Viewer
     ========================================================================== */
  const simImg = document.getElementById('sim-img');
  const simAngleBtns = document.querySelectorAll('[data-sim-angle]');
  const simStatusMode = document.getElementById('sim-status-mode');

  const SIM_VIEWS = {
    front: {
      src: 'images/1.png',
      alt: 'Front view of ChronoDock framing the chronograph watch face',
      modeText: '01 / FRONT APERTURE',
    },
    side: {
      src: 'images/20.png',
      alt: 'Side profile of ChronoDock showing internal cuff and side switch',
      modeText: '02 / SIDE CUFF PROFILE',
    },
  };

  simAngleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const angleKey = btn.getAttribute('data-sim-angle');
      const viewData = SIM_VIEWS[angleKey];
      if (!viewData || !simImg) return;

      simAngleBtns.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      simImg.src = viewData.src;
      simImg.alt = viewData.alt;
      if (simStatusMode) {
        simStatusMode.textContent = viewData.modeText;
      }
    });
  });

  /* ==========================================================================
     6. Native <dialog> Batch 01 Reservation Cart
     ========================================================================== */
  const dialog = document.getElementById('reservation-dialog');
  const openCartBtn = document.getElementById('open-cart-btn');
  const closeDialogBtn = document.getElementById('close-dialog-btn');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartCountBadge = document.getElementById('cart-count-badge');
  const cartTotalAmount = document.getElementById('cart-total-amount');
  const configAddBtn = document.getElementById('config-add-btn');
  const reservationForm = document.getElementById('reservation-form');
  const orderConfirmation = document.getElementById('order-confirmation');
  const orderConfirmationText = document.getElementById('order-confirmation-text');

  const cart = [
    {
      key: 'premium-walnut',
      tierKey: 'premium',
      title: 'ChronoDock Premium',
      finish: 'Natural Walnut',
      price: 10000,
      img: 'images/40.png',
      qty: 1,
    },
  ];

  function formatINR(amount) {
    return '₹' + amount.toLocaleString('en-IN');
  }

  function renderCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cartCountBadge) cartCountBadge.textContent = String(totalQty);
    if (cartTotalAmount) cartTotalAmount.textContent = formatINR(totalPrice);

    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'body-copy';
      emptyLi.style.fontSize = '14px';
      emptyLi.textContent = 'No items selected.';
      cartItemsList.appendChild(emptyLi);
      return;
    }

    cart.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'cart-item';

      const img = document.createElement('img');
      img.src = item.img;
      img.alt = `${item.title} in ${item.finish}`;
      img.width = 56;
      img.height = 56;

      const infoDiv = document.createElement('div');
      const titleSpan = document.createElement('span');
      titleSpan.className = 'cart-item-title';
      titleSpan.textContent = item.title;

      const metaSpan = document.createElement('span');
      metaSpan.className = 'cart-item-meta';
      metaSpan.textContent = `${item.finish} · ${formatINR(item.price)}`;

      infoDiv.append(titleSpan, metaSpan);

      const qtyDiv = document.createElement('div');
      qtyDiv.className = 'cart-qty-controls';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'qty-btn';
      minusBtn.setAttribute('aria-label', `Decrease quantity of ${item.title}`);
      minusBtn.textContent = '−';
      minusBtn.addEventListener('click', () => {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          cart.splice(index, 1);
        }
        renderCart();
      });

      const qtyVal = document.createElement('span');
      qtyVal.className = 'mono-spec';
      qtyVal.textContent = String(item.qty);

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'qty-btn';
      plusBtn.setAttribute('aria-label', `Increase quantity of ${item.title}`);
      plusBtn.textContent = '+';
      plusBtn.addEventListener('click', () => {
        item.qty += 1;
        renderCart();
      });

      qtyDiv.append(minusBtn, qtyVal, plusBtn);
      li.append(img, infoDiv, qtyDiv);
      cartItemsList.appendChild(li);
    });
  }

  function addItemToCart(tierKey, finishIdx = 0) {
    const tier = CATALOGUE[tierKey];
    if (!tier) return;
    const finish = tier.finishes[finishIdx] || tier.finishes[0];
    const itemKey = `${tierKey}-${finish.id}`;

    const existing = cart.find((item) => item.key === itemKey);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        key: itemKey,
        tierKey,
        title: tier.name,
        finish: finish.name,
        price: tier.price,
        img: finish.views[0].src,
        qty: 1,
      });
    }

    if (orderConfirmation) orderConfirmation.hidden = true;
    renderCart();
    openReservationDialog();
  }

  function openReservationDialog() {
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  }

  if (openCartBtn) {
    openCartBtn.addEventListener('click', openReservationDialog);
  }

  if (closeDialogBtn && dialog) {
    closeDialogBtn.addEventListener('click', () => dialog.close());
  }

  if (dialog) {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close();
    });
  }

  if (configAddBtn) {
    configAddBtn.addEventListener('click', () => {
      addItemToCart(activeTierKey, activeFinishIndex);
    });
  }

  document.querySelectorAll('.reserve-direct-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tierKey = btn.getAttribute('data-add-tier');
      addItemToCart(tierKey, 0);
    });
  });

  if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(reservationForm);
      const customerName = formData.get('name') || 'Collector';

      if (orderConfirmation && orderConfirmationText) {
        orderConfirmation.hidden = false;
        orderConfirmationText.textContent = `Thank you, ${customerName}. We will contact you before Batch 01 ships.`;
      }
    });
  }

  renderCart();

  /* ==========================================================================
     7. React Bits <TechText /> Component (JavaScript + Canvas Port)
     Renders the ChronoDock Logo Emblem + "ChronoDock" Wordmark
     ========================================================================== */
  function initTechText(container, canvas, options = {}) {
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    const scratch = document.createElement('canvas');
    const scratchCtx = scratch.getContext('2d');
    if (!ctx || !scratchCtx) return;

    const LABEL_FONT = '10px "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    const FALLOFF_STEPS = 8;
    const SPRING = 320;
    const DAMPING = 22;

    const s = {
      text: 'ChronoDock',
      includeLogo: true,
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 700,
      fontSize: 150,
      letterSpacing: -0.05,
      color: '#F5F1E9',
      accentColor: '#C9A477',
      reach: 200,
      softness: 0.7,
      dashLength: 4,
      dashGap: 2,
      strokeWidth: 1.5,
      lineStyle: 'dashed',
      reveal: 'letter',
      specks: 15,
      selection: true,
      labels: true,
      draggable: true,
      sweep: true,
      speed: 1,
      ...options,
    };

    const approach = (current, target, dt, seconds) =>
      current + (target - current) * (1 - Math.exp(-dt / seconds));

    const hexToRgb = (hex) => {
      let h = String(hex || '').replace('#', '');
      if (h.length === 3) h = h.replace(/./g, (c) => c + c);
      const n = parseInt(h.slice(0, 6), 16);
      return Number.isNaN(n) ? [245, 241, 233] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };

    const rgba = (hex, alpha) => {
      const [r, g, b] = hexToRgb(hex);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const noise = (...values) => {
      let h = 2166136261;
      for (const value of values) {
        h = Math.imul(h ^ (value | 0), 16777619);
        h ^= h >>> 13;
        h = Math.imul(h, 0x5bd1e995);
        h ^= h >>> 15;
      }
      return (h >>> 0) / 4294967296;
    };

    const signed = (value) => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0');

    // Exact vector Path2D for the ChronoDock circular logo mark on a 1024x1024 grid
    const createLogoPath = () => {
      const p = new Path2D();
      // 1. Outer circle ring (evenodd winding)
      p.arc(512, 512, 510, 0, Math.PI * 2, false);
      p.moveTo(512 + 463, 512);
      p.arc(512, 512, 463, 0, Math.PI * 2, true);

      // 2. ChronoDock Arch (left vertical leg + curved top + right vertical leg)
      p.moveTo(310, 178);
      p.lineTo(365, 178);
      p.bezierCurveTo(515, 195, 622, 325, 622, 495);
      p.lineTo(623, 846);
      p.lineTo(568, 846);
      p.lineTo(568, 495);
      p.bezierCurveTo(568, 350, 480, 240, 359, 224);
      p.lineTo(359, 568);
      p.lineTo(310, 613);
      p.closePath();

      // 3. Right vertical watch-support post with beveled top
      p.moveTo(661, 363);
      p.lineTo(707, 298);
      p.lineTo(707, 846);
      p.lineTo(661, 846);
      p.closePath();

      // 4. Bottom-left angled slash
      p.moveTo(409, 540);
      p.lineTo(468, 540);
      p.lineTo(258, 737);
      p.lineTo(258, 680);
      p.closePath();

      return p;
    };
    const LOGO_PATH = createLogoPath();

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let layoutKey = '';
    let requestedFont = '';
    let word = null;
    let glyphs = [];
    let presence = 0;
    let clock = 0;
    let pulse = 0;
    let placed = false;
    let dragging = -1;
    const pointer = { x: 0, y: 0, inside: false };
    const grab = { x: 0, y: 0 };
    const lens = { x: 0, y: 0 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };

    const family = () => s.fontFamily || getComputedStyle(container).fontFamily || 'sans-serif';
    const fontFor = (size) => `${s.fontWeight} ${size}px ${family()}`;

    const setFont = (target, size) => {
      target.font = fontFor(size);
      if ('letterSpacing' in target) target.letterSpacing = `${s.letterSpacing * size}px`;
      target.textAlign = 'left';
      target.textBaseline = 'alphabetic';
    };

    const sprite = (view, glyph, stroke) => {
      const pad = Math.ceil(s.strokeWidth * 2 + 4);
      const left = glyph.box.x1 - pad;
      const top = glyph.box.y1 - pad;
      const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
      const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      const image = document.createElement('canvas');
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      const c = image.getContext('2d');
      if (!c) return { image, left, top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);

      if (glyph.isLogo) {
        const boxSize = glyph.box.x2 - glyph.box.x1;
        const scale = boxSize / 1024;
        c.save();
        c.translate(glyph.box.x1, glyph.box.y1);
        c.scale(scale, scale);
        if (stroke) {
          c.lineJoin = 'round';
          c.lineWidth = (s.strokeWidth * 2) / scale;
          c.lineCap = 'butt';
          c.strokeStyle = s.color;
          if (s.lineStyle !== 'solid') {
            c.setLineDash([Math.max(1, s.dashLength) / scale, Math.max(1, s.dashGap) / scale]);
          }
          c.stroke(LOGO_PATH);
          c.setLineDash([]);
          c.globalCompositeOperation = 'destination-out';
          c.fillStyle = '#000000';
          c.fill(LOGO_PATH, 'evenodd');
          c.globalCompositeOperation = 'source-over';
        } else {
          c.fillStyle = s.color;
          c.fill(LOGO_PATH, 'evenodd');
        }
        c.restore();
        return { image, left, top };
      }

      setFont(c, view.size);
      if (stroke) {
        c.lineJoin = 'round';
        c.lineWidth = s.strokeWidth * 2;
        c.lineCap = 'butt';
        c.strokeStyle = s.color;
        if (s.lineStyle !== 'solid') c.setLineDash([Math.max(1, s.dashLength), Math.max(1, s.dashGap)]);
        c.strokeText(glyph.char, glyph.x, view.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = 'destination-out';
        c.fillStyle = '#000000';
        c.fillText(glyph.char, glyph.x, view.baseline);
        c.globalCompositeOperation = 'source-over';
      } else {
        c.fillStyle = s.color;
        c.fillText(glyph.char, glyph.x, view.baseline);
      }
      return { image, left, top };
    };

    const ensureLayout = () => {
      const key = [
        s.text,
        s.includeLogo,
        family(),
        s.fontWeight,
        s.fontSize,
        s.letterSpacing,
        s.color,
        s.dashLength,
        s.dashGap,
        s.strokeWidth,
        s.lineStyle,
        width,
        height,
        dpr,
      ].join('|');
      if (key === layoutKey && word) return word;
      layoutKey = key;

      const wanted = fontFor(64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, s.text).then(
          () => {
            layoutKey = '';
            wake();
          },
          () => {
            layoutKey = '';
            wake();
          }
        );
      }

      const probe = scratchCtx;
      setFont(probe, s.fontSize);
      let m = probe.measureText(s.text);
      const rawTextW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const rawTextH = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
      const logoExtraRatio = s.includeLogo ? 1.28 : 0;
      const rawTotalW = rawTextW + rawTextH * logoExtraRatio;

      const fit = Math.min(
        1,
        (width * 0.88) / Math.max(rawTotalW, 1),
        (height * 0.66) / Math.max(rawTextH, 1)
      );
      const size = s.fontSize * fit;
      setFont(probe, size);
      m = probe.measureText(s.text);
      const textWidth = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      const inkHeight = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;

      const logoSize = s.includeLogo ? Math.round(inkHeight * 1.06) : 0;
      const logoGap = s.includeLogo ? Math.round(size * 0.24) : 0;
      const totalWidth = textWidth + (s.includeLogo ? logoSize + logoGap : 0);

      const startX = (width - totalWidth) / 2;
      const textStartX = startX + (s.includeLogo ? logoSize + logoGap : 0) + m.actualBoundingBoxLeft;
      const baseline = (height - inkHeight) / 2 + m.actualBoundingBoxAscent;

      const next = {
        size,
        baseline,
        left: startX,
        right: startX + totalWidth,
        top: baseline - m.actualBoundingBoxAscent,
        bottom: baseline + m.actualBoundingBoxDescent,
      };
      word = next;

      const previous = glyphs;
      glyphs = [];

      // Add the ChronoDock Logo Emblem as glyph 0
      if (s.includeLogo) {
        const centerY = (next.top + next.bottom) / 2;
        const logoBase = {
          char: 'LOGO',
          isLogo: true,
          x: startX,
          box: {
            x1: startX,
            y1: centerY - logoSize / 2,
            x2: startX + logoSize,
            y2: centerY + logoSize / 2,
          },
        };
        const keptLogo = previous[0];
        glyphs.push({
          ...logoBase,
          offset: keptLogo?.isLogo ? keptLogo.offset : { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          outline: 0,
          index: 0,
          fill: sprite(next, logoBase, false),
          dashes: sprite(next, logoBase, true),
        });
      }

      const chars = Array.from(s.text);
      let prefix = '';
      chars.forEach((char, i) => {
        prefix += char;
        const own = probe.measureText(char);
        const gx = textStartX + probe.measureText(prefix).width - own.width;
        if (!char.trim()) return;
        const base = {
          char,
          isLogo: false,
          x: gx,
          box: {
            x1: gx - own.actualBoundingBoxLeft,
            y1: baseline - own.actualBoundingBoxAscent,
            x2: gx + own.actualBoundingBoxRight,
            y2: baseline + own.actualBoundingBoxDescent,
          },
        };
        const kept = previous[glyphs.length];
        glyphs.push({
          ...base,
          offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
          velocity: { x: 0, y: 0 },
          outline: 0,
          index: i + (s.includeLogo ? 1 : 0),
          fill: sprite(next, base, false),
          dashes: sprite(next, base, true),
        });
      });

      dragging = -1;
      frame.index = -1;
      return next;
    };

    const glyphAt = (x, y) => {
      if (!word || y < word.top - 32 || y > word.bottom + 32) return -1;
      let best = -1;
      let bestDistance = Infinity;
      glyphs.forEach((glyph, i) => {
        const x1 = glyph.box.x1 + glyph.offset.x;
        const x2 = glyph.box.x2 + glyph.offset.x;
        const d = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      });
      return bestDistance < 28 ? best : -1;
    };

    const falloff = (target, cx, cy, radius, strength, softness) => {
      const inner = Math.min(1, Math.max(0, 1 - softness));
      const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
      if (inner > 0.995) {
        gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        return gradient;
      }
      for (let i = 0; i <= FALLOFF_STEPS; i++) {
        const t = i / FALLOFF_STEPS;
        const eased = t * t * (3 - 2 * t);
        gradient.addColorStop(inner + (1 - inner) * t, `rgba(0, 0, 0, ${strength * (1 - eased)})`);
      }
      return gradient;
    };

    const blit = (target, art, dx, dy, originX, originY) => {
      target.drawImage(
        art.image,
        Math.round((art.left + dx) * dpr - originX),
        Math.round((art.top + dy) * dpr - originY)
      );
    };

    const drawReveal = () => {
      const radius = s.reach * dpr;
      const cx = lens.x * dpr;
      const cy = lens.y * dpr;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness);
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = 'source-over';

      const x0 = Math.max(0, Math.floor(cx - radius));
      const y0 = Math.max(0, Math.floor(cy - radius));
      const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
      const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
      if (x1 <= x0 || y1 <= y0) return;
      const w = x1 - x0;
      const h = y1 - y0;
      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w);
        scratch.height = Math.max(scratch.height, h);
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      scratchCtx.globalCompositeOperation = 'source-over';
      scratchCtx.clearRect(0, 0, w, h);
      for (const glyph of glyphs) blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0);
      scratchCtx.globalCompositeOperation = 'destination-in';
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness);
      scratchCtx.fillRect(0, 0, w, h);
      scratchCtx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = presence;
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
      ctx.globalAlpha = 1;
    };

    const crisp = (value) => (Math.round(value * dpr) + 0.5) / dpr;

    const perimeterPoint = (distance, w, h) => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= w;
      return [frame.x1, frame.y2 - d, -1, 0];
    };

    const drawSpecks = (a) => {
      const w = frame.x2 - frame.x1;
      const h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      const perimeter = 2 * (w + h);
      const seed = frame.index + 1;
      const grid = 3;

      for (let k = 0; k < s.specks; k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2;
        const t = pulse / period + noise(seed, k, 17);
        const cycle = Math.floor(t);
        const life = t - cycle;
        if (life > 0.7) continue;
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        const pick = noise(seed, k, cycle, 2);
        const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : pick < 0.94 ? 8 : 11;
        const large = size >= 8;
        const out = (large ? 9 : 4) + Math.floor(noise(seed, k, cycle, 1) * 5) * grid;
        const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
        const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
        const tone = noise(seed, k, cycle, 3);
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        const left = Math.round(x - size / 2);
        const top = Math.round(y - size / 2);
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeStyle = rgba(s.accentColor, alpha);
          ctx.strokeRect(left + 0.5, top + 0.5, size, size);
          if (large && tone > 0.5) {
            ctx.fillStyle = rgba(s.accentColor, alpha);
            ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
          }
        } else {
          ctx.fillStyle = rgba(s.accentColor, alpha);
          ctx.fillRect(left, top, size, size);
        }
      }

      for (let j = 0; j < 2; j++) {
        const head = (pulse * 0.42 * s.speed + j * 0.5) * perimeter;
        for (let i = 0; i < 4; i++) {
          const [x, y] = perimeterPoint(head - i * 6, w, h);
          const size = i === 0 ? 3 : 2;
          ctx.fillStyle = rgba(s.accentColor, a * [0.95, 0.55, 0.32, 0.16][i]);
          ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
        }
      }
    };

    const drawFrame = () => {
      const glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      const a = frame.alpha;
      const x1 = crisp(frame.x1);
      const y1 = crisp(frame.y1);
      const x2 = crisp(frame.x2);
      const y2 = crisp(frame.y2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        const hx = (glyph.box.x1 + glyph.box.x2) / 2;
        const hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
        ctx.setLineDash([3, 4]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = rgba(s.accentColor, 0.45 * a);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        ctx.fillStyle = rgba(s.accentColor, 0.7 * a);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.lineWidth = 1;
      ctx.strokeStyle = rgba(s.accentColor, 0.5 * a);
      ctx.stroke();

      ctx.beginPath();
      for (const [cx, cy] of [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
      ]) {
        ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
      }
      ctx.fillStyle = rgba(s.accentColor, 0.95 * a);
      ctx.fill();

      if (s.specks > 0) {
        ctx.lineWidth = 1;
        drawSpecks(a);
      }

      if (!s.labels) return;
      ctx.font = LABEL_FONT;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = rgba(s.accentColor, 0.75 * a);
      const label =
        moved > 1
          ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
          : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
      ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
    };

    const tick = (now) => {
      raf = 0;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const view = ensureLayout();

      const sweeping = s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
      if (sweeping) clock += dt * s.speed;
      pulse += dt;
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (sweeping) {
        targetX = view.left + (view.right - view.left) * (0.5 - 0.5 * Math.cos(clock * 0.45));
        targetY = view.top + (view.bottom - view.top) * (0.45 + 0.1 * Math.sin(clock * 0.8));
      }
      const active = pointer.inside || sweeping || dragging >= 0;
      if (active && !placed) {
        lens.x = targetX;
        lens.y = targetY;
      }
      if (active) {
        const lag = pointer.inside ? 0.05 : 0.22;
        lens.x = approach(lens.x, targetX, dt, lag);
        lens.y = approach(lens.y, targetY, dt, lag);
      }
      placed = active;
      presence = approach(presence, s.reveal === 'area' && active && dragging < 0 ? 1 : 0, dt, 0.16);

      let moving = false;
      glyphs.forEach((glyph, i) => {
        if (i === dragging) {
          glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.03);
          glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.03);
          glyph.velocity.x = 0;
          glyph.velocity.y = 0;
          moving = true;
          return;
        }
        const { offset, velocity } = glyph;
        if (
          Math.abs(offset.x) < 0.05 &&
          Math.abs(offset.y) < 0.05 &&
          Math.hypot(velocity.x, velocity.y) < 0.5
        ) {
          offset.x = 0;
          offset.y = 0;
          velocity.x = 0;
          velocity.y = 0;
          return;
        }
        velocity.x += (-SPRING * offset.x - DAMPING * velocity.x) * dt;
        velocity.y += (-SPRING * offset.y - DAMPING * velocity.y) * dt;
        offset.x += velocity.x * dt;
        offset.y += velocity.y * dt;
        moving = true;
      });

      const focus = dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
      if (focus >= 0 && s.selection) {
        const glyph = glyphs[focus];
        const bx1 = glyph.box.x1 + glyph.offset.x - 6;
        const by1 = glyph.box.y1 + glyph.offset.y - 6;
        const bx2 = glyph.box.x2 + glyph.offset.x + 6;
        const by2 = glyph.box.y2 + glyph.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        const glide = focus === dragging ? 0.02 : 0.08;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.1);

      glyphs.forEach((glyph, i) => {
        const target = s.reveal === 'letter' && i === focus && i !== dragging ? 1 : 0;
        glyph.outline = approach(glyph.outline, target, dt, 0.09);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
      });

      if (s.draggable) {
        container.style.cursor = dragging >= 0 ? 'grabbing' : focus >= 0 && pointer.inside ? 'grab' : '';
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const glyph of glyphs) {
        const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
          blit(ctx, glyph.dashes, 0, 0, 0, 0);
          ctx.globalAlpha = 1;
        }
      }
      for (const glyph of glyphs) {
        if (glyph.outline < 0.999) {
          ctx.globalAlpha = 1 - glyph.outline;
          blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline;
          blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        ctx.globalAlpha = 1;
      }
      if (presence > 0.001) drawReveal();
      drawFrame();

      const settling =
        moving ||
        Math.abs(presence - (s.reveal === 'area' && active && dragging < 0 ? 1 : 0)) > 0.002 ||
        (frame.alpha > 0.01 && frame.alpha < 0.99);
      if ((active || settling) && visible) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !visible) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      layoutKey = '';
      wake();
    };

    const locate = (e) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e) => {
      locate(e);
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    };
    const onDown = (e) => {
      locate(e);
      pointer.inside = true;
      if (s.draggable && (e.pointerType !== 'mouse' || e.button === 0)) {
        const index = glyphAt(pointer.x, pointer.y);
        if (index >= 0) {
          dragging = index;
          grab.x = pointer.x - glyphs[index].offset.x;
          grab.y = pointer.y - glyphs[index].offset.y;
          container.setPointerCapture?.(e.pointerId);
        }
      }
      wake();
    };
    const onUp = (e) => {
      if (dragging >= 0) {
        dragging = -1;
        container.releasePointerCapture?.(e.pointerId);
        const rect = container.getBoundingClientRect();
        pointer.inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
      }
      wake();
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerenter', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerup', onUp, { passive: true });
    container.addEventListener('pointercancel', onUp, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);
    if (document.fonts) {
      document.fonts.ready.then(
        () => {
          layoutKey = '';
          wake();
        },
        () => {
          layoutKey = '';
          wake();
        }
      );
    }

    resize();
  }

  initTechText(
    document.getElementById('tech-text-root'),
    document.getElementById('tech-text-canvas'),
    {
      text: 'ChronoDock',
      includeLogo: true,
      fontWeight: 700,
      fontSize: 150,
      letterSpacing: -0.05,
      color: '#F5F1E9',
      accentColor: '#C9A477',
      reveal: 'letter',
      dashLength: 4,
      dashGap: 2,
      specks: 15,
    }
  );

  /* ==========================================================================
     10. React Bits <GlassSurface /> 3x Optical Lens & Watch Brand Carousel
     ========================================================================== */

  const WATCH_SHOWCASE_ITEMS = [
    {
      brand: 'CASIO G-SHOCK',
      model: 'GA-2100 Octagonal Series',
      src: 'watches/casiok.webp',
      alt: 'Casio G-Shock GA-2100 octagonal analog-digital watch',
    },
    {
      brand: 'FOSSIL',
      model: 'The Minimalist Three-Hand',
      src: 'watches/fossil.png',
      alt: 'Fossil Minimalist blue dial watch with brown leather strap',
    },
    {
      brand: 'TISSOT 1853',
      model: 'Classic Dream Swiss Automatic',
      src: 'watches/tissot.png',
      alt: 'Tissot 1853 rose gold and black dial Swiss automatic watch',
    },
    {
      brand: 'DIESEL',
      model: 'Mega Chief 10BAR Chronograph',
      src: 'watches/diesel.png',
      alt: 'Diesel Mega Chief 10BAR oversized chronograph watch',
    },
    {
      brand: 'OMEGA × SWATCH',
      model: 'Speedmaster MoonSwatch Gold',
      src: 'watches/omega-swatch.png',
      alt: 'Omega x Swatch Speedmaster MoonSwatch Mission to Moonshine Gold',
    },
  ];

  function initGlassSurfaceShowcase() {
    const section = document.getElementById('lens-showcase');
    const lensContainer = document.getElementById('glass-surface-lens');
    const feImage = document.getElementById('glass-fe-image');
    const redChannel = document.getElementById('glass-red-channel');
    const greenChannel = document.getElementById('glass-green-channel');
    const blueChannel = document.getElementById('glass-blue-channel');
    const gaussianBlur = document.getElementById('glass-gaussian-blur');
    const watch1xImg = document.getElementById('lens-watch-1x-img');
    const watch3xImg = document.getElementById('lens-watch-3x-img');
    const watch1xViewport = document.getElementById('lens-watch-1x-viewport');
    const metaIndex = document.getElementById('lens-watch-index');
    const metaBrand = document.getElementById('lens-watch-brand');
    const metaModel = document.getElementById('lens-watch-model');
    const lensOnBtn = document.getElementById('lens-on-btn');
    const lensOffBtn = document.getElementById('lens-off-btn');
    const prevBtn = document.getElementById('lens-prev-btn');
    const nextBtn = document.getElementById('lens-next-btn');
    const brandButtons = document.querySelectorAll('.brand-pill-item[data-watch-index]');

    if (!section || !lensContainer || !watch1xImg || !watch3xImg) return;

    // Preload all watch images for instant carousel transitions
    WATCH_SHOWCASE_ITEMS.forEach((item) => {
      const preload = new Image();
      preload.src = item.src;
    });

    // React Bits <GlassSurface /> props configuration — refined for crystal-clear dial with subtle convex rim
    const glassConfig = {
      borderRadius: 222,
      borderWidth: 0.05,
      brightness: 50,
      opacity: 0.93,
      blur: 8,
      displace: 0.2,
      backgroundOpacity: 0.05,
      saturation: 1.08,
      distortionScale: -55,
      redOffset: 0,
      greenOffset: 4,
      blueOffset: 8,
      xChannel: 'R',
      yChannel: 'G',
      mixBlendMode: 'difference',
    };

    const generateDisplacementMap = () => {
      const rect = lensContainer.getBoundingClientRect();
      const actualWidth = Math.max(1, Math.round(rect.width || 444));
      const actualHeight = Math.max(1, Math.round(rect.height || 444));
      const radius = Math.round(Math.min(actualWidth, actualHeight) / 2);
      const edgeSize = Math.min(actualWidth, actualHeight) * (glassConfig.borderWidth * 0.5);

      const svgContent = `
        <svg width="${actualWidth}" height="${actualHeight}" viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="red-grad-cd" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="red"/>
            </linearGradient>
            <linearGradient id="blue-grad-cd" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0000"/>
              <stop offset="100%" stop-color="blue"/>
            </linearGradient>
            <filter id="soft-cd" filterUnits="userSpaceOnUse" x="0" y="0" width="${actualWidth}" height="${actualHeight}" color-interpolation-filters="sRGB">
              <feGaussianBlur stdDeviation="${glassConfig.blur}" />
            </filter>
          </defs>
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${radius}" fill="url(#red-grad-cd)" />
          <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${radius}" fill="url(#blue-grad-cd)" style="mix-blend-mode: ${glassConfig.mixBlendMode}" />
          <rect x="${edgeSize}" y="${edgeSize}" width="${Math.max(1, actualWidth - edgeSize * 2)}" height="${Math.max(1, actualHeight - edgeSize * 2)}" rx="${Math.max(1, radius - edgeSize)}" fill="hsl(0 0% ${glassConfig.brightness}% / ${glassConfig.opacity})" filter="url(#soft-cd)" />
        </svg>
      `;

      return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
    };

    const updateDisplacementMap = () => {
      const mapUrl = generateDisplacementMap();
      if (feImage) {
        feImage.setAttribute('href', mapUrl);
        feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', mapUrl);
      }
      [
        { node: redChannel, offset: glassConfig.redOffset },
        { node: greenChannel, offset: glassConfig.greenOffset },
        { node: blueChannel, offset: glassConfig.blueOffset },
      ].forEach(({ node, offset }) => {
        if (node) {
          node.setAttribute('scale', String(glassConfig.distortionScale + offset));
          node.setAttribute('xChannelSelector', glassConfig.xChannel);
          node.setAttribute('yChannelSelector', glassConfig.yChannel);
        }
      });
      if (gaussianBlur) {
        gaussianBlur.setAttribute('stdDeviation', String(glassConfig.displace));
      }
    };

    updateDisplacementMap();

    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => {
        updateDisplacementMap();
      });
      ro.observe(lensContainer);
    } else {
      window.addEventListener('resize', updateDisplacementMap);
    }

    // Dial Light Toggle: Default is darker exposure; clicking returns exposure to normal
    const lightBtn = document.getElementById('lens-light-btn');
    const lightLabel = document.getElementById('lens-light-label');
    let isLightOn = false;

    function setLight(on) {
      isLightOn = on;
      section.classList.toggle('is-light-on', isLightOn);
      if (lightBtn) {
        lightBtn.classList.toggle('is-active', isLightOn);
        lightBtn.setAttribute('aria-pressed', String(isLightOn));
      }
      if (lightLabel) {
        lightLabel.textContent = isLightOn ? 'Dial Light: ON' : 'Dial Light: OFF';
      }
    }

    if (lightBtn) {
      lightBtn.addEventListener('click', () => setLight(!isLightOn));
    }

    // Gentle interactive pointer pan inside the 3x GlassSurface dome (kept within calm area)
    lensContainer.addEventListener('pointermove', (e) => {
      if (section.classList.contains('is-lens-off')) return;
      const rect = lensContainer.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      const panX = Math.max(-1, Math.min(1, nx)) * -14;
      const panY = Math.max(-1, Math.min(1, ny)) * -18;
      watch3xImg.style.transform = `translate3d(${panX.toFixed(1)}px, ${panY.toFixed(1)}px, 0)`;
    });

    lensContainer.addEventListener('pointerleave', () => {
      watch3xImg.style.transform = 'translate3d(0, 0, 0)';
    });

    // With Lens (3x) / Without Lens (1x) Toggle
    function setLensEnabled(enabled) {
      section.classList.toggle('is-lens-off', !enabled);
      if (lensOnBtn) {
        lensOnBtn.classList.toggle('is-active', enabled);
        lensOnBtn.setAttribute('aria-pressed', String(enabled));
      }
      if (lensOffBtn) {
        lensOffBtn.classList.toggle('is-active', !enabled);
        lensOffBtn.setAttribute('aria-pressed', String(!enabled));
      }
      if (!enabled) {
        watch3xImg.style.transform = 'translate3d(0, 0, 0)';
      }
    }

    if (lensOnBtn) {
      lensOnBtn.addEventListener('click', () => setLensEnabled(true));
    }
    if (lensOffBtn) {
      lensOffBtn.addEventListener('click', () => setLensEnabled(false));
    }
    if (watch1xViewport) {
      watch1xViewport.addEventListener('click', () => {
        if (section.classList.contains('is-lens-off')) {
          setLensEnabled(true);
        }
      });
    }

    // Watch Carousel State & Transitions
    let activeWatchIndex = 0;
    let switchTimer = 0;
    let autoCycleTimer = 0;
    let isSectionVisible = false;
    let isPointerInside = false;

    function selectWatch(nextIndex, userInitiated = false) {
      const count = WATCH_SHOWCASE_ITEMS.length;
      const normalized = ((nextIndex % count) + count) % count;
      if (normalized === activeWatchIndex && !userInitiated) return;
      activeWatchIndex = normalized;
      const item = WATCH_SHOWCASE_ITEMS[activeWatchIndex];

      // Update top HUD metadata
      if (metaIndex) {
        metaIndex.textContent = `0${activeWatchIndex + 1} / 0${count}`;
      }
      if (metaBrand) {
        metaBrand.textContent = item.brand;
      }
      if (metaModel) {
        metaModel.textContent = item.model;
      }

      // Update bottom brand logo pill nav active state
      brandButtons.forEach((btn, idx) => {
        const isActive = idx === activeWatchIndex;
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      // Smooth crossfade + scale transition on both 1x and 3x watch layers
      watch1xImg.classList.add('is-switching');
      watch3xImg.classList.add('is-switching');
      clearTimeout(switchTimer);
      switchTimer = window.setTimeout(() => {
        watch1xImg.src = item.src;
        watch1xImg.alt = `${item.alt} (1x regular size)`;
        watch3xImg.src = item.src;
        watch3xImg.alt = `${item.alt} (3x magnified under ChronoDock lens)`;
        watch1xImg.classList.remove('is-switching');
        watch3xImg.classList.remove('is-switching');
      }, 150);

      if (userInitiated) {
        restartAutoCycle();
      }
    }

    brandButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-watch-index') || '0', 10);
        selectWatch(idx, true);
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        selectWatch(activeWatchIndex - 1, true);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        selectWatch(activeWatchIndex + 1, true);
      });
    }

    // Auto-cycle watches behind the lens when visible and idle
    function restartAutoCycle() {
      clearInterval(autoCycleTimer);
      autoCycleTimer = window.setInterval(() => {
        if (isSectionVisible && !isPointerInside && !document.hidden) {
          selectWatch(activeWatchIndex + 1, false);
        }
      }, 4200);
    }

    section.addEventListener('pointerenter', () => {
      isPointerInside = true;
    });

    section.addEventListener('pointerleave', () => {
      isPointerInside = false;
    });

    if (typeof IntersectionObserver !== 'undefined') {
      const io = new IntersectionObserver(
        (entries) => {
          isSectionVisible = entries.some((entry) => entry.isIntersecting);
        },
        { threshold: 0.25 }
      );
      io.observe(section);
    } else {
      isSectionVisible = true;
    }

    restartAutoCycle();
  }

  initGlassSurfaceShowcase();
})();

