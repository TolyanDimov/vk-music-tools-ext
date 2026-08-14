(() => {
  if (window.__smartScrollerApi) {
    window.__smartScrollerApi.open();
    return;
  }

  const raf = () => new Promise(r => requestAnimationFrame(r));

  const strings = {
    ru: {
      down: 'Вниз',
      up: 'Вверх',
      pick: 'Контейнер',
      add: 'Добавить',
      import: 'Из файла',
      export: 'Экспорт TXT',
      importReadError: 'Не удалось прочитать TXT-файл',
      exportNoTracks: 'Треки для экспорта не найдены',
      smoothLabel: 'Плавность прокрутки',
      random: 'Случайный порядок',
      batchLabel: 'За раз:',
      batchInvalid: 'Укажите размер пакета от 1 до 100.',
      remove: 'Снять',
      stop: 'Стоп',
      close: 'Закрыть',
      ready: 'готово',
      scrollDown: 'скролл вниз',
      scrollUp: 'скролл вверх',
      pickHint: 'клик для выбора, Esc отмена',
      cancelled: 'отмена',
      selected: 'контейнер выбран',
      stopped: 'остановлено',
      vkNotOpen: 'VK не открыт',
      vkNeedEdit: 'Откройте редактирование плейлиста',
      importEmpty: 'Список треков пуст',
      importNoMatches: 'Совпадения с треками на странице не найдены',
      addLimitPrompt: 'Сколько треков добавить? Введите число. Пустое значение — добавить все найденные.',
      addLimitInvalid: 'Введите положительное целое число или оставьте поле пустым.',
      addProgress: (p, t) => `Добавление: ${p}/${t}`,
      removeProgress: (p, t) => `Снятие: ${p}/${t}`,
      deleteStarting: (t) => `Удаление: 0/${t}`,
      deleteProgress: (d, f, t) => f ? `Удаление: ${d}/${t}, ошибок: ${f}` : `Удаление: ${d}/${t}`,
      deleteDone: (d, f, t) => f ? `Удалено: ${d}/${t}, ошибок: ${f}` : `Удалено: ${d}/${t}`,
      deleteStopped: (d, f, t) => f ? `Остановлено: ${d}/${t}, ошибок: ${f}` : `Остановлено: ${d}/${t}`,
      deleteError: 'Ошибка удаления'
    },
    en: {
      down: 'Down',
      up: 'Up',
      pick: 'Container',
      add: 'Add',
      import: 'From file',
      export: 'Export TXT',
      importReadError: 'Could not read the TXT file',
      exportNoTracks: 'No tracks found to export',
      smoothLabel: 'Smooth scrolling',
      random: 'Random order',
      batchLabel: 'Per batch:',
      batchInvalid: 'Enter a batch size from 1 to 100.',
      remove: 'Remove',
      stop: 'Stop',
      close: 'Close',
      ready: 'ready',
      scrollDown: 'scrolling down',
      scrollUp: 'scrolling up',
      pickHint: 'click to select, Esc to cancel',
      cancelled: 'cancelled',
      selected: 'container selected',
      stopped: 'stopped',
      vkNotOpen: 'VK not open',
      vkNeedEdit: 'Open playlist edit mode',
      importEmpty: 'The track list is empty',
      importNoMatches: 'No tracks from the file were found on the page',
      addLimitPrompt: 'How many tracks should be added? Enter a number. Leave empty to add all found tracks.',
      addLimitInvalid: 'Enter a positive whole number or leave the field empty.',
      addProgress: (p, t) => `Adding: ${p}/${t}`,
      removeProgress: (p, t) => `Removing: ${p}/${t}`,
      deleteStarting: (t) => `Deleting: 0/${t}`,
      deleteProgress: (d, f, t) => f ? `Deleting: ${d}/${t}, errors: ${f}` : `Deleting: ${d}/${t}`,
      deleteDone: (d, f, t) => f ? `Deleted: ${d}/${t}, errors: ${f}` : `Deleted: ${d}/${t}`,
      deleteStopped: (d, f, t) => f ? `Stopped: ${d}/${t}, errors: ${f}` : `Stopped: ${d}/${t}`,
      deleteError: 'Deletion error'
    },
    de: {
      down: 'Runter',
      up: 'Hoch',
      pick: 'Container',
      add: 'Hinzufügen',
      import: 'Aus Datei',
      export: 'TXT exportieren',
      importReadError: 'TXT-Datei konnte nicht gelesen werden',
      exportNoTracks: 'Keine Titel zum Exportieren gefunden',
      smoothLabel: 'Sanftes Scrollen',
      random: 'Zufällige Reihenfolge',
      batchLabel: 'Pro Paket:',
      batchInvalid: 'Gib eine Paketgröße von 1 bis 100 ein.',
      remove: 'Entfernen',
      stop: 'Stopp',
      close: 'Schließen',
      ready: 'bereit',
      scrollDown: 'nach unten',
      scrollUp: 'nach oben',
      pickHint: 'klicken zum Wählen, Esc zum Abbrechen',
      cancelled: 'abgebrochen',
      selected: 'Container gewählt',
      stopped: 'gestoppt',
      vkNotOpen: 'VK nicht geöffnet',
      vkNeedEdit: 'Playlist-Bearbeitung öffnen',
      importEmpty: 'Die Titelliste ist leer',
      importNoMatches: 'Keine Titel aus der Datei auf der Seite gefunden',
      addLimitPrompt: 'Wie viele Titel sollen hinzugefügt werden? Zahl eingeben. Leer lassen, um alle gefundenen Titel hinzuzufügen.',
      addLimitInvalid: 'Gib eine positive ganze Zahl ein oder lasse das Feld leer.',
      addProgress: (p, t) => `Hinzufügen: ${p}/${t}`,
      removeProgress: (p, t) => `Entfernen: ${p}/${t}`,
      deleteStarting: (t) => `Löschen: 0/${t}`,
      deleteProgress: (d, f, t) => f ? `Löschen: ${d}/${t}, Fehler: ${f}` : `Löschen: ${d}/${t}`,
      deleteDone: (d, f, t) => f ? `Gelöscht: ${d}/${t}, Fehler: ${f}` : `Gelöscht: ${d}/${t}`,
      deleteStopped: (d, f, t) => f ? `Gestoppt: ${d}/${t}, Fehler: ${f}` : `Gestoppt: ${d}/${t}`,
      deleteError: 'Löschfehler'
    }
  };

  const lang = (navigator.language || 'ru').toLowerCase();
  const dict = strings[lang.slice(0, 2)] || strings.ru;
  const t = (key, ...args) => {
    const val = dict[key] || strings.ru[key] || key;
    return typeof val === 'function' ? val(...args) : val;
  };

  const CSS = `
    .ss-panel{position:fixed;left:12px;top:12px;z-index:2147483647;display:flex;flex-direction:column;gap:7px;width:min(460px,calc(100vw - 24px));padding:10px;background:rgba(16,16,18,.94);border-radius:13px;color:#f2f0ec;font:13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 10px 22px rgba(0,0,0,.45),0 0 12px rgba(255,255,255,.08);border:1px solid rgba(120,120,125,.55);align-items:stretch}
    .ss-row{display:flex;gap:6px;align-items:stretch}
    .ss-btn{flex:1 1 0;min-width:0;cursor:pointer;border:1px solid transparent;border-radius:8px;padding:7px 10px;background:linear-gradient(180deg, rgba(38,38,42,.92), rgba(18,18,20,.98));color:#f2f0ec;font-size:12px;line-height:1;transition:background .15s,border-color .15s,box-shadow .15s;box-sizing:border-box}
    .ss-btn:hover{border-color:rgba(216,209,199,.55);box-shadow:0 6px 14px rgba(0,0,0,.3),0 0 8px rgba(216,209,199,.25)}
    .ss-btn.active{background:#bdb6ad;color:#151414;box-shadow:0 0 0 1px rgba(216,209,199,.45),0 8px 16px rgba(0,0,0,.25)}
    .ss-btn.disabled{opacity:.45;cursor:not-allowed;box-shadow:none}
    .ss-btn.file-action{min-width:0}
    .ss-label{opacity:.8;border-top:1px solid rgba(120,120,125,.28);padding:7px 4px 0;text-align:center;font-size:11px;min-height:13px}
    .ss-settings{display:flex;align-items:stretch;justify-content:center;border-top:1px solid rgba(120,120,125,.28);border-bottom:1px solid rgba(120,120,125,.28);padding:5px 0;gap:0}
    .ss-option{display:flex;align-items:center;justify-content:center;gap:5px;padding:2px 10px;white-space:nowrap;font-size:12px;cursor:pointer;user-select:none}
    .ss-random-option{flex:1 1 auto}
    .ss-smooth-option{border-right:1px solid rgba(120,120,125,.4);color:rgba(242,240,236,.86)}
    .ss-batch-option{border-left:1px solid rgba(120,120,125,.4);color:rgba(242,240,236,.86)}
    .ss-option input{margin:0;accent-color:#bdb6ad}
    .ss-batch{width:52px;margin-left:2px;padding:4px 5px;border:1px solid rgba(120,120,125,.55);border-radius:6px;background:#202024;color:#f2f0ec;font-size:12px;box-sizing:border-box}
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
    const down = mk(t('down'));
    const up = mk(t('up'));
    const pick = mk(t('pick'));
    const vkAdd = mk(t('add'));
    const vkImport = mk(t('import'), 'file-action');
    const vkRemove = mk(t('remove'));
    const vkExport = mk(t('export'), 'file-action');
    const trackFile = document.createElement('input');
    trackFile.type = 'file';
    trackFile.accept = '.txt,text/plain';
    trackFile.style.display = 'none';
    const smoothScroll = document.createElement('input');
    smoothScroll.type = 'checkbox';
    smoothScroll.checked = true;
    const smoothOption = document.createElement('label');
    smoothOption.className = 'ss-option ss-smooth-option';
    smoothOption.append(smoothScroll, document.createTextNode(t('smoothLabel')));
    const randomOption = document.createElement('label');
    randomOption.className = 'ss-option';
    const random = document.createElement('input');
    random.type = 'checkbox';
    randomOption.append(random, document.createTextNode(t('random')));
    randomOption.classList.add('ss-random-option');
    const settings = document.createElement('div');
    settings.className = 'ss-settings';
    const batchSize = document.createElement('input');
    batchSize.className = 'ss-batch';
    batchSize.type = 'number';
    batchSize.min = '1';
    batchSize.max = '100';
    batchSize.step = '1';
    batchSize.value = '10';
    batchSize.title = 'Количество треков за один пакет';
    const batchOption = document.createElement('label');
    batchOption.className = 'ss-option ss-batch-option';
    batchOption.append(document.createTextNode(t('batchLabel')), batchSize);
    settings.append(smoothOption, randomOption, batchOption);
    const stop = mk(t('stop'));
    const close = mk(t('close'));
    const label = document.createElement('span');
    label.className = 'ss-label';
    label.textContent = t('ready');
    const row = (...items) => {
      const el = document.createElement('div');
      el.className = 'ss-row';
      el.append(...items);
      return el;
    };
    box.append(
      row(up, down, pick),
      row(vkAdd, vkImport, vkRemove),
      settings,
      row(stop, close, vkExport),
      label
    );
    box.appendChild(trackFile);
    document.body.appendChild(box);
    return { box, down, up, pick, vkAdd, vkImport, vkRemove, vkExport, trackFile, random, batchSize, smoothScroll, stop, close, label };
  })();

  const buttons = [panel.down, panel.up, panel.pick, panel.vkAdd, panel.vkImport, panel.vkRemove, panel.vkExport, panel.stop, panel.close];
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

  const cfg = {
    step: 1400,
    near: 4,
    bottomNudge: 1000,
    bottomPause: 1400,
    fastBottomPause: 150,
    growWaitDown: 4200,
    fastGrowWaitDown: 700,
    growWaitUp: 2200,
    scrollSegmentMin: 95,
    scrollSegmentMax: 185,
    scrollPauseMin: 28,
    scrollPauseMax: 68,
    stepPauseUpMin: 320,
    stepPauseUpMax: 560,
    stepPauseDownMin: 110,
    stepPauseDownMax: 220,
    bottomRetryPauseMin: 900,
    bottomRetryPauseMax: 1700,
    fastBottomRetryPause: 100,
    maxIdle: 4,
    maxMs: 180000
  };

  const getScrollTop = (el) => (
    el === document.body || el === document.documentElement || el === document.scrollingElement
      ? window.scrollY || el.scrollTop
      : el.scrollTop
  );

  const setScrollTop = (el, value) => {
    if (el === document.body || el === document.documentElement || el === document.scrollingElement) {
      window.scrollTo(0, value);
    } else {
      el.scrollTop = value;
    }
    // VK's lazy loaders listen to scroll events on the selected container.
    el.dispatchEvent(new Event('scroll', { bubbles: true }));
  };

  const getMaxScrollTop = (el) => Math.max(0, el.scrollHeight - el.clientHeight);

  const getTrackNudge = () => {
    const rows = Array.from(document.querySelectorAll(
      '[data-sortable-id][draggable="true"], [data-testid="MusicPlaylistTracks_MusicTrackRow"]'
    ))
      .map(row => row.getBoundingClientRect().height)
      .filter(height => height > 20 && height < 240)
      .sort((a, b) => a - b);
    const rowHeight = rows.length ? rows[Math.floor(rows.length / 2)] : 64;
    const trackCount = 8 + Math.floor(Math.random() * 8);
    return Math.min(cfg.bottomNudge, Math.max(120, rowHeight * trackCount));
  };

  const dispatchWheel = (el, deltaY) => {
    if (typeof WheelEvent !== 'function') return;
    el.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      composed: true,
      deltaX: 0,
      deltaY,
      deltaZ: 0,
      deltaMode: 0
    }));
  };

  const wheelStep = async (el, deltaY) => {
    if (panel.smoothScroll.checked) {
      await smoothMove(el, deltaY);
      return;
    }
    dispatchWheel(el, deltaY);
    doStep(el, deltaY);
    await raf();
  };

  const randomBetween = (min, max) => min + Math.random() * (max - min);

  // Move through short, slightly varied segments. This gives VK regular
  // scroll events and lets lazy loaders react between movements.
  async function smoothMove(el, distance) {
    let remaining = distance;
    const sign = Math.sign(distance) || 1;
    const factor = 1;

    while (Math.abs(remaining) > 1) {
      if (!running && dir) return;

      // React immediately if the user switches the checkbox while moving.
      if (!panel.smoothScroll.checked) {
        dispatchWheel(el, remaining);
        doStep(el, remaining);
        await raf();
        return;
      }

      const amount = Math.min(
        Math.abs(remaining),
        randomBetween(cfg.scrollSegmentMin / factor, cfg.scrollSegmentMax / factor)
      );
      const delta = sign * amount;
      dispatchWheel(el, delta);
      doStep(el, delta);
      remaining -= delta;

      await new Promise(resolve => setTimeout(
        resolve,
        randomBetween(cfg.scrollPauseMin * factor, cfg.scrollPauseMax * factor)
      ));
    }

    await raf();
  }

  async function triggerBottomLoad(el) {
    const nudge = getTrackNudge();
    const maxTop = getMaxScrollTop(el);
    const currentTop = Math.min(getScrollTop(el), maxTop);

    // VK's current "My tracks" loader expects a real wheel-like up/down
    // sequence. A write to scrollTop while already at max is ignored by it.
    if (currentTop >= maxTop - cfg.near) {
      await wheelStep(el, -nudge);
    }

    await wheelStep(el, nudge * 1.5);
    setScrollTop(el, getMaxScrollTop(el));
    const pause = panel.smoothScroll.checked ? cfg.bottomPause : cfg.fastBottomPause;
    await new Promise(resolve => setTimeout(resolve, pause));
  }

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
    if (el === document.body || el === document.documentElement || el === document.scrollingElement) {
      window.scrollBy(0, d);
    } else {
      el.scrollTop = Math.max(0, Math.min(el.scrollHeight, el.scrollTop + d));
    }
  }

  let running = false;
  let dir = null;
  let target = null;
  let targetPicked = false;
  let picking = false;

  const vk = {
    running: null,
    stopRequested: false,
    timer: null,
    total: 0,
    processed: 0,
    targetKeys: new Set(),
    processedKeys: new Set(),
    targetOrder: [],
    randomOrder: false,
    fileOrder: false,
    batchSize: 10,
    emptyBatches: 0
  };

  const vkCfg = {
    clickDelay: 80
  };

  const VK_HOST_RE = /(^|\.)vk\.(com|ru)$/i;
  const findVkList = () =>
    document.querySelector('[data-audio-context="edit_playlist"]') ||
    document.querySelector('[data-testid="MusicPlaylist_EditModal"] [data-audio-context="edit_playlist"]') ||
    document.querySelector('.ape_item_list[data-audio-context="edit_playlist"]') ||
    document.querySelector('.ape_item_list') ||
    document.querySelector('._ape_item_list');

  const isVisible = (el) => {
    if (!el) return false;
    const style = getComputedStyle(el);
    return style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.visibility !== 'collapse' &&
      Number(style.opacity) !== 0;
  };

  const getCheck = (el) => el?.matches('.ape_check')
    ? el
    : el?.querySelector('.ape_check');

  const getNodeKey = (el) => {
    const row = el?.closest(
      '[data-testid="MusicPlaylist_EditModal_MusicTrackRow"],' +
      ' [data-testid="MusicPlaylistTracks_MusicTrackRow"],' +
      ' [data-testid="MusicPage_MusicTrackRow"],' +
      ' [data-testid="MusicTrackRow"],' +
      ' .ape_audio_item_wrap'
    );
    const audioRow = row?.querySelector('[data-full-id]') || el?.closest('[data-full-id]');
    const key = audioRow?.getAttribute('data-full-id') || row?.getAttribute('data-audio-id');
    return key || row || el;
  };

  const isUnchecked = (el) => {
    const check = getCheck(el);
    const un = check?.querySelector('.ape_check--unchecked');
    const ch = check?.querySelector('.ape_check--checked');
    return isVisible(un) && !isVisible(ch);
  };
  const isChecked = (el) => {
    const check = getCheck(el);
    const un = check?.querySelector('.ape_check--unchecked');
    const ch = check?.querySelector('.ape_check--checked');
    return isVisible(ch) && !isVisible(un);
  };

  const collectTargets = (list, mode) => {
    const nodes = Array.from(list.querySelectorAll(
      '[data-testid="MusicPlaylist_EditModal_MusicTrackRow"] .ape_check, .ape_check'
    ));
    const result = [];
    nodes.forEach(el => {
      if (mode === 'add' && isUnchecked(el)) result.push(el);
      if (mode === 'remove' && isChecked(el)) result.push(el);
    });
    return result;
  };

  const collectCurrentTargets = (list, mode) => collectTargets(list, mode)
    .filter(el => {
      const key = getNodeKey(el);
      return vk.targetKeys.has(key) && !vk.processedKeys.has(key);
    });

  const vkLabels = {
    add: t('add'),
    remove: t('remove')
  };

  function updateVkButtons() {
    panel.vkAdd.textContent = vkLabels.add;
    panel.vkRemove.textContent = vkLabels.remove;

    if (vk.running === 'add') {
      setActive(panel.vkAdd);
      panel.label.textContent = t('addProgress', vk.processed, vk.total);
    } else if (vk.running === 'remove') {
      setActive(panel.vkRemove);
      panel.label.textContent = t('removeProgress', vk.processed, vk.total);
    } else {
      panel.label.textContent = t('ready');
    }
  }

  function vkFinish() {
    vk.running = null;
    vk.stopRequested = false;
    vk.timer = null;
    vk.total = 0;
    vk.processed = 0;
    vk.targetKeys = new Set();
    vk.processedKeys = new Set();
    vk.targetOrder = [];
    vk.randomOrder = false;
    vk.fileOrder = false;
    vk.batchSize = 10;
    vk.emptyBatches = 0;
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

    const list = findVkList();
    if (!list) {
      vkFinish();
      return;
    }

    const current = collectCurrentTargets(list, mode);
    const batch = vk.fileOrder
      ? vk.targetOrder
        .map(key => current.find(el => getNodeKey(el) === key))
        .filter(Boolean)
        .slice(0, vk.batchSize)
      : vk.randomOrder
      ? current.sort((a, b) => vk.targetOrder.indexOf(getNodeKey(a)) - vk.targetOrder.indexOf(getNodeKey(b))).slice(0, vk.batchSize)
      : current.slice(-vk.batchSize);
    if (!batch.length) {
      if (++vk.emptyBatches <= 10) {
        vk.timer = setTimeout(() => vkRunBatch(mode), 200);
        return;
      }
      vkFinish();
      return;
    }

    vk.emptyBatches = 0;
    for (const el of batch) {
      const key = getNodeKey(el);
      const check = getCheck(el);
      if (!check || vk.processedKeys.has(key)) continue;
      check.click();
      vk.processedKeys.add(key);
      vk.processed++;
    }

    updateVkButtons();
    if (vk.processed >= vk.total) {
      vkFinish();
      return;
    }

    vk.timer = setTimeout(() => vkRunBatch(mode), vkCfg.clickDelay);
  }

  function waitForDownLoad(el, prevH, ms) {
    return new Promise(resolve => {
      const start = performance.now();
      const baseChild = el.childElementCount;
      const baseLast = el.lastElementChild;
      let done = false;
      let to = null;
      let mo = null;
      let poll = null;
      const finish = value => {
        if (done) return;
        done = true;
        if (to) clearTimeout(to);
        if (poll) clearInterval(poll);
        if (mo) {
          try { mo.disconnect(); } catch {}
        }
        resolve(value);
      };
      const changed = () => el.scrollHeight > prevH ||
        el.childElementCount !== baseChild ||
        el.lastElementChild !== baseLast;

      try {
        mo = new MutationObserver(() => {
          if (changed()) finish(true);
        });
        mo.observe(el, { childList: true, subtree: true });
      } catch {}

      poll = setInterval(() => {
        if (changed() || performance.now() - start >= ms) {
          finish(changed());
        }
      }, 150);
      to = setTimeout(() => finish(false), ms);
    });
  }

  function vkStart(mode) {
    if (!VK_HOST_RE.test(location.host)) {
      panel.label.textContent = t('vkNotOpen');
      return;
    }

    const list = findVkList();
    if (!list) {
      panel.label.textContent = t('vkNeedEdit');
      return;
    }

    if (vk.running) {
      vkStop();
    }

    let addLimit = null;
    if (mode === 'add') {
      const answer = window.prompt(t('addLimitPrompt'), '');
      if (answer === null) {
        panel.label.textContent = t('ready');
        return;
      }

      const value = answer.trim();
      if (value) {
        addLimit = Number(value);
        if (!Number.isSafeInteger(addLimit) || addLimit <= 0) {
          window.alert(t('addLimitInvalid'));
          return;
        }
      }

    }

    const batchSize = Number(panel.batchSize.value);
    if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 100) {
      window.alert(t('batchInvalid'));
      return;
    }
    vk.batchSize = batchSize;

    const candidates = collectTargets(list, mode);
    let selected = candidates;
    if (mode === 'add' && panel.random.checked) {
      selected = [...candidates];
      for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }
      if (addLimit !== null) selected = selected.slice(0, addLimit);
    } else if (mode === 'add' && addLimit !== null) {
      selected = candidates.slice(-addLimit);
    }
    vk.targetKeys = new Set(selected.map(getNodeKey));
    vk.processedKeys = new Set();
    vk.targetOrder = selected.map(getNodeKey);
    vk.randomOrder = mode === 'add' && panel.random.checked;
    vk.fileOrder = false;
    vk.emptyBatches = 0;
    vk.total = vk.targetKeys.size;
    vk.processed = 0;
    vk.running = mode;
    updateVkButtons();

    if (!vk.total) {
      vkFinish();
      return;
    }

    vkRunBatch(mode);
  }

  const normalizeTrackText = value => (value || '')
    .replace(/^\uFEFF/, '')
    .replace(/^\s*\d+\s*[.)]\s*/, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();

  const getTrackParts = row => {
    const titleEl = row.querySelector('[data-testid="MusicTrackRow_Title"]');
    const authorsAnchor = row.querySelector('[data-testid="MusicTrackRow_Authors"]');
    if (titleEl && authorsAnchor) {
      const artistContainer = authorsAnchor.closest('.vkitAudioRowInfo__text--Rrhr2') || authorsAnchor;
      const artist = artistContainer.textContent.trim().replace(/\s+/g, ' ');
      const title = titleEl.textContent.trim().replace(/\s+/g, ' ');
      return artist && title ? { artist, title } : null;
    }

    const artistEl = row.querySelector('.audio_row__performers');
    const titleElLegacy = row.querySelector(
      'a[data-testid="audio_row_title"], ._audio_row__title_inner, .audio_row__title_inner'
    );
    if (!artistEl || !titleElLegacy) return null;
    return {
      artist: artistEl.textContent.trim(),
      title: titleElLegacy.textContent.trim()
    };
  };

  const getTrackText = row => {
    const parts = getTrackParts(row);
    return parts ? `${parts.artist} - ${parts.title}` : '';
  };

  const splitImportedTrack = line => {
    const value = line.replace(/^\s*\d+\s*[.)]\s*/, '').trim();
    const separator = value.lastIndexOf(' - ');
    if (separator < 1) return { full: value, artist: '', title: '' };
    return {
      full: value,
      artist: value.slice(0, separator).trim(),
      title: value.slice(separator + 3).trim()
    };
  };

  const trackMatches = (line, row) => {
    const parts = getTrackParts(row);
    if (!parts) return false;

    const target = splitImportedTrack(line);
    const rowFull = normalizeTrackText(`${parts.artist} - ${parts.title}`);
    if (rowFull === normalizeTrackText(target.full)) return true;
    if (!target.artist || !target.title) return false;

    const rowArtist = normalizeTrackText(parts.artist);
    const rowTitle = normalizeTrackText(parts.title);
    const targetArtists = normalizeTrackText(target.artist)
      .split(/\s*,\s*|\s+&\s+|\s+(?:feat\.?|ft\.?)\s+/i)
      .map(value => value.trim())
      .filter(Boolean);
    const targetTitle = normalizeTrackText(target.title);
    const artistMatches = targetArtists.some(targetArtist =>
      rowArtist.includes(targetArtist) || targetArtist.includes(rowArtist)
    );
    return artistMatches &&
      (rowTitle.includes(targetTitle) || targetTitle.includes(rowTitle));
  };

  function vkStartFromFile(lines) {
    if (!VK_HOST_RE.test(location.host)) {
      panel.label.textContent = t('vkNotOpen');
      return;
    }

    const list = findVkList();
    if (!list) {
      panel.label.textContent = t('vkNeedEdit');
      return;
    }

    lines = Array.isArray(lines) ? lines : [];
    if (!lines.length) {
      panel.label.textContent = t('importEmpty');
      return;
    }

    if (vk.running) vkStop();

    const batchSize = Number(panel.batchSize.value);
    if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 100) {
      window.alert(t('batchInvalid'));
      return;
    }

    const rows = Array.from(list.querySelectorAll(
      '[data-testid="MusicPlaylist_EditModal_MusicTrackRow"],' +
      ' [data-testid="MusicPlaylistTracks_MusicTrackRow"],' +
      ' [data-testid="MusicPage_MusicTrackRow"],' +
      ' [data-testid="MusicTrackRow"],' +
      ' .ape_audio_item_wrap'
    ));
    const available = [];
    rows.forEach(row => {
      const check = getCheck(row);
      if (!getTrackText(row) || !check || !isUnchecked(check)) return;
      available.push({ row, check });
    });

    const selected = [];
    const missing = [];
    [...lines].reverse().forEach(line => {
      const index = available.findIndex(item => trackMatches(line, item.row));
      if (index < 0) {
        missing.push(line);
        return;
      }
      selected.push(available[index].check);
      available.splice(index, 1);
    });

    vk.targetKeys = new Set(selected.map(getNodeKey));
    vk.processedKeys = new Set();
    vk.targetOrder = selected.map(getNodeKey);
    vk.randomOrder = false;
    vk.fileOrder = true;
    vk.emptyBatches = 0;
    vk.total = vk.targetKeys.size;
    vk.processed = 0;
    vk.batchSize = batchSize;
    vk.running = 'add';
    updateVkButtons();

    if (missing.length) console.warn('smartScroller: tracks not found:', missing);
    if (!vk.total) {
      panel.label.textContent = t('importNoMatches');
      vkFinish();
      return;
    }

    vkRunBatch('add');
  }

  function exportPlaylistFromPanel() {
    const rowSelector =
      '[data-testid="MusicPlaylistTracks_MusicTrackRow"],' +
      ' [data-testid="MusicPlaylist_EditModal_MusicTrackRow"],' +
      ' [data-testid="MusicPage_MusicTrackRow"],' +
      ' [data-testid="MusicTrackRow"],' +
      ' .audio_row';
    const scopedRows = target && typeof target.querySelectorAll === 'function'
      ? Array.from(target.querySelectorAll(rowSelector))
      : [];
    const rows = targetPicked
      ? scopedRows
      : Array.from(document.querySelectorAll(rowSelector));
    const lines = [];
    const exported = new Set();

    rows.forEach(row => {
      const titleEl = row.querySelector(
        '[data-testid="MusicTrackRow_Title"], a[data-testid="audio_row_title"], ._audio_row__title_inner, .audio_row__title_inner'
      );
      const authorEls = Array.from(row.querySelectorAll('[data-testid="MusicTrackRow_Authors"]'));
      const legacyAuthor = row.querySelector('.audio_row__performers');
      const authors = authorEls.length
        ? authorEls.map(el => el.textContent.trim().replace(/\s+/g, ' '))
        : legacyAuthor ? [legacyAuthor.textContent.trim().replace(/\s+/g, ' ')] : [];
      const artist = authors.filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(', ');
      const title = titleEl?.textContent.trim().replace(/\s+/g, ' ');
      const line = artist && title ? `${artist} - ${title}` : '';
      const key = normalizeTrackText(line);
      if (line && !exported.has(key)) {
        exported.add(key);
        lines.push(line);
      }
    });

    if (!lines.length) {
      panel.label.textContent = t('exportNoTracks');
      return;
    }

    const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vk_playlist.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    panel.label.textContent = `${t('export')}: ${lines.length}`;
  }

  function updateVkAvailability() {
    const available = VK_HOST_RE.test(location.host) && !!findVkList();
    setVisible(panel.vkAdd, available);
    setVisible(panel.vkRemove, available);
    setDisabled(panel.vkAdd, !available);
    setDisabled(panel.vkRemove, !available);
  }

  function handleVkAudioDeleteProgress(event) {
    let detail = {};
    try {
      detail = event.detail || {};
    } catch {
      detail = {};
    }
    if (!detail.status) {
      try {
        detail = JSON.parse(document.documentElement.dataset.vkAudioDeleterProgress || '{}');
      } catch {
        detail = {};
      }
    }
    const deleted = Number(detail.deleted || 0);
    const failed = Number(detail.failed || 0);
    const total = Number(detail.total || 0);

    if (detail.status === 'starting') {
      panel.label.textContent = t('deleteStarting', total);
    } else if (detail.status === 'progress') {
      panel.label.textContent = t('deleteProgress', deleted, failed, total);
    } else if (detail.status === 'completed') {
      panel.label.textContent = t('deleteDone', deleted, failed, total);
    } else if (detail.status === 'stopped') {
      panel.label.textContent = t('deleteStopped', deleted, failed, total);
    } else if (detail.status === 'error') {
      panel.label.textContent = detail.message || t('deleteError');
    }
  }

  async function run(direction) {
    if (!target) target = document.scrollingElement || document.documentElement;
    running = true;
    dir = direction;
    panel.label.textContent = direction === 'down' ? t('scrollDown') : t('scrollUp');
    setActive(direction === 'down' ? panel.down : panel.up);
    const start = performance.now();
    let idle = 0;

    while (running && dir === direction) {
      const delta = direction === 'down' ? cfg.step : -cfg.step;
      if (panel.smoothScroll.checked) {
        await smoothMove(target, delta);
      } else {
        dispatchWheel(target, delta);
        doStep(target, delta);
        await raf();
      }
      if (!running || dir !== direction) break;
      if (panel.smoothScroll.checked) {
        await new Promise(resolve => setTimeout(
          resolve,
          direction === 'up'
            ? randomBetween(cfg.stepPauseUpMin, cfg.stepPauseUpMax)
            : randomBetween(cfg.stepPauseDownMin, cfg.stepPauseDownMax)
        ));
      }

      const atBottom = target.clientHeight + target.scrollTop >= target.scrollHeight - cfg.near;
      const atTop = target.scrollTop <= cfg.near;

      if ((direction === 'down' && atBottom) || (direction === 'up' && atTop)) {
        const waitMs = direction === 'down'
          ? (panel.smoothScroll.checked ? cfg.growWaitDown : cfg.fastGrowWaitDown)
          : cfg.growWaitUp;
        const previousHeight = target.scrollHeight;

        if (direction === 'up') {
          for (let i = 0; i < 3; i++) {
            await wheelStep(target, -200);
          }
          target.scrollTop = 0;
        } else {
          await triggerBottomLoad(target);
        }

        const grew = direction === 'up'
          ? await waitForUpLoad(target, waitMs * (1 + idle * 0.5))
          : await waitForDownLoad(target, previousHeight, waitMs * (1 + idle * 0.5));

        if (!running || dir !== direction) break;
        if (!grew) {
          idle++;
          if (direction === 'down' && idle < cfg.maxIdle) {
            await new Promise(resolve => setTimeout(
              resolve,
              panel.smoothScroll.checked
                ? randomBetween(cfg.bottomRetryPauseMin, cfg.bottomRetryPauseMax)
                : cfg.fastBottomRetryPause
            ));
          }
          if (idle >= cfg.maxIdle) break;
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
    panel.label.textContent = t('ready');
    setActive(null);
  }

  function startPick() {
    if (picking) return;
    picking = true;
    panel.label.textContent = t('pickHint');
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
        panel.label.textContent = t('cancelled');
      }
    };

    const click = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cand = el ? nearestScrollable(el) : null;
      if (cand) {
        target = cand;
        targetPicked = true;
        overlay.lock(cand);
        stopScroll();
        panel.label.textContent = t('selected');
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
    panel.label.textContent = t('stopped');
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
    delete window.__smartScrollerApi;
    document.removeEventListener('keydown', escClose, true);
    document.removeEventListener('vk-audio-deleter-progress', handleVkAudioDeleteProgress, false);
    clearInterval(vkAvailabilityTimer);
    console.log('smartScroller: closed');
  }

  const escClose = (e) => {
    if (e.key === 'Escape' && !picking) {
      closeAll();
    }
  };

  document.addEventListener('keydown', escClose, true);
  document.addEventListener('vk-audio-deleter-progress', handleVkAudioDeleteProgress, false);

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
  panel.vkImport.onclick = () => {
    panel.trackFile.value = '';
    panel.trackFile.click();
  };
  panel.vkRemove.onclick = () => vkStart('remove');
  panel.vkExport.onclick = exportPlaylistFromPanel;
  panel.trackFile.addEventListener('change', async () => {
    const file = panel.trackFile.files && panel.trackFile.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
      vkStartFromFile(lines);
    } catch (error) {
      console.error(error);
      panel.label.textContent = t('importReadError');
    }
  });
  panel.stop.onclick = stopAll;
  panel.close.onclick = closeAll;

  updateVkAvailability();
  const vkAvailabilityTimer = setInterval(updateVkAvailability, 1200);

  window.__smartScrollerApi = {
    open() {
      if (panel.box) panel.box.style.display = 'flex';
      panel.label.textContent = t('ready');
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
    vkImport(lines) {
      if (Array.isArray(lines)) {
        vkStartFromFile(lines);
      } else {
        panel.vkImport.click();
      }
    },
    vkExport: exportPlaylistFromPanel,
    close: closeAll
  };

  console.log('smartScroller: ready');
})();
