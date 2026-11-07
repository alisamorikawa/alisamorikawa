// Each cover remains a direct image link when the dialog is unavailable.
const viewer = document.querySelector('.viewer');
if (viewer && typeof viewer.showModal === 'function') {
  const enlarged = viewer.querySelector('.enlarged');
  const title = viewer.querySelector('h2');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let source;
  let closing = false;

  function zoom(reverse = false) {
    if (reduced.matches || !enlarged.animate) return;
    const thumbnail = source.querySelector('img').getBoundingClientRect();
    const target = enlarged.getBoundingClientRect();
    if (!target.width || !target.height) return;
    // Match the painted cover inside the thumbnail's object-fit box.
    const scale = Math.min(thumbnail.width / target.width, thumbnail.height / target.height);
    const dx = thumbnail.left + thumbnail.width / 2 - target.left - target.width / 2;
    const dy = thumbnail.top + thumbnail.height / 2 - target.top - target.height / 2;
    return enlarged.animate([
      { transform: `translate(${dx}px,${dy}px) scale(${scale})` },
      { transform: 'none' }
    ], { duration: reverse ? 300 : 530, direction: reverse ? 'reverse' : 'normal',
      easing: 'cubic-bezier(.22,.76,.24,1)' });
  }

  for (const link of document.querySelectorAll('a.bookmat:not(.story-card)')) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      source = link;
      const image = link.querySelector('img');
      enlarged.width = image.naturalWidth || 320;
      enlarged.height = image.naturalHeight || 480;
      enlarged.src = link.href;
      title.textContent = link.closest('figure').querySelector('h3').textContent;
      viewer.showModal();
      zoom();
    });
  }

  async function dismiss() {
    if (!viewer.open || closing) return;
    closing = true;
    for (const animation of enlarged.getAnimations()) animation.cancel();
    await zoom(true)?.finished.catch(() => {});
    viewer.close();
    closing = false;
    source.focus({ preventScroll: true });
  }
  viewer.querySelector('button').addEventListener('click', dismiss);
  viewer.addEventListener('cancel', event => { event.preventDefault(); dismiss(); });
  viewer.addEventListener('click', event => { if (event.target === viewer) dismiss(); });
}
