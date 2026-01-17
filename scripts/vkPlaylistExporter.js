(() => {
  const VK_HOST_RE = /(^|\.)vk\.com$/i;
  if (!VK_HOST_RE.test(location.host)) {
    alert('Этот инструмент работает только на VK Музыке.');
    return;
  }

  function collectTracks() {
    const result = [];

    let rows = document.querySelectorAll(
      '[data-testid="MusicPlaylistTracks_MusicTrackRow"],' +
      ' [data-testid="MusicPage_MusicTrackRow"]'
    );

    if (rows.length) {
      rows.forEach(row => {
        const titleEl = row.querySelector('[data-testid="MusicTrackRow_Title"]');
        if (!titleEl) return;

        const authorsAnchor = row.querySelector('[data-testid="MusicTrackRow_Authors"]');
        if (!authorsAnchor) return;

        const artistContainer =
          authorsAnchor.closest('.vkitAudioRowInfo__text--Rrhr2') || authorsAnchor;

        const title = titleEl.textContent.trim().replace(/\s+/g, ' ');
        const artist = artistContainer.textContent.trim().replace(/\s+/g, ' ');

        if (!artist || !title) return;

        result.push(`${artist} - ${title}`);
      });

      return result;
    }

    rows = document.querySelectorAll('.audio_row');

    rows.forEach(row => {
      const artistEl = row.querySelector('.audio_row__performers');
      if (!artistEl) return;

      const titleEl =
        row.querySelector('a[data-testid="audio_row_title"]') ||
        row.querySelector('._audio_row__title_inner') ||
        row.querySelector('.audio_row__title_inner');

      if (!titleEl) return;

      const artist = artistEl.textContent.trim().replace(/\s+/g, ' ');
      const title = titleEl.textContent.trim().replace(/\s+/g, ' ');
      if (!artist || !title) return;

      result.push(`${artist} - ${title}`);
    });

    return result;
  }

  function getPlaylistTitle() {
    const playlistTitleEl = document.querySelector('.AudioPlaylistSnippet__title--main');
    if (playlistTitleEl && playlistTitleEl.textContent.trim()) {
      return playlistTitleEl.textContent.trim();
    }

    const headerTitle =
      document.querySelector('[data-testid="MusicPlaylist_Header_Title"]') ||
      document.querySelector('[data-testid="MusicPage_Header_Title"]');

    if (headerTitle && headerTitle.textContent.trim()) {
      return headerTitle.textContent.trim();
    }

    const tabTitleEl = document.querySelector('.ui_tab.ui_tab_sel');
    if (tabTitleEl && tabTitleEl.textContent.trim()) {
      return tabTitleEl.textContent.trim();
    }

    return 'vk_playlist';
  }

  function saveToTxtFile(filename, lines) {
    const content = lines.join('\r\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  (async () => {
    const tracks = collectTracks();
    if (!tracks.length) {
      alert('Треки не найдены. Откройте плейлист и прокрутите список до конца (можно СмартСкроллом).');
      return;
    }

    const title = getPlaylistTitle();
    const filename = `${title} (SmartScroll VK Tools).txt`;

    saveToTxtFile(filename, tracks);

    console.log(`vkPlaylistExporter: exported tracks: ${tracks.length}`);
    console.log(`vkPlaylistExporter: saved as: ${filename}`);
  })();
})();
