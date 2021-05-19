import { postData } from './utils.js';
const todo_list = document.getElementsByClassName("todo-list")[0];
const input = document.getElementsByClassName("todo-list-input")[0];
input.value = '';
const generateTask = (data) => {
    const el = document.createElement("li");
    el.classList.add(data.state);
    el.innerHTML = `
    <div class="form-check">
      <label class="form-check-label">
        <input class="checkbox" type="checkbox" ${data.state == 'completed' ? 'checked' : ''} />
        ${data.task}
        <i class="input-helper"></i></label>
    </div>
    <i class="remove fas fa-trash"></i>`;
    el.getElementsByClassName("checkbox")[0].addEventListener('click', async (e) => {
        const response = await postData("/api/todo/", { id: data._id, state: 'completed' }, "PATCH");
        console.log(response);
        if (response.success) {
            el.classList.add('completed');
        }
    });
    el.getElementsByClassName("remove")[0].addEventListener('click', async (e) => {
        const response = await postData("/api/todo/", { id: data._id }, "DELETE");
        if (response.success) {
            el.remove();
        }
    });
    return el;
};

fetch("/api/todo/").then(res => res.json()).then(data => {
    data.result.forEach(task => {
        const el = generateTask(task);
        todo_list.appendChild(el);
    });
});

document.getElementById("form").addEventListener('submit', async e => {
    e.preventDefault();
    const task = new FormData(e.target).get('task');
    const response = await postData("/api/todo/", { task }, "POST");
    console.log(response);
    if (response.success) {
        const el = generateTask(response.result);
        todo_list.appendChild(el);
    } else {
        const errors = Object.values(response.error.errors).map(error => error.message).join("<br>");
        swal.fire("Error", errors, 'error');
        console.log(errors)
    }
    input.value = '';
});