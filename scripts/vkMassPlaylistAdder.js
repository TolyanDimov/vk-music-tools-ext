(() => {
  const strings = {
    ru: {
      onlyVk: 'Этот инструмент работает только на VK Музыке.',
      noList: 'Не найден список треков. Откройте окно редактирования плейлиста.'
    },
    en: {
      onlyVk: 'This tool works only on VK Music.',
      noList: 'Track list not found. Open the playlist edit window.'
    },
    de: {
      onlyVk: 'Dieses Tool funktioniert nur in VK Musik.',
      noList: 'Trackliste nicht gefunden. Öffne das Playlist-Bearbeitungsfenster.'
    }
  };

  const lang = (navigator.language || 'ru').toLowerCase();
  const dict = strings[lang.slice(0, 2)] || strings.ru;
  const t = (key) => dict[key] || strings.ru[key] || key;

  const VK_HOST_RE = /(^|\.)vk\.(com|ru)$/i;
  if (!VK_HOST_RE.test(location.host)) {
    alert(t('onlyVk'));
    return;
  }

  const cfg = {
    clickDelay: 10
  };

  const state = window.__vkPlaylistOps || (window.__vkPlaylistOps = {
    stopRequested: false,
    timer: null,
    running: null,
    stop() {
      this.stopRequested = true;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.running = null;
    }
  });

  const list =
    document.querySelector('[data-audio-context="edit_playlist"]') ||
    document.querySelector('.ape_item_list[data-audio-context="edit_playlist"]') ||
    document.querySelector('.ape_item_list') ||
    document.querySelector('._ape_item_list');

  if (!list) {
    alert(t('noList'));
    return;
  }

  function collectTargets() {
    const nodes = Array.from(list.querySelectorAll(
      '[data-testid="MusicPlaylist_EditModal_MusicTrackRow"] .ape_check, .ape_check'
    ));
    console.log('vkMassPlaylistAdder: targets =', nodes.length);
    return nodes;
  }

  function toggleBatch(nodes) {
    console.log('vkMassPlaylistAdder: toggling batch');

    let index = nodes.length - 1;
    const batchSize = 250;

    const runBatch = () => {
      if (state.stopRequested) {
        state.running = null;
        state.timer = null;
        console.log('vkMassPlaylistAdder: stopped');
        return;
      }

      const end = Math.max(-1, index - batchSize);
      for (; index > end; index--) {
        const el = nodes[index];
        if (!el) continue;

        const un = el.querySelector('.ape_check--unchecked');
        const ch = el.querySelector('.ape_check--checked');

        const isVisible = (node) => {
          if (!node) return false;
          const style = getComputedStyle(node);
          return style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.visibility !== 'collapse' &&
            Number(style.opacity) !== 0;
        };
        const unVisible = isVisible(un);
        const chVisible = isVisible(ch);

        if (unVisible && !chVisible) {
          el.click();
        }
      }

      if (index < 0) {
        state.running = null;
        state.timer = null;
        console.log('vkMassPlaylistAdder: completed');
        return;
      }

      state.timer = setTimeout(runBatch, cfg.clickDelay);
    };

    runBatch();
  }

  (async () => {
    if (state.running) {
      state.stop();
    }

    state.stopRequested = false;
    state.running = 'adder';

    const checks = collectTargets();
    if (!checks.length) {
      console.warn('vkMassPlaylistAdder: no checkboxes found');
      state.running = null;
      return;
    }

    toggleBatch(checks);
  })();
})();
