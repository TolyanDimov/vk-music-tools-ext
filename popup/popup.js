const messageEl = document.getElementById('message');
const vkButtons = Array.from(document.querySelectorAll('.btn.vk'));

function setMessage(text) {
  messageEl.textContent = text;
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function runFile(filePath) {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    setMessage('Не удалось найти активную вкладку.');
    return;
  }
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: [filePath]
  });
}

async function callVkOps(action) {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    setMessage('Не удалось найти активную вкладку.');
    return;
  }

  const [probe] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (act) => {
      if (!window.__smartScrollerApi || typeof window.__smartScrollerApi[act] !== 'function') {
        return { ok: false };
      }
      window.__smartScrollerApi[act]();
      return { ok: true };
    },
    args: [action]
  });

  if (probe && probe.result && probe.result.ok) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/smartScroller.js']
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (act) => {
      if (window.__smartScrollerApi && typeof window.__smartScrollerApi[act] === 'function') {
        window.__smartScrollerApi[act]();
      }
    },
    args: [action]
  });
}

async function callSmartScroller(action) {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    setMessage('Не удалось найти активную вкладку.');
    return;
  }

  const [probe] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (act) => {
      if (!window.__smartScrollerApi || typeof window.__smartScrollerApi[act] !== 'function') {
        return { ok: false };
      }
      window.__smartScrollerApi[act]();
      return { ok: true };
    },
    args: [action]
  });

  if (probe && probe.result && probe.result.ok) {
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['scripts/smartScroller.js']
  });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (act) => {
      if (window.__smartScrollerApi && typeof window.__smartScrollerApi[act] === 'function') {
        window.__smartScrollerApi[act]();
      }
    },
    args: [action]
  });
}

async function stopAll() {
  const tab = await getActiveTab();
  if (!tab || !tab.id) {
    setMessage('Не удалось найти активную вкладку.');
    return;
  }

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      if (window.__smartScrollerApi && typeof window.__smartScrollerApi.stop === 'function') {
        window.__smartScrollerApi.stop();
      }
    }
  });
}

async function init() {
  const tab = await getActiveTab();
  const url = tab && tab.url ? tab.url : '';
  const isVk = /^https?:\/\/(.+\.)?vk\.com\//i.test(url);

  vkButtons.forEach(btn => {
    btn.disabled = !isVk;
    btn.title = isVk ? '' : 'Откройте VK Музыку, чтобы использовать эту функцию';
  });

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const action = btn.getAttribute('data-action');
      try {
        if (action === 'smart-open') {
          await callSmartScroller('open');
          setMessage('СмартСкролл открыт.');
        } else if (action === 'smart-down') {
          await callSmartScroller('startDown');
          setMessage('СмартСкролл: вниз.');
        } else if (action === 'smart-up') {
          await callSmartScroller('startUp');
          setMessage('СмартСкролл: вверх.');
        } else if (action === 'smart-pick') {
          await callSmartScroller('pick');
          setMessage('СмартСкролл: выберите контейнер.');
        } else if (action === 'smart-close') {
          await callSmartScroller('close');
          setMessage('Панель СмартСкролла закрыта.');
        } else if (action === 'vk-export') {
          await runFile('scripts/vkPlaylistExporter.js');
          setMessage('Экспорт запущен.');
        } else if (action === 'vk-add') {
          await callVkOps('vkAdd');
          setMessage('Массовое добавление запущено.');
        } else if (action === 'vk-remove') {
          await callVkOps('vkRemove');
          setMessage('Массовое снятие запущено.');
        } else if (action === 'stop-all') {
          await stopAll();
          setMessage('Остановка запрошена.');
        }
      } catch (err) {
        console.error(err);
        setMessage('Ошибка запуска. Подробности в консоли.');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  init().catch(err => {
    console.error(err);
    setMessage('Не удалось инициализировать панель.');
  });
});
