// Login and Logout
const nav = document.getElementById("navbar");
const banner = document.getElementById("banner");
const main = document.getElementById("main");

// Login 
function login(e) {
  e.preventDefault();
  const name = document.getElementById("user-name").value;
  const password = document.getElementById("password").value;
  if (name && password == "123456") {
    alert("Successfully Logged In");
    nav.classList.remove("hidden");
    banner.classList.add("hidden");
    main.classList.remove("hidden");
  } else if (!name) {
    alert("Please provide your name!");
  } else if (password != "123456") {
    alert("Please provide your correct password!!");
  }
}

// Logout
function logout() {
  nav.classList.add("hidden");
  banner.classList.remove("hidden");
  main.classList.add('hidden');
}

//  Remove Active color
function removeActiveColor() {
  const removeColor = document.getElementsByClassName("active");
  for (let color of removeColor) {
    color.classList.remove("active");
  }
}

// Load Category Buttons
function loadCategory() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayCategory(data.data));
}

loadCategory();

// Show Category Buttons
const displayCategory = (categories) => {
  const categoryContainer = document.getElementById("category-container");

  categories.forEach((category) => {
    const lessionDiv = document.createElement("div");
    lessionDiv.innerHTML = `
        <button id="btn-${category.level_no}" onclick="loadVocabulary(${category.level_no})" class="border border-blue-800 btn hover:bg-blue-800 hover:text-white">
          <i class="fa-solid fa-book-open"></i>
          <span>Lesson-${category.level_no}</span>
        </button>
    `;
    categoryContainer.appendChild(lessionDiv);
  });
};

// Load Level Wise Vocabulary
function loadVocabulary(id) {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("not-find-vocabulary").classList.add("hidden");
      // Remove and show active color
      removeActiveColor();
      document.getElementById(`btn-${id}`).classList.add("active");
      displayVocabulary(data.data);
    });
}

// Display Vocabulary
const displayVocabulary = (vocabularies) => {
  const vocabularyContainer = document.getElementById("find-vocabulary");
  vocabularyContainer.innerHTML = "";

  if (vocabularies.length == 0) {
    const div = document.createElement("div");
    div.classList.add("col-span-full");
    div.innerHTML = `
      <div class="text-center py-20 bg-slate-100 my-10 rounded ">
        <img class="mx-auto mb-3" src="./assets/alert-error.png" alt="Alert" />
        <p class="text-slate-600 mb-4">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
        <h1 class="text-3xl font-medium">নেক্সট Lesson এ যান</h1>
      </div>
    `;
    vocabularyContainer.appendChild(div);
  }

  vocabularies.forEach((vocabulary) => {
    const vocabDiv = document.createElement("div");
    vocabDiv.classList.add(
      "bg-white",
      "text-center",
      "p-10",
      "rounded-lg",
      "shadow-lg"
    );
    vocabDiv.innerHTML = `
      <h1 class="text-xl font-medium">${vocabulary.word}</h1>
      <p class="py-3">Meaning / Pronounciation</p>
      <p class="text-lg font-bold text-slate-700">"${
        vocabulary.meaning ? vocabulary.meaning : "অর্থ নেই"
      } / ${vocabulary.pronunciation}"</p>
      <div class="flex justify-between item-center mt-5 text-slate-500">
        <button onclick="loadVocabularyDetails(${
          vocabulary.id
        })" class="cursor-pointer p-1 w-8 h-8 border border-slate-500 rounded-full"><i class="fa-solid fa-circle-info"></i></button>
        <span class="cursor-pointer p-1 w-8 h-8 border border-slate-500 rounded-full"><i class="fa-solid fa-volume-high"></i></span>
      </div>
    `;
    vocabularyContainer.appendChild(vocabDiv);
  });
};

// Load Vocabulary Details
function loadVocabularyDetails(id) {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayVocabularyDetails(data.data));
}

// Display vocabulary Details
const displayVocabularyDetails = (details) => {
  const {
    word = "",
    meaning = "",
    pronunciation = "",
    sentence = "",
    synonyms = [],
  } = details || {};

  // console.log(details);
  document.getElementById("vocabulary_details").showModal();
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = "";
  const detailsDiv = document.createElement("div");
  detailsDiv.innerHTML = `
    <h1 class="text-2xl font-extrabold">${word} ( ${pronunciation} )</h1>
    <div class="my-4 space-y-2">
      <h3 class="font-semibold">Meaning</h3>
      <h3 class="bangla">${meaning ? meaning : "অর্থ নেই"}</h3>
    </div>
    <div class="space-y-2">
      <h3 class="font-semibold">Example</h3>
      <h3>${sentence}</h3>
    </div>
    ${
      synonyms.length != 0
        ? `<div class="my-4">
      <h3 class="font-semibold">সমার্থক শব্দ গুলো</h3>
      <div class="mt-2 flex item-center gap-2">
        ${synonyms.map(
          (item) =>
            `<div class="bg-slate-200 text-black px-3 py-2 rounded text-sm">${item}</div>`
        )}
      </div>
    </div>`
        : "<h1>&nbsp;</h1>"
    }
`;
  detailsContainer.appendChild(detailsDiv);
};
