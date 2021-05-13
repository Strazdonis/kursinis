import { postData } from "./utils.js";
const container = document.getElementById("note-container");

const createNoteElement = (title, text, date, id) => {
    const NoteHtml = `<div class="card-body">
    <h5 class="card-title" id="note-title" contenteditable="true">${title}</h5>
    <p class="card-text" id="note-text" contenteditable="true">${text}</p>
    </div>
    <div class="card-footer text-muted">
    <div class="d-inline-block">
        ${ago((new Date(date)).getTime())} ago
    </div>
    <div style="float:right; margin-top: -5px">
        <button class="btn" id="btn-save"><i class="fa fa-check text-muted"></i></button>
        <button class="btn" id="btn-delete"><i class="fa fa-trash text-muted"></i></button>
    </div>
    </div>`;
    const el = document.createElement('div');
    el.id = id;
    el.classList.add('d-inline-block', 'card', 'mb-3');
    el.style.width = '18rem';
    el.style['margin-right'] = '2rem';
    el.innerHTML = NoteHtml.trim();
    return el;

}
document.getElementById("create-note").addEventListener("click", createEvent => {
    const el = createNoteElement("Title", "Note text", "Just now", "note-example");
    container.prepend(el);
    const saveBtn = el.querySelector("#btn-save");
    const delBtn = el.querySelector("#btn-delete");
    el.addEventListener('input', inputEvent => {

    });
    saveBtn.addEventListener('click', async saveEvent => {
        const parent = saveEvent.target.offsetParent;
        const title = parent.querySelector("#note-title").innerText;
        const text = parent.querySelector("#note-text").innerText;
        const data = await postData("/api/notes", {title, text});
        console.log(data);
    });
    delBtn.addEventListener('click', async deleteEvent => {
        console.log(deleteEvent);
        const parent = deleteEvent.target.offsetParent;
        if(parent.id != 'note-example') {
            const data = await postData("/api/notes", {id: parent.id}, 'DELETE');
            console.log(data);
        }
        parent.remove();
    });
});

fetch("/api/notes").then(res => res.json()).then(result => {
    console.log(result);
    const notes = result.result;
    notes.forEach(note => {
        const el = createNoteElement(note.title, note.text, note.date, note._id);
        container.appendChild(el);
    });
});