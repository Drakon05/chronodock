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
      configGalleryStage.style.backgroundColor = tier.darkStage ? 'var(--cd-ink)' : 'var(--cd-ivory)';
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
})();
