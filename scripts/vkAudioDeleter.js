(() => {
  const strings = {
    ru: {
      onlyVk: 'Этот инструмент работает только на VK Музыке.',
      missingApi: 'Не найдены API VK для удаления. Откройте старый интерфейс списка аудио или обновите страницу.',
      noMusicAudiosBlock: 'Не найден блок вашей музыки data-type="music_audios". Удаление не запущено.',
      noTracks: 'Треки не найдены. Откройте раздел музыки и прокрутите список до конца (можно СмартСкроллом).',
      noDuplicates: 'Безопасные дубликаты не найдены.',
      confirm: (count) => `Удалить загруженные треки из вашей музыки? Количество: ${count}.`,
      confirmDuplicates: (count) => `Удалить безопасные дубликаты? Будет удалено: ${count}.`,
      limitPrompt: (count) => `Сколько треков удалить? Доступно: ${count}. Оставьте пустым, чтобы удалить все.`,
      invalidLimit: 'Введите число больше 0.',
      stopRequested: 'vkAudioDeleter: запрошена остановка текущего запуска',
      dataError: (index, total, message) => `vkAudioDeleter: data error ${index}/${total}: ${message}`,
      retry: (attempt, index, total) => `vkAudioDeleter: retry ${attempt}: ${index}/${total}`,
      failed: (index, total) => `vkAudioDeleter: failed ${index}/${total}`
    },
    en: {
      onlyVk: 'This tool works only on VK Music.',
      missingApi: 'VK delete APIs were not found. Open the classic audio list or refresh the page.',
      noMusicAudiosBlock: 'Your music block data-type="music_audios" was not found. Deletion was not started.',
      noTracks: 'No tracks found. Open music and scroll to the end (you can use SmartScroll).',
      noDuplicates: 'No safe duplicates found.',
      confirm: (count) => `Delete the loaded tracks from your music? Count: ${count}.`,
      confirmDuplicates: (count) => `Delete safe duplicates? Tracks to delete: ${count}.`,
      limitPrompt: (count) => `How many tracks should be deleted? Available: ${count}. Leave empty to delete all.`,
      invalidLimit: 'Enter a number greater than 0.',
      stopRequested: 'vkAudioDeleter: stop requested for the current run',
      dataError: (index, total, message) => `vkAudioDeleter: data error ${index}/${total}: ${message}`,
      retry: (attempt, index, total) => `vkAudioDeleter: retry ${attempt}: ${index}/${total}`,
      failed: (index, total) => `vkAudioDeleter: failed ${index}/${total}`
    },
    de: {
      onlyVk: 'Dieses Tool funktioniert nur in VK Musik.',
      missingApi: 'VK-Losch-APIs wurden nicht gefunden. Offne die klassische Audioliste oder lade die Seite neu.',
      noMusicAudiosBlock: 'Der Musikblock data-type="music_audios" wurde nicht gefunden. Loschen wurde nicht gestartet.',
      noTracks: 'Keine Tracks gefunden. Offne Musik und scrolle bis zum Ende (SmartScroll kann helfen).',
      noDuplicates: 'Keine sicheren Duplikate gefunden.',
      confirm: (count) => `Geladene Tracks aus deiner Musik loschen? Anzahl: ${count}.`,
      confirmDuplicates: (count) => `Sichere Duplikate loschen? Zu loschen: ${count}.`,
      limitPrompt: (count) => `Wie viele Tracks sollen geloscht werden? Verfugbar: ${count}. Leer lassen, um alle zu loschen.`,
      invalidLimit: 'Gib eine Zahl grosser als 0 ein.',
      stopRequested: 'vkAudioDeleter: Stopp fur den aktuellen Lauf angefordert',
      dataError: (index, total, message) => `vkAudioDeleter: data error ${index}/${total}: ${message}`,
      retry: (attempt, index, total) => `vkAudioDeleter: retry ${attempt}: ${index}/${total}`,
      failed: (index, total) => `vkAudioDeleter: failed ${index}/${total}`
    }
  };

  const lang = (navigator.language || 'ru').toLowerCase();
  const dict = strings[lang.slice(0, 2)] || strings.ru;
  const t = (key, ...args) => {
    const val = dict[key] || strings.ru[key] || key;
    return typeof val === 'function' ? val(...args) : val;
  };

  const VK_HOST_RE = /(^|\.)vk\.(com|ru)$/i;
  if (!VK_HOST_RE.test(location.host)) {
    alert(t('onlyVk'));
    return;
  }

  if (!window.AudioUtils || !window.ajax || typeof window.ajax.post !== 'function') {
    alert(t('missingApi'));
    return;
  }

  const config = {
    concurrency: 5,
    retry: 2,
    pauseAfterBatch: 300,
    retryDelay: 500
  };

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function report(status, data = {}) {
    const detail = { status, ...data };
    document.documentElement.dataset.vkAudioDeleterProgress = JSON.stringify(detail);
    document.dispatchEvent(new CustomEvent('vk-audio-deleter-progress', { detail }));
  }

  const state = window.__vkAudioDeleter || (window.__vkAudioDeleter = {
    stopRequested: false,
    running: false,
    stop() {
      this.stopRequested = true;
    }
  });

  function getAudioData(audioEl) {
    const audioInfo = window.AudioUtils.getAudioFromEl(audioEl);
    if (!audioInfo) {
      throw new Error('AudioUtils returned empty data');
    }

    const [audioId, ownerId] = audioInfo;
    if (!audioInfo[13]) {
      throw new Error('delete hash not found');
    }

    const [, , , deleteHash] = audioInfo[13].split('/');
    if (!audioId || !ownerId || !deleteHash) {
      throw new Error('incomplete track data');
    }

    return { audioId, ownerId, deleteHash };
  }

  function normalizeText(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function getText(audioEl, selectors) {
    for (const selector of selectors) {
      const el = audioEl.querySelector(selector);
      if (el && el.textContent.trim()) {
        return el.textContent.trim();
      }
    }

    return '';
  }

  function getTrackIdentity(audioEl) {
    let audioInfo = null;
    try {
      audioInfo = window.AudioUtils.getAudioFromEl(audioEl);
    } catch {}

    const title = getText(audioEl, [
      'a[data-testid="audio_row_title"]',
      '._audio_row__title_inner',
      '.audio_row__title_inner'
    ]);

    const duration =
      Number(audioInfo && audioInfo[5]) ||
      Number(audioInfo && audioInfo.duration) ||
      0;

    const key = [
      normalizeText(title),
      String(duration)
    ].join('|');

    if (!title || !duration) {
      return null;
    }

    return { title, duration, key };
  }

  function deleteAudio(audioEl, index, total, attempt = 1) {
    return new Promise(resolve => {
      if (state.stopRequested) {
        resolve(false);
        return;
      }

      let data;
      try {
        data = getAudioData(audioEl);
      } catch (error) {
        resolve(false);
        return;
      }

      window.ajax.post(
        'al_audio.php',
        {
          act: 'delete_audio',
          aid: data.audioId,
          al: 1,
          hash: data.deleteHash,
          oid: data.ownerId
        },
        {
          onDone: () => {
            resolve(true);
          },
          onFail: async () => {
            if (!state.stopRequested && attempt <= config.retry) {
              await sleep(config.retryDelay);
              resolve(await deleteAudio(audioEl, index, total, attempt + 1));
            } else {
              resolve(false);
            }
          }
        }
      );
    });
  }

  function findMusicAudiosBlock() {
    return document.querySelector('[data-type="music_audios"]');
  }

  function collectAudios() {
    const block = findMusicAudiosBlock();
    if (!block) {
      alert(t('noMusicAudiosBlock'));
      return [];
    }

    return Array.from(block.getElementsByClassName('audio_row'));
  }

  function collectDuplicateAudios(audios) {
    const seen = new Set();
    const duplicates = [];

    audios.forEach(audioEl => {
      const identity = getTrackIdentity(audioEl);
      if (!identity) return;

      if (seen.has(identity.key)) {
        duplicates.push(audioEl);
      } else {
        seen.add(identity.key);
      }
    });

    return duplicates;
  }

  function pickDeleteLimit(total) {
    const value = prompt(t('limitPrompt', total), String(total));
    if (value === null) return null;

    const trimmed = value.trim();
    if (!trimmed) return total;

    const limit = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(limit) || limit <= 0) {
      alert(t('invalidLimit'));
      return null;
    }

    return Math.min(limit, total);
  }

  function getRunMode() {
    if (window.__vkAudioDeleterMode) {
      const mode = window.__vkAudioDeleterMode;
      delete window.__vkAudioDeleterMode;
      return mode;
    }

    const script = document.currentScript;
    if (!script) return 'limit';

    return script.dataset.mode || 'limit';
  }

  async function run() {
    const mode = getRunMode();

    if (state.running) {
      state.stop();
      report('stopped', { deleted: 0, failed: 0, total: 0, message: t('stopRequested') });
      return;
    }

    state.stopRequested = false;
    state.running = true;

    const allAudios = collectAudios();
    if (!allAudios.length) {
      alert(t('noTracks'));
      state.running = false;
      return;
    }

    let audios = allAudios;

    if (mode === 'duplicates') {
      audios = collectDuplicateAudios(allAudios);
      if (!audios.length) {
        alert(t('noDuplicates'));
        state.running = false;
        return;
      }

      if (!confirm(t('confirmDuplicates', audios.length))) {
        state.running = false;
        return;
      }
    } else {
      if (!confirm(t('confirm', allAudios.length))) {
        state.running = false;
        return;
      }

      const limit = pickDeleteLimit(allAudios.length);
      if (!limit) {
        state.running = false;
        return;
      }

      audios = allAudios.slice(0, limit);
    }
    report('starting', { deleted: 0, failed: 0, total: audios.length });

    let deleted = 0;
    let failed = 0;

    for (let i = 0; i < audios.length && !state.stopRequested; i += config.concurrency) {
      const batch = audios.slice(i, i + config.concurrency);
      const results = await Promise.all(
        batch.map((audioEl, batchIndex) => deleteAudio(audioEl, i + batchIndex, audios.length))
      );

      deleted += results.filter(Boolean).length;
      failed += results.filter(result => !result).length;
      report('progress', { deleted, failed, total: audios.length });

      if (!state.stopRequested) {
        await sleep(config.pauseAfterBatch);
      }
    }

    report(state.stopRequested ? 'stopped' : 'completed', { deleted, failed, total: audios.length });

    state.running = false;
    state.stopRequested = false;
  }

  run().catch(error => {
    state.running = false;
    state.stopRequested = false;
    report('error', { message: error && error.message ? error.message : undefined });
    console.error('vkAudioDeleter:', error);
  });
})();
