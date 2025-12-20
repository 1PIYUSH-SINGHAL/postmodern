const track = document.querySelector(".team-track");
const cards = document.querySelectorAll(".team-card");
let index = 0;

function update() {
  track.style.transform = `translateX(${-index * (cards[0].offsetWidth + 32)}px)`;
}

document.querySelector(".team-next").onclick = () => {
  index = Math.min(index + 1, cards.length - 1);
  update();
};

document.querySelector(".team-prev").onclick = () => {
  index = Math.max(index - 1, 0);
  update();
};
