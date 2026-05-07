(() => {
  const strings = {
    ru: {
      onlyVk: 'Этот инструмент работает только на VK Музыке.',
      missingApi: 'Не найдены API VK для удаления. Откройте старый интерфейс списка аудио или обновите страницу.',
      noMusicAudiosBlock: 'Не найден блок вашей музыки data-type="music_audios". Удаление не запущено.',
      noTracks: 'Треки не найдены. Откройте раздел музыки и прокрутите список до конца (можно СмартСкроллом).',
      confirm: (count) => `Удалить загруженные треки из вашей музыки? Количество: ${count}.`,
      started: (count) => `vkAudioDeleter: tracks found = ${count}`,
      completed: (deleted, failed, total) => `vkAudioDeleter: completed. deleted=${deleted}, failed=${failed}, total=${total}`,
      stopped: (deleted, failed, total) => `vkAudioDeleter: stopped. deleted=${deleted}, failed=${failed}, total=${total}`,
      stopRequested: 'vkAudioDeleter: запрошена остановка текущего запуска',
      dataError: (index, total, message) => `vkAudioDeleter: data error ${index}/${total}: ${message}`,
      retry: (attempt, index, total) => `vkAudioDeleter: retry ${attempt}: ${index}/${total}`,
      deleted: (index, total) => `vkAudioDeleter: deleted ${index}/${total}`,
      failed: (index, total) => `vkAudioDeleter: failed ${index}/${total}`
    },
    en: {
      onlyVk: 'This tool works only on VK Music.',
      missingApi: 'VK delete APIs were not found. Open the classic audio list or refresh the page.',
      noMusicAudiosBlock: 'Your music block data-type="music_audios" was not found. Deletion was not started.',
      noTracks: 'No tracks found. Open music and scroll to the end (you can use SmartScroll).',
      confirm: (count) => `Delete the loaded tracks from your music? Count: ${count}.`,
      started: (count) => `vkAudioDeleter: tracks found = ${count}`,
      completed: (deleted, failed, total) => `vkAudioDeleter: completed. deleted=${deleted}, failed=${failed}, total=${total}`,
      stopped: (deleted, failed, total) => `vkAudioDeleter: stopped. deleted=${deleted}, failed=${failed}, total=${total}`,
      stopRequested: 'vkAudioDeleter: stop requested for the current run',
      dataError: (index, total, message) => `vkAudioDeleter: data error ${index}/${total}: ${message}`,
      retry: (attempt, index, total) => `vkAudioDeleter: retry ${attempt}: ${index}/${total}`,
      deleted: (index, total) => `vkAudioDeleter: deleted ${index}/${total}`,
      failed: (index, total) => `vkAudioDeleter: failed ${index}/${total}`
    },
    de: {
      onlyVk: 'Dieses Tool funktioniert nur in VK Musik.',
      missingApi: 'VK-Losch-APIs wurden nicht gefunden. Offne die klassische Audioliste oder lade die Seite neu.',
      noMusicAudiosBlock: 'Der Musikblock data-type="music_audios" wurde nicht gefunden. Loschen wurde nicht gestartet.',
      noTracks: 'Keine Tracks gefunden. Offne Musik und scrolle bis zum Ende (SmartScroll kann helfen).',
      confirm: (count) => `Geladene Tracks aus deiner Musik loschen? Anzahl: ${count}.`,
      started: (count) => `vkAudioDeleter: tracks found = ${count}`,
      completed: (deleted, failed, total) => `vkAudioDeleter: completed. deleted=${deleted}, failed=${failed}, total=${total}`,
      stopped: (deleted, failed, total) => `vkAudioDeleter: stopped. deleted=${deleted}, failed=${failed}, total=${total}`,
      stopRequested: 'vkAudioDeleter: Stopp fur den aktuellen Lauf angefordert',
      dataError: (index, total, message) => `vkAudioDeleter: data error ${index}/${total}: ${message}`,
      retry: (attempt, index, total) => `vkAudioDeleter: retry ${attempt}: ${index}/${total}`,
      deleted: (index, total) => `vkAudioDeleter: deleted ${index}/${total}`,
      failed: (index, total) => `vkAudioDeleter: failed ${index}/${total}`
    }
  };

  const lang = (navigator.language || 'ru').toLowerCase();
  const dict = strings[lang.slice(0, 2)] || strings.ru;
  const t = (key, ...args) => {
    const val = dict[key] || strings.ru[key] || key;
    return typeof val === 'function' ? val(...args) : val;
  };

  const VK_HOST_RE = /(^|\.)vk\.com$/i;
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
        console.warn(t('dataError', index + 1, total, error.message));
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
            console.log(t('deleted', index + 1, total));
            resolve(true);
          },
          onFail: async () => {
            if (!state.stopRequested && attempt <= config.retry) {
              console.warn(t('retry', attempt, index + 1, total));
              await sleep(config.retryDelay);
              resolve(await deleteAudio(audioEl, index, total, attempt + 1));
            } else {
              console.warn(t('failed', index + 1, total));
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
      console.warn('vkAudioDeleter: [data-type="music_audios"] block not found');
      return [];
    }

    return Array.from(block.getElementsByClassName('audio_row'));
  }

  async function run() {
    if (state.running) {
      state.stop();
      console.warn(t('stopRequested'));
      return;
    }

    state.stopRequested = false;
    state.running = true;

    const audios = collectAudios();
    if (!audios.length) {
      alert(t('noTracks'));
      state.running = false;
      return;
    }

    if (!confirm(t('confirm', audios.length))) {
      state.running = false;
      return;
    }

    console.log(t('started', audios.length));

    let deleted = 0;
    let failed = 0;

    for (let i = 0; i < audios.length && !state.stopRequested; i += config.concurrency) {
      const batch = audios.slice(i, i + config.concurrency);
      const results = await Promise.all(
        batch.map((audioEl, batchIndex) => deleteAudio(audioEl, i + batchIndex, audios.length))
      );

      deleted += results.filter(Boolean).length;
      failed += results.filter(result => !result).length;

      if (!state.stopRequested) {
        await sleep(config.pauseAfterBatch);
      }
    }

    const logKey = state.stopRequested ? 'stopped' : 'completed';
    console.log(t(logKey, deleted, failed, audios.length));

    state.running = false;
    state.stopRequested = false;
  }

  run().catch(error => {
    state.running = false;
    state.stopRequested = false;
    console.error('vkAudioDeleter:', error);
  });
})();
