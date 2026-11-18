const player = document.getElementById("player");
const frame = player.querySelector(".player-frame");

function openPlayer(id) {
  frame.innerHTML = `<iframe src="https://kinescope.io/embed/${id}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen></iframe>`;
  player.hidden = false;
  document.body.style.overflow = "hidden";
}

function closePlayer() {
  player.hidden = true;
  frame.innerHTML = "";
  document.body.style.overflow = "";
}

const touchPreview = window.matchMedia("(hover: none)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function playPreview(video) {
  video.muted = true;
  video.play().then(() => {
    video.classList.add("preview-playing");
  }).catch(() => {
    const image = video.nextElementSibling;
    if (touchPreview.matches && !reduceMotion.matches && !video.classList.contains("preview-playing")) {
      image.src = image.dataset.fallback;
    }
  });
}

const previewObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    previewObserver.unobserve(entry.target);
    if (!touchPreview.matches || !reduceMotion.matches) playPreview(entry.target);
  }
});

document.querySelectorAll(".reel video, video.case-preview").forEach(video => {
  previewObserver.observe(video);
});

document.querySelectorAll(".case, .showreel-link").forEach(card => {
  card.addEventListener("click", event => {
    event.preventDefault();
    if (card.classList.contains("showreel-link") && event.detail > 0
      && touchPreview.matches && !card.classList.contains("open")) {
      card.classList.add("open");
      if (!reduceMotion.matches) playPreview(card.querySelector("video"));
      return;
    }
    if (card.dataset.kinescope) openPlayer(card.dataset.kinescope);
  });
});

player.addEventListener("click", event => {
  if (event.target === player || event.target.closest(".player-close")) closePlayer();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !player.hidden) closePlayer();
});
