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

document.querySelectorAll(".case, .showreel-link").forEach(card => {
  card.addEventListener("click", event => {
    event.preventDefault();
    if (card.classList.contains("showreel-link") && event.detail > 0
      && window.matchMedia("(hover: none)").matches && !card.classList.contains("open")) {
      card.classList.add("open");
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
