(() => {
  'use strict';

  const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const PRODUCTS = ['crea', 'blend'];
  const DEFAULTS = {
    crea: { model: 'full', active: true, qty: 100 },
    blend: { model: 'hybrid', active: true, qty: 100 }
  };

  const state = {
    crea: {
      model: DEFAULTS.crea.model,
      active: DEFAULTS.crea.active,
      prices: { envase: 7, full: 29 },
      labels: { envase: 'Somente envase', full: 'Modelo Full' }
    },
    blend: {
      model: DEFAULTS.blend.model,
      active: DEFAULTS.blend.active,
      prices: { hybrid: 80.5, full: 95 },
      labels: { hybrid: 'Modelo Híbrido', full: 'Modelo Full' }
    }
  };

  const scopes = {
    crea: {
      envase: {
        title: 'Escopo comercial — Somente envase',
        badge: 'R$ 7,00 por unidade',
        items: [
          'Envase em apresentação de 300 g',
          'Insumos e materiais definidos na ordem',
          'Conferência operacional no recebimento',
          'Detalhamento final formalizado no pedido'
        ]
      },
      full: {
        title: 'Escopo comercial — Modelo Full',
        badge: 'R$ 29,00 por unidade',
        items: [
          'Produto completo conforme escopo aprovado',
          'Fornecimento e industrialização centralizados',
          'Apresentação final de 300 g',
          'Detalhamento final formalizado no pedido'
        ]
      }
    },
    blend: {
      hybrid: {
        title: 'Escopo comercial — Modelo Híbrido',
        badge: 'R$ 80,50 estimados por unidade',
        items: [
          'R$ 55,00 por unidade no escopo Vita Power',
          'R$ 25,50 estimados de colágeno por unidade',
          'Colágeno adquirido separadamente pela Nutriaction',
          'Valor final sujeito à compra efetiva do colágeno'
        ]
      },
      full: {
        title: 'Escopo comercial — Modelo Full',
        badge: 'R$ 95,00 por unidade',
        items: [
          'Produto completo conforme escopo aprovado',
          'Fornecimento centralizado na Vita Power',
          'Apresentação final de 900 g',
          'Detalhamento final formalizado no pedido'
        ]
      }
    }
  };

  const $ = (id) => document.getElementById(id);
  const clampInteger = (value) => {
    const parsed = Number.parseInt(String(value), 10);
    if (!Number.isFinite(parsed)) return 0;
    return Math.min(999999, Math.max(0, parsed));
  };

  function quantity(product) {
    return clampInteger($(product + 'Qty').value);
  }

  function unitPrice(product) {
    return state[product].prices[state[product].model];
  }

  function productTotal(product) {
    return quantity(product) * unitPrice(product);
  }

  function formatUnits(value) {
    return `${value.toLocaleString('pt-BR')} ${value === 1 ? 'unidade' : 'unidades'}`;
  }

  function renderScope(product) {
    const scope = scopes[product][state[product].model];
    const target = $(product + 'Scope');
    target.innerHTML = `
      <div class="scope-head">
        <strong>${scope.title}</strong>
        <span>${scope.badge}</span>
      </div>
      <ul>${scope.items.map((item) => `<li>${item}</li>`).join('')}</ul>
    `;
  }

  function updateModelCards(product) {
    document.querySelectorAll(`[data-product="${product}"][data-model]`).forEach((button) => {
      const selected = button.dataset.model === state[product].model;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function updateProductSwitch(product) {
    const switchButton = $(product + 'Switch');
    switchButton.classList.toggle('is-on', state[product].active);
    switchButton.setAttribute('aria-checked', String(state[product].active));
    switchButton.setAttribute('aria-label', `${state[product].active ? 'Retirar' : 'Incluir'} ${product === 'crea' ? 'Creatina' : 'Blend Protein'} do cenário`);

    const configurator = switchButton.closest('.configurator');
    configurator.classList.toggle('is-disabled', !state[product].active);
  }

  function setActive(product, active) {
    state[product].active = Boolean(active);
    updateProductSwitch(product);
    recalculate();
  }

  function selectModel(product, model) {
    if (!(model in state[product].prices)) return;
    state[product].model = model;
    if (!state[product].active) state[product].active = true;
    updateModelCards(product);
    updateProductSwitch(product);
    renderScope(product);
    recalculate();
  }

  function stepQuantity(product, delta) {
    const input = $(product + 'Qty');
    input.value = clampInteger(quantity(product) + delta);
    recalculate();
  }

  function updateQueryString() {
    if (!/^https?:$/.test(window.location.protocol)) return;
    const params = new URLSearchParams(window.location.search);
    params.set('cm', state.crea.model);
    params.set('ca', state.crea.active ? '1' : '0');
    params.set('cq', String(quantity('crea')));
    params.set('bm', state.blend.model);
    params.set('ba', state.blend.active ? '1' : '0');
    params.set('bq', String(quantity('blend')));
    const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }

  function recalculate() {
    PRODUCTS.forEach((product) => {
      const input = $(product + 'Qty');
      const qty = quantity(product);
      input.value = qty;

      const total = productTotal(product);
      $(product + 'Total').textContent = state[product].active ? BRL.format(total) : 'Não incluído';
      $(product + 'Formula').textContent = `${formatUnits(qty)} × ${BRL.format(unitPrice(product))}`;

      const selectionCard = $(product + 'Selection');
      selectionCard.classList.toggle('is-inactive', !state[product].active);
      $(product + 'SelectionModel').textContent = state[product].active ? state[product].labels[state[product].model] : 'Não incluído no cenário';
      $(product + 'SelectionQty').textContent = formatUnits(qty);
      $(product + 'SelectionTotal').textContent = state[product].active ? BRL.format(total) : BRL.format(0);
    });

    const blendSaving = $('blendSaving');
    if (state.blend.model === 'hybrid' && state.blend.active) {
      const saving = (state.blend.prices.full - state.blend.prices.hybrid) * quantity('blend');
      blendSaving.hidden = false;
      blendSaving.textContent = `Economia potencial: ${BRL.format(saving)} em comparação ao modelo full`;
    } else {
      blendSaving.hidden = true;
    }

    const activeProducts = PRODUCTS.filter((product) => state[product].active);
    const total = activeProducts.reduce((sum, product) => sum + productTotal(product), 0);
    const units = activeProducts.reduce((sum, product) => sum + quantity(product), 0);
    const activeText = `${activeProducts.length} ${activeProducts.length === 1 ? 'produto' : 'produtos'}`;

    $('grandTotal').textContent = BRL.format(total);
    $('activeCount').textContent = activeText;
    $('unitCount').textContent = formatUnits(units);
    $('summaryCreaModel').textContent = state.crea.active ? state.crea.labels[state.crea.model] : 'Não incluída';
    $('summaryBlendModel').textContent = state.blend.active ? state.blend.labels[state.blend.model] : 'Não incluído';
    $('dockTotal').textContent = BRL.format(total);
    $('dockActive').textContent = activeText;

    updateQueryString();
  }

  function scenarioSummary() {
    const lines = [
      'PROPOSTA COMERCIAL — EXPANSÃO DE PORTFÓLIO NUTRIACTION',
      ''
    ];

    if (state.crea.active) {
      lines.push(
        `CREATINA 300 G — ${state.crea.labels[state.crea.model]}`,
        `Quantidade simulada: ${formatUnits(quantity('crea'))}`,
        `Valor unitário: ${BRL.format(unitPrice('crea'))}`,
        `Subtotal: ${BRL.format(productTotal('crea'))}`,
        ''
      );
    }

    if (state.blend.active) {
      lines.push(
        `BLEND PROTEIN 900 G — ${state.blend.labels[state.blend.model]}`,
        `Quantidade simulada: ${formatUnits(quantity('blend'))}`,
        `Valor unitário${state.blend.model === 'hybrid' ? ' estimado' : ''}: ${BRL.format(unitPrice('blend'))}`,
        `Subtotal: ${BRL.format(productTotal('blend'))}`
      );
      if (state.blend.model === 'hybrid') {
        lines.push('Composição do híbrido: R$ 55,00/un. no escopo Vita Power + R$ 25,50/un. estimados de colágeno adquirido separadamente pela Nutriaction.');
      }
      lines.push('');
    }

    const activeProducts = PRODUCTS.filter((product) => state[product].active);
    const total = activeProducts.reduce((sum, product) => sum + productTotal(product), 0);
    lines.push(
      `INVESTIMENTO TOTAL SIMULADO: ${BRL.format(total)}`,
      '',
      'Quantidades, escopo final, prazo e condição de pagamento serão formalizados na confirmação do pedido.'
    );

    return lines.join('\n');
  }

  async function copyText(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      textarea.remove();
      if (!copied) throw error;
    }
    showToast(successMessage);
  }

  function currentScenarioUrl() {
    updateQueryString();
    return window.location.href;
  }

  async function shareScenario() {
    const data = {
      title: 'Proposta Nutriaction × Vita Power',
      text: scenarioSummary(),
      url: currentScenarioUrl()
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error && error.name === 'AbortError') return;
      }
    }

    await copyText(`${data.text}\n\n${data.url}`, 'Resumo e link copiados!');
  }

  function showToast(message) {
    const region = $('toastRegion');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    region.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2600);
  }

  function loadScenarioFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const creaModel = params.get('cm');
    const blendModel = params.get('bm');
    if (creaModel && creaModel in state.crea.prices) state.crea.model = creaModel;
    if (blendModel && blendModel in state.blend.prices) state.blend.model = blendModel;
    if (params.has('ca')) state.crea.active = params.get('ca') !== '0';
    if (params.has('ba')) state.blend.active = params.get('ba') !== '0';
    if (params.has('cq')) $('creaQty').value = clampInteger(params.get('cq'));
    if (params.has('bq')) $('blendQty').value = clampInteger(params.get('bq'));
  }

  function resetScenario() {
    state.crea.model = DEFAULTS.crea.model;
    state.crea.active = DEFAULTS.crea.active;
    state.blend.model = DEFAULTS.blend.model;
    state.blend.active = DEFAULTS.blend.active;
    $('creaQty').value = DEFAULTS.crea.qty;
    $('blendQty').value = DEFAULTS.blend.qty;
    PRODUCTS.forEach((product) => {
      updateModelCards(product);
      updateProductSwitch(product);
      renderScope(product);
    });
    recalculate();
    showToast('Cenário restaurado!');
  }

  function setupRevealAnimations() {
    const elements = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -55px 0px' });
    elements.forEach((element) => observer.observe(element));
  }

  function setupProgress() {
    const update = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percent = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
      $('progress').style.width = `${percent}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function setupDockVisibility() {
    const closing = document.querySelector('.closing');
    if (!closing || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => $('floatingDock').classList.toggle('is-hidden', entry.isIntersecting));
    }, { threshold: 0.18 });
    observer.observe(closing);
  }

  function bindEvents() {
    document.querySelectorAll('[data-product][data-model]').forEach((button) => {
      button.addEventListener('click', () => selectModel(button.dataset.product, button.dataset.model));
    });

    document.querySelectorAll('[data-toggle-product]').forEach((button) => {
      button.addEventListener('click', () => {
        const product = button.dataset.toggleProduct;
        setActive(product, !state[product].active);
      });
    });

    document.querySelectorAll('[data-step-product]').forEach((button) => {
      button.addEventListener('click', () => stepQuantity(button.dataset.stepProduct, Number(button.dataset.step)));
    });

    PRODUCTS.forEach((product) => {
      const input = $(product + 'Qty');
      input.addEventListener('input', recalculate);
      input.addEventListener('blur', () => {
        input.value = quantity(product);
        recalculate();
      });
    });

    document.querySelectorAll('[data-action="print"]').forEach((button) => button.addEventListener('click', () => window.print()));
    $('copySummary').addEventListener('click', () => copyText(scenarioSummary(), 'Resumo copiado!'));
    $('copyScenarioLink').addEventListener('click', () => copyText(currentScenarioUrl(), 'Link do cenário copiado!'));
    $('shareScenario').addEventListener('click', shareScenario);
    $('resetScenario').addEventListener('click', resetScenario);
  }

  function init() {
    loadScenarioFromUrl();
    PRODUCTS.forEach((product) => {
      updateModelCards(product);
      updateProductSwitch(product);
      renderScope(product);
    });
    bindEvents();
    recalculate();
    setupRevealAnimations();
    setupProgress();
    setupDockVisibility();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
