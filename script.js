const quotes = [
  "Every wall is a canvas waiting for a story.",
  "Small steps paint big pictures.",
  "Color is a power which directly influences the soul.",
  "Mistakes are just happy accidents.",
  "Today is a good day to try something new.",
  "Simplicity is the ultimate sophistication."
];

const palette = ["#ef8354", "#4f5d75", "#2b9348", "#f4d35e", "#ee6c4d", "#3d5a80", "#98c1d9", "#9b5de5"];

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Random quote
const quoteEl = document.getElementById("quote");
document.getElementById("quote-btn").addEventListener("click", () => {
  quoteEl.textContent = randomItem(quotes);
});

// Tile wall
const wall = document.getElementById("wall");
for (let i = 0; i < 24; i++) {
  const tile = document.createElement("div");
  tile.className = "tile";
  tile.style.backgroundColor = randomItem(palette);
  tile.addEventListener("click", () => {
    tile.style.backgroundColor = randomItem(palette);
  });
  wall.appendChild(tile);
}
