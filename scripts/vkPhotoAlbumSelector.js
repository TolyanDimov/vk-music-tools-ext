(() => {
  const VK_HOST_RE = /(^|\.)vk\.(com|ru)$/i;
  if (!VK_HOST_RE.test(location.host)) {
    console.warn('vkPhotoAlbumSelector: VK is not open');
    return;
  }

  const normalize = value => (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  const selectAllLabels = new Set(['выбрать все', 'select all', 'alle auswählen']);
  const selectAll = Array.from(document.querySelectorAll('button')).find(button =>
    selectAllLabels.has(normalize(button.textContent)) && !button.disabled
  );

  if (!selectAll) {
    console.warn('vkPhotoAlbumSelector: album multi-select mode is not available');
    return;
  }

  // Delegate to VK's own handler so virtualized photo grids and transfer
  // permissions remain managed by the site.
  selectAll.click();
})();
