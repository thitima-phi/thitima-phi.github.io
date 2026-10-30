const collections = driveCollections;
const grid = document.querySelector('#project-grid');
const count = document.querySelector('#result-count');
const inlineVideos = Array.from(grid.querySelectorAll('video'));
count.textContent = `${grid.querySelectorAll('.project').length} projects`;
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    grid.querySelectorAll('.company-group').forEach(group => {
      group.hidden = button.dataset.filter !== 'all' && group.dataset.company !== button.dataset.filter;
    });
    let visible = 0;
    grid.querySelectorAll('.project').forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.company !== button.dataset.filter;
      if (project.hidden) project.querySelectorAll('video').forEach(clip => clip.pause());
      else visible++;
    });
    count.textContent = `${visible} projects`;
  });
});
const dialog = document.querySelector('#gallery');
const image = document.querySelector('#gallery-image');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
let activeCollection;
let activeIndex = 0;
function renderGallery() {
  const [src, caption] = activeCollection.items[activeIndex];
  image.src = src;
  image.alt = caption;
  document.querySelector('#gallery-title').textContent = activeCollection.title;
  document.querySelector('#gallery-caption').textContent = caption;
  document.querySelector('#gallery-count').textContent = `ARTWORK ${activeIndex + 1} OF ${activeCollection.items.length}`;
  previous.disabled = activeIndex === 0;
  next.disabled = activeIndex === activeCollection.items.length - 1;
}
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-gallery]');
  if (!trigger) return;
  inlineVideos.forEach(clip => clip.pause());
  activeCollection = collections[trigger.dataset.gallery];
  activeIndex = 0;
  renderGallery();
  dialog.showModal();
});
previous.addEventListener('click', () => { if (activeIndex > 0) { activeIndex--; renderGallery(); } });
next.addEventListener('click', () => { if (activeIndex < activeCollection.items.length - 1) { activeIndex++; renderGallery(); } });
document.querySelector('#gallery-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') previous.click();
  if (event.key === 'ArrowRight') next.click();
});
inlineVideos.forEach(clip => {
  clip.addEventListener('play', () => {
    inlineVideos.forEach(other => { if (other !== clip) other.pause(); });
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.querySelector('#motion-toggle');
function syncMotionPreference() {
  document.body.classList.toggle('motion-enabled', !reducedMotion.matches);
  motionToggle.hidden = reducedMotion.matches;
}
syncMotionPreference();
reducedMotion.addEventListener('change', syncMotionPreference);
motionToggle.addEventListener('click', () => {
  const paused = document.body.classList.toggle('motion-paused');
  motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.hero-top, .hero h1, .desk, .hero-bottom, .company-heading, .project, .about-title, .about-copy, .experience-list article, .contact-section .shell').forEach(element => {
    element.classList.add('reveal-target');
    observer.observe(element);
  });
  const deskObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('is-in-view', entry.isIntersecting));
  });
  deskObserver.observe(document.querySelector('.desk'));
}
