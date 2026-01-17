(() => {
  if (window.__smartScrollerApi) {
    window.__smartScrollerApi.open();
    return;
  }

  const raf = () => new Promise(r => requestAnimationFrame(r));

  const CSS = `
    .ss-panel{position:fixed;left:12px;top:12px;z-index:2147483647;display:flex;flex-wrap:wrap;gap:6px;padding:8px;background:rgba(16,16,18,.92);border-radius:12px;color:#f2f0ec;font:13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 10px 22px rgba(0,0,0,.45),0 0 12px rgba(255,255,255,.08);max-width:420px;border:1px solid rgba(120,120,125,.55);align-items:center}
    .ss-btn{cursor:pointer;border:1px solid transparent;border-radius:8px;padding:6px 10px;background:linear-gradient(180deg, rgba(38,38,42,.92), rgba(18,18,20,.98));color:#f2f0ec;font-size:12px;line-height:1;transition:background .15s,border-color .15s,box-shadow .15s;box-sizing:border-box}
    .ss-btn:hover{border-color:rgba(216,209,199,.55);box-shadow:0 6px 14px rgba(0,0,0,.3),0 0 8px rgba(216,209,199,.25)}
    .ss-btn.active{background:#bdb6ad;color:#151414;box-shadow:0 0 0 1px rgba(216,209,199,.45),0 8px 16px rgba(0,0,0,.25)}
    .ss-btn.disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
    .ss-label{opacity:.85;flex:1 1 100%;order:99;text-align:center;padding:2px 4px 0;font-size:12px;min-height:14px}
    .ss-overlay{position:fixed;z-index:2147483646;pointer-events:none;border:2px dashed rgba(216,209,199,.85);background:rgba(216,209,199,.12);border-radius:6px;transition:.08s}
    .ss-overlay.locked{border:2px solid rgba(120,120,125,.95);background:rgba(120,120,125,.12);box-shadow:0 0 0 2px rgba(216,209,199,.35),0 6px 14px rgba(0,0,0,.12)}
  `;

  const style = document.createElement('style');
  style.textContent = CSS;
  (document.head || document.documentElement).appendChild(style);

  const panel = (() => {
    const box = document.createElement('div');
    box.className = 'ss-panel';
    const mk = (txt, c = '') => {
      const b = document.createElement('button');
      b.className = `ss-btn ${c}`.trim();
      b.textContent = txt;
      return b;
    };
    const down = mk('Вниз');
    const up = mk('Вверх');
    const pick = mk('Выбор');
    const vkAdd = mk('Добавить');
    const vkRemove = mk('Снять');
    const stop = mk('Стоп');
    const close = mk('Закрыть');
    const label = document.createElement('span');
    label.className = 'ss-label';
    label.textContent = 'готово';
    box.append(down, up, pick, vkAdd, vkRemove, stop, close, label);
    document.body.appendChild(box);
    return { box, down, up, pick, vkAdd, vkRemove, stop, close, label };
  })();

  const buttons = [panel.down, panel.up, panel.pick, panel.vkAdd, panel.vkRemove, panel.stop, panel.close];
  const setActive = (btn) => {
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  const setDisabled = (btn, disabled) => {
    if (!btn) return;
    if (disabled) {
      btn.classList.add('disabled');
      btn.setAttribute('disabled', 'disabled');
    } else {
      btn.classList.remove('disabled');
      btn.removeAttribute('disabled');
    }
  };

  const setVisible = (btn, visible) => {
    if (!btn) return;
    btn.style.display = visible ? '' : 'none';
  };

  function isScrollable(el) {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    return (el.scrollHeight - el.clientHeight > 8) || (cs.overflowY === 'auto' || cs.overflowY === 'scroll');
  }

  function nearestScrollable(el) {
    for (let n = el; n; n = n.parentElement) {
      if (isScrollable(n)) return n;
      if (n === document.body || n === document.documentElement) break;
    }
    return document.scrollingElement || document.documentElement;
  }

  const overlay = (() => {
    const ov = document.createElement('div');
    ov.className = 'ss-overlay';
    document.body.appendChild(ov);
    let ro = null;
    let t = null;

    const place = () => {
      if (!t) return;
      const r = t.getBoundingClientRect();
      ov.style.left = r.left - 2 + 'px';
      ov.style.top = r.top - 2 + 'px';
      ov.style.width = r.width + 4 + 'px';
      ov.style.height = r.height + 4 + 'px';
    };

    const watch = (el) => {
      if (ro) {
        try { ro.disconnect(); } catch {}
        ro = null;
      }
      if ('ResizeObserver' in window && el) {
        ro = new ResizeObserver(place);
        ro.observe(el);
      }
    };

    return {
      show(x) {
        t = x;
        ov.classList.remove('locked');
        watch(x);
        place();
      },
      lock(x) {
        t = x;
        ov.classList.add('locked');
        watch(x);
        place();
      },
      hide() {
        ov.style.width = ov.style.height = '0px';
        ov.classList.remove('locked');
        if (ro) {
          try { ro.disconnect(); } catch {}
          ro = null;
        }
      },
      destroy() {
        ov.remove();
        if (ro) {
          try { ro.disconnect(); } catch {}
          ro = null;
        }
      }
    };
  })();

  const cfg = { step: 1400, near: 4, growWaitDown: 2500, growWaitUp: 3500, maxIdle: 4, maxMs: 180000 };

  function waitForGrowth(el, prevH, ms) {
    return new Promise(res => {
      let done = false;
      const fin = v => {
        if (!done) {
          done = true;
          cle();
          res(v);
        }
      };
      let ro = null;
      let to = null;
      let p = null;
      const cle = () => {
        if (ro) {
          try { ro.disconnect(); } catch {}
          ro = null;
        }
        if (to) clearTimeout(to);
        if (p) clearInterval(p);
      };
      if ('ResizeObserver' in window) {
        ro = new ResizeObserver(() => {
          if (el.scrollHeight > prevH) fin(true);
        });
        ro.observe(el);
      } else {
        p = setInterval(() => {
          if (el.scrollHeight > prevH) fin(true);
        }, 150);
      }
      to = setTimeout(() => fin(false), ms);
    });
  }

  function waitForUpLoad(el, ms) {
    return new Promise(resolve => {
      const start = performance.now();
      const baseH = el.scrollHeight;
      const baseChild = el.childElementCount;
      const baseFirst = el.firstElementChild;
      const baseKey = baseFirst ? (baseFirst.getAttribute('data-id') || baseFirst.textContent.slice(0, 32)) : '';
      let done = false;
      let to = null;
      let mo = null;
      const finish = v => {
        if (!done) {
          done = true;
          cleanup();
          resolve(v);
        }
      };
      const cleanup = () => {
        if (to) clearTimeout(to);
        if (mo) {
          try { mo.disconnect(); } catch {}
          mo = null;
        }
      };
      try {
        mo = new MutationObserver(() => {
          const first = el.firstElementChild;
          const changedFirst = first && (first !== baseFirst);
          const childChanged = el.childElementCount > baseChild;
          const heightGrew = el.scrollHeight > baseH;
          if (childChanged || changedFirst || heightGrew) finish(true);
        });
        mo.observe(el, { childList: true, subtree: true });
      } catch {}
      to = setTimeout(() => finish(false), ms);
      const poll = setInterval(() => {
        const first = el.firstElementChild;
        const key = first ? (first.getAttribute('data-id') || first.textContent.slice(0, 32)) : '';
        if (el.childElementCount > baseChild || el.scrollHeight > baseH || key !== baseKey) {
          clearInterval(poll);
          finish(true);
        }
        if (performance.now() - start > ms) {
          clearInterval(poll);
        }
      }, 150);
    });
  }

  function doStep(el, d) {
    el.dispatchEvent(new WheelEvent('wheel', { deltaY: d, bubbles: true, cancelable: true }));
    if (el === document.body || el === document.documentElement || el === document.scrollingElement) {
      window.scrollBy(0, d);
    } else {
      el.scrollTop = Math.max(0, Math.min(el.scrollHeight, el.scrollTop + d));
    }
  }

  let running = false;
  let dir = null;
  let target = null;
  let picking = false;

  const vk = {
    running: null,
    stopRequested: false,
    timer: null,
    total: 0,
    processed: 0,
    nodes: [],
    index: -1
  };

  const vkCfg = {
    clickDelay: 3,
    batchSize: 20
  };

  const VK_HOST_RE = /(^|\.)vk\.com$/i;
  const findVkList = () =>
    document.querySelector('.ape_item_list') ||
    document.querySelector('._ape_item_list');

  const isVisible = (el) => el && getComputedStyle(el).display !== 'none';
  const isUnchecked = (el) => {
    const un = el.querySelector('.ape_check--unchecked');
    const ch = el.querySelector('.ape_check--checked');
    return isVisible(un) && !isVisible(ch);
  };
  const isChecked = (el) => {
    const un = el.querySelector('.ape_check--unchecked');
    const ch = el.querySelector('.ape_check--checked');
    return isVisible(ch) && !isVisible(un);
  };

  const collectTargets = (list, mode) => {
    const nodes = Array.from(list.querySelectorAll('.ape_check'));
    const result = [];
    nodes.forEach(el => {
      if (mode === 'add' && isUnchecked(el)) result.push(el);
      if (mode === 'remove' && isChecked(el)) result.push(el);
    });
    return result;
  };

  const vkLabels = {
    add: 'Добавить',
    remove: 'Снять'
  };

  function updateVkButtons() {
    panel.vkAdd.textContent = vkLabels.add;
    panel.vkRemove.textContent = vkLabels.remove;

    if (vk.running === 'add') {
      setActive(panel.vkAdd);
      panel.label.textContent = `Добавление: ${vk.processed}/${vk.total}`;
    } else if (vk.running === 'remove') {
      setActive(panel.vkRemove);
      panel.label.textContent = `Снятие: ${vk.processed}/${vk.total}`;
    } else {
      panel.label.textContent = 'готово';
    }
  }

  function vkFinish() {
    vk.running = null;
    vk.stopRequested = false;
    vk.timer = null;
    vk.total = 0;
    vk.processed = 0;
    vk.nodes = [];
    vk.index = -1;
    updateVkButtons();
  }

  function vkStop() {
    vk.stopRequested = true;
    if (vk.timer) {
      clearTimeout(vk.timer);
      vk.timer = null;
    }
    vkFinish();
  }

  function vkRunBatch(mode) {
    if (vk.stopRequested) {
      vkFinish();
      return;
    }

    if (vk.index < 0) {
      vkFinish();
      return;
    }

    let clicks = 0;
    while (vk.index >= 0 && clicks < vkCfg.batchSize) {
      const el = vk.nodes[vk.index];
      if (el) {
        if (mode === 'add' && isUnchecked(el)) {
          el.click();
          vk.processed++;
          clicks++;
        } else if (mode === 'remove' && isChecked(el)) {
          el.click();
          vk.processed++;
          clicks++;
        }
      }
      vk.index -= 1;
    }

    updateVkButtons();

    vk.timer = setTimeout(() => vkRunBatch(mode), vkCfg.clickDelay);
  }

  function vkStart(mode) {
    if (!VK_HOST_RE.test(location.host)) {
      panel.label.textContent = 'VK не открыт';
      return;
    }

    const list = findVkList();
    if (!list) {
      panel.label.textContent = 'Откройте редактирование плейлиста';
      return;
    }

    if (vk.running) {
      vkStop();
    }

    vk.nodes = collectTargets(list, mode);
    vk.total = vk.nodes.length;
    vk.processed = 0;
    vk.running = mode;
    vk.index = vk.nodes.length - 1;
    updateVkButtons();

    if (!vk.total) {
      vkFinish();
      return;
    }

    vkRunBatch(mode);
  }

  function updateVkAvailability() {
    const available = VK_HOST_RE.test(location.host) && !!findVkList();
    setVisible(panel.vkAdd, available);
    setVisible(panel.vkRemove, available);
    setDisabled(panel.vkAdd, !available);
    setDisabled(panel.vkRemove, !available);
  }

  async function run(direction) {
    if (!target) target = document.scrollingElement || document.documentElement;
    running = true;
    dir = direction;
    panel.label.textContent = direction === 'down' ? 'скролл вниз' : 'скролл вверх';
    setActive(direction === 'down' ? panel.down : panel.up);
    const start = performance.now();
    let idle = 0;

    while (running && dir === direction) {
      const delta = direction === 'down' ? cfg.step : -cfg.step;
      doStep(target, delta);
      await raf();

      const atBottom = target.clientHeight + target.scrollTop >= target.scrollHeight - cfg.near;
      const atTop = target.scrollTop <= cfg.near;

      if ((direction === 'down' && atBottom) || (direction === 'up' && atTop)) {
        const waitMs = direction === 'down' ? cfg.growWaitDown : cfg.growWaitUp;

        if (direction === 'up') {
          for (let i = 0; i < 3; i++) {
            doStep(target, -200);
            await raf();
          }
          target.scrollTop = 0;
        } else {
          for (let i = 0; i < 2; i++) {
            doStep(target, +200);
            await raf();
          }
        }

        const grew = direction === 'up'
          ? await waitForUpLoad(target, waitMs * (1 + idle * 0.5))
          : await waitForGrowth(target, target.scrollHeight, waitMs * (1 + idle * 0.5));

        if (!running || dir !== direction) break;
        if (!grew) {
          if (++idle >= cfg.maxIdle) break;
        } else {
          idle = 0;
          if (direction === 'up') target.scrollTop = 0;
        }
      } else {
        idle = 0;
      }

      if (performance.now() - start > cfg.maxMs) {
        console.warn('smartScroller: timeout');
        break;
      }
    }

    running = false;
    dir = null;
    panel.label.textContent = 'готово';
    setActive(null);
  }

  function startPick() {
    if (picking) return;
    picking = true;
    panel.label.textContent = 'клик для выбора, Esc отмена';
    setActive(panel.pick);
    overlay.hide();

    const move = (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cand = el ? nearestScrollable(el) : null;
      if (cand) overlay.show(cand);
    };

    const key = (e) => {
      if (e.key === 'Escape') {
        stopScroll();
        panel.label.textContent = 'отмена';
      }
    };

    const click = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cand = el ? nearestScrollable(el) : null;
      if (cand) {
        target = cand;
        overlay.lock(cand);
        stopScroll();
        panel.label.textContent = 'контейнер выбран';
        console.log('smartScroller: selected', target);
      }
    };

    const stopPick = () => {
      document.removeEventListener('mousemove', move, true);
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', key, true);
      picking = false;
    };

    document.addEventListener('mousemove', move, true);
    document.addEventListener('click', click, true);
    document.addEventListener('keydown', key, true);

    startPick.stop = stopPick;
  }

  function stopScroll() {
    running = false;
    dir = null;
    panel.label.textContent = 'остановлено';
    if (startPick.stop) startPick.stop();
  }

  function stopAll() {
    stopScroll();
    vkStop();
    setActive(panel.stop);
  }

  function closeAll() {
    running = false;
    dir = null;
    picking = false;
    if (startPick.stop) startPick.stop();
    vkStop();
    setActive(panel.close);
    overlay.destroy();
    panel.box.remove();
    style.remove();
    document.removeEventListener('keydown', escClose, true);
    delete window.__smartScrollerApi;
    console.log('smartScroller: closed');
  }

  const escClose = (e) => {
    if (e.key === 'Escape' && !picking) {
      closeAll();
    }
  };

  document.addEventListener('keydown', escClose, true);

  panel.down.onclick = () => {
    if (!target) target = document.scrollingElement;
    if (running && dir === 'down') return;
    running = false;
    dir = null;
    run('down');
  };
  panel.up.onclick = () => {
    if (!target) target = document.scrollingElement;
    if (running && dir === 'up') return;
    running = false;
    dir = null;
    run('up');
  };
  panel.pick.onclick = () => {
    running = false;
    dir = null;
    startPick();
  };
  panel.vkAdd.onclick = () => vkStart('add');
  panel.vkRemove.onclick = () => vkStart('remove');
  panel.stop.onclick = stopAll;
  panel.close.onclick = closeAll;

  updateVkAvailability();
  setInterval(updateVkAvailability, 1200);

  window.__smartScrollerApi = {
    open() {
      if (panel.box) panel.box.style.display = 'flex';
      panel.label.textContent = 'готово';
      setActive(null);
    },
    startDown() {
      panel.down.click();
    },
    startUp() {
      panel.up.click();
    },
    pick() {
      panel.pick.click();
    },
    stop: stopAll,
    vkAdd() {
      panel.vkAdd.click();
    },
    vkRemove() {
      panel.vkRemove.click();
    },
    close: closeAll
  };

  console.log('smartScroller: ready');
})();
