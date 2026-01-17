(() => {
  const VK_HOST_RE = /(^|\.)vk\.com$/i;
  if (!VK_HOST_RE.test(location.host)) {
    alert('Этот инструмент работает только на VK Музыке.');
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
        clearInterval(this.timer);
        this.timer = null;
      }
      this.running = null;
    }
  });

  const list =
    document.querySelector('.ape_item_list') ||
    document.querySelector('._ape_item_list');

  if (!list) {
    alert('Не найден список треков. Откройте окно редактирования плейлиста.');
    return;
  }

  function collectTargets() {
    const nodes = Array.from(list.querySelectorAll('.ape_check'));
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

        const unVisible = un && getComputedStyle(un).display !== 'none';
        const chVisible = ch && getComputedStyle(ch).display !== 'none';

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
