let colorBox = document.querySelector(".color-box");
let selectedColor;
let outlineCheck = function () {
  let allColorBox = document.querySelectorAll(".color");
  for (let i of allColorBox) {
    if (i.classList.contains("outline")) {
      i.classList.remove("outline");
    }
  }
  selectedColor = "var(--color-bg)";
};

let noteIdHandler = undefined;

let outlineToggle = function () {
  outlineCheck();
  this.classList.add("outline");
  selectedColor = this.style.backgroundColor;
  console.log(this.style.backgroundColor);
};

for (let i = 1; i < 11; i++) {
  let newDiv = document.createElement("div");
  newDiv.classList.add("color");
  newDiv.style.backgroundColor = `var(--color-note-${i})`;
  newDiv.addEventListener("click", outlineToggle);
  colorBox.appendChild(newDiv);
}

let mainContent = document.querySelector(".content");
let btnSave = document.querySelector(".btn-save");
btnSave.addEventListener("click", function () {
  let title = document.querySelector(".title-name").value;
  let content = document.querySelector(".note").value;
  localStorage.setItem(
    noteIdHandler ?? Date.now(),
    JSON.stringify({
      title: title,
      content: content,
      color: selectedColor,
    })
  );
  mainContent.innerHTML = "";
  showNHideModal();
  renderNote();
  noteIdHandler = undefined;
});

let crossBtn = `<svg class="delete" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;
let pencilIcon = `<svg class="edit" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>`;
function renderNote() {
  let Notekey = Object.keys(localStorage);
  Notekey.sort((a, b) => b - a);
  mainContent.innerHTML = "";
  for (let i = 0; i < Notekey.length; i++) {
    let note = JSON.parse(localStorage.getItem(Notekey[i]));
    let noteContainer = document.createElement("div");
    noteContainer.classList.add("note-container");
    let noteHeader = document.createElement("div");
    noteHeader.classList.add("note-header");
    let noteTitle = document.createElement("h3");
    noteTitle.classList.add("note-title");
    noteTitle.innerText = note.title;
    let tool = document.createElement("div");
    tool.classList.add("tool");

    let toolEdit = document.createElement("div");
    toolEdit.setAttribute("noteId", Notekey[i]);
    toolEdit.classList.add("tool-edit");
    toolEdit.setAttribute("onclick", `editNote(${Notekey[i]})`);
    toolEdit.innerHTML = pencilIcon;
    tool.appendChild(toolEdit);

    let toolDelete = document.createElement("div");
    toolDelete.setAttribute("noteId", Notekey[i]);
    toolDelete.classList.add("tool-delete");
    toolDelete.setAttribute("onclick", `deleteFunc(${Notekey[i]})`);
    toolDelete.innerHTML = crossBtn;
    tool.appendChild(toolDelete);

    noteHeader.appendChild(noteTitle);
    noteHeader.appendChild(tool);
    let noteContent = document.createElement("span");
    noteContent.classList.add("note-content");
    noteContent.innerText = note.content;
    noteHeader.style.backgroundColor = note.color;
    noteContainer.appendChild(noteHeader);
    noteContainer.appendChild(noteContent);
    noteContainer.style.backgroundColor = note.color;
    mainContent.appendChild(noteContainer);
  }
}
function deleteFunc(k) {
  localStorage.removeItem(k);
  renderNote();
}
renderNote();

document.querySelector(".add-btn").addEventListener("click", showNHideModal);

function showNHideModal() {
  document.querySelector(".title-name").value = "";
  document.querySelector(".note").value = "";
  let modalBg = document.querySelector(".note-dialog-bg");
  let modal = document.querySelector(".note-editor");
  modal.classList.toggle("scale");
  modalBg.classList.toggle("hidden");
  outlineCheck();
}

function editNote(noteId) {
  showNHideModal();
  let note = JSON.parse(localStorage.getItem(noteId));
  document.querySelector(".title-name").value = note.title;
  document.querySelector(".note").value = note.content;
  noteIdHandler = noteId;
}
