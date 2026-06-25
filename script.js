const giftCards = document.querySelectorAll(".gift-card");
const choicePanel = document.querySelector("#choice-panel");
const choiceTitle = document.querySelector("#choice-title");
const choiceText = document.querySelector("#choice-text");
const choiceList = document.querySelector("#choice-list");
const sendButton = document.querySelector("#send-button");
const pointsLeft = document.querySelector("#points-left");
const pointsHint = document.querySelector("#points-hint");
const selectedGiftsField = document.querySelector("#selected-gifts");
const pointsUsedField = document.querySelector("#points-used");
const pointsLeftField = document.querySelector("#points-left-field");
const submitForm = document.querySelector("#submit-form");

const storageKey = "birthday-gift-choice";
const maxPoints = 3;

let selectedGifts = [];

function renderSelection() {
  const totalSpent = selectedGifts.reduce((sum, gift) => sum + gift.cost, 0);
  const left = maxPoints - totalSpent;

  giftCards.forEach((card) => {
    const name = card.dataset.giftName;
    const cost = Number(card.dataset.giftCost);
    const button = card.querySelector(".gift-button");
    const isSelected = selectedGifts.some((gift) => gift.name === name);
    const canSelect = totalSpent + cost <= maxPoints;

    card.classList.toggle("selected", isSelected);
    button.textContent = isSelected ? "Убрать из выбора" : "Выбрать подарок";
    button.disabled = !isSelected && !canSelect;
  });

  pointsLeft.textContent = String(left);
  pointsHint.textContent =
    left === 0
      ? "Все очки потрачены. Лимит исчерпан, как и твоя скромность в этот день."
      : `Можно выбрать еще на ${left} ${left === 1 ? "очко" : left < 5 ? "очка" : "очков"}.`;

  choiceList.innerHTML = "";

  if (selectedGifts.length === 0) {
    choicePanel.classList.remove("active");
    choiceTitle.textContent = "Пока ничего не выбрано";
    choiceText.textContent =
      "Выбирай один подарок или несколько маленьких, пока хватает очков.";
    sendButton.disabled = true;
    selectedGiftsField.value = "";
    pointsUsedField.value = "";
    pointsLeftField.value = "";
    localStorage.removeItem(storageKey);
    return;
  }

  choicePanel.classList.add("active");
  choiceTitle.textContent = `Выбрано подарков: ${selectedGifts.length}`;
  choiceText.textContent =
    "Выбор сохранен. Можно собрать набор мечты в рамках бюджета, что подозрительно напоминает взрослую жизнь, только здесь приятно.";

  selectedGifts.forEach((gift) => {
    const pill = document.createElement("div");
    pill.className = "choice-pill";
    pill.textContent = `${gift.name} • ${gift.cost}`;
    choiceList.append(pill);
  });

  sendButton.disabled = false;
  selectedGiftsField.value = selectedGifts
    .map((gift) => `${gift.name} (${gift.cost} очк.)`)
    .join(", ");
  pointsUsedField.value = String(totalSpent);
  pointsLeftField.value = String(left);

  localStorage.setItem(storageKey, JSON.stringify(selectedGifts));
}

function toggleSelection(card) {
  const name = card.dataset.giftName;
  const cost = Number(card.dataset.giftCost);
  const existingIndex = selectedGifts.findIndex((gift) => gift.name === name);

  if (existingIndex >= 0) {
    selectedGifts.splice(existingIndex, 1);
    renderSelection();
    return;
  }

  const totalSpent = selectedGifts.reduce((sum, gift) => sum + gift.cost, 0);

  if (totalSpent + cost > maxPoints) {
    return;
  }

  selectedGifts.push({ name, cost });
  renderSelection();
}

giftCards.forEach((card) => {
  const button = card.querySelector(".gift-button");

  button.addEventListener("click", () => {
    toggleSelection(card);
  });
});

const savedChoice = localStorage.getItem(storageKey);

if (savedChoice) {
  try {
    selectedGifts = JSON.parse(savedChoice);
  } catch (error) {
    selectedGifts = [];
  }
}

renderSelection();

submitForm.addEventListener("submit", () => {
  sendButton.textContent = "Отправляется...";
});
