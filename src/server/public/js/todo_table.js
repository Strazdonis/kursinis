import { postData } from "./utils.js";
document.getElementsByClassName("active")[0].classList.remove("active");
document.getElementById("tables-container").classList.add("active");
document.getElementById("todos-table").classList.add("active");
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
const updateTask = async (data, id) => {
    console.log(data, id);
    const response = await postData(`/api/todo/${id}`, data, "PUT");
    console.log(response);

    return response;
};
const deleteTask = async (id) => {
    const response = await postData(`/api/todo/${id}`, { id: id }, "DELETE");
    if (response.success) {
        swal.fire("success", "successfully deleted task", "success");
        document.getElementById(`row_${id}`).style.display = "none";

    }

    return response;
};

let users;
const generateViewButton = (id, todo, element) => {
    const viewButton = document.createElement('button');
    viewButton.innerHTML = `<i class="fas fa-external-link-alt"></i>`;
    viewButton.classList.add("btn", "btn-primary", "btn-md", "mr-3");
    viewButton.type = "button";
    viewButton.addEventListener("click", async e => {
        
        const { value: formValues } = await Swal.fire({
            customClass: {
                popup: 'col-md-6',
            },
            title: 'Edit To-Do',
            html:
                `
                    ID: ${id}
                    <div class="form-group">
                        <label class="form-check-label" for="swal-task">Task</label>
                        <input id="swal-task" type="text" class="form-control" value="${todo.task}">
                    </div>
                   
                    <label class="form-check-label" for="swal-state">State</label><br/>
                    <div class="form-check form-check-inline col-lg-12 col-xl-3">
                        <input class="form-check-input swal2-select" ${todo.state === "active" ? 'checked' : ''} type="radio" name="state" id="swal-state-active">
                        <label class="form-check-label" for="swal-state-active">Active</label>
                    </div>
                    <div class="form-check form-check-inline col-lg-12 col-xl-3">
                        <input class="form-check-input swal2-select" ${todo.state === "completed" ? 'checked' : ''} type="radio" name="state" id="swal-state-completed">
                        <label class="form-check-label" for="swal-state-completed">Completed</label>
                    </div>
                    <div class="form-check form-check-inline col-lg-12 col-xl-3">
                        <input class="form-check-input swal2-select" ${todo.state === "removed" ? 'checked' : ''} type="radio" name="state" id="swal-state-removed">
                        <label class="form-check-label" for="swal-state-removed">Removed</label>
                    </div>
                    
                    `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    id: id,
                    task: document.getElementById('swal-task').value,
                    state: document.getElementById('swal-state-active').checked ? 'active' : document.getElementById('swal-state-completed').checked ? 'completed' : 'removed',
                };
            },
            showCancelButton: true,
            confirmButtonText:
                'Save',
        });
        if (formValues) {
            formValues.user = todo.user;
            const response = await updateTask(formValues, id);
            Swal.fire(response.message);
            if(response.success) {
                const children = element.children;
                children[1].innerText = formValues.task;
                children[2].innerText = formValues.state;
            }
            // Swal.fire(JSON.stringify(formValues));
        }
    });
    return viewButton;
};

const generateDeleteButton = (id, element) => {
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteButton.classList.add("btn", "btn-danger", "btn-md");
    deleteButton.type = "button";
    deleteButton.addEventListener('click', async (e) => {
        const confirmation = await Swal.fire({
            title: 'Are you sure you want to delete this task?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!confirmation.isConfirmed) return;
        const result = await deleteTask(id);
        console.log(result);
        Swal.fire(
            'Deleted!',
            'The task has been deleted.',
            'success'
        );

    });
    return deleteButton;
};
fetch("/api/todo/all").then(res => res.json()).then(response => {
    const todos = response.result;
    const table = $("#table");

    todos.forEach(todo => {
        const html = `<td>${todo.user}</td>
                <td>${todo.task}</td>
                <td>${todo.state}</td>
                <td class="action-buttons"></td>`;
        const element = document.createElement("tr");
        element.id = `row_${todo._id}`;
        element.innerHTML = html;
        const viewBtn = generateViewButton(todo._id, todo, element);
        const delBtn = generateDeleteButton(todo._id, todo, element);
        const buttonsEl = element.getElementsByClassName("action-buttons")[0];
        buttonsEl.appendChild(viewBtn);
        buttonsEl.appendChild(delBtn);

        table.append(element);
    });
    const datatable = table.DataTable({
        "paging": true,
        "lengthChange": false,
        "searching": false,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
    });
});

