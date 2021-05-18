import { postData } from "./utils.js";
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
const updateNote = async (data, id) => {
    console.log(data, id);

    const response = await postData(`/api/notes/${id}`, data, "PUT");
    console.log(response);

    return response;
};
const deleteNote = async (id) => {
    const response = await postData(`/api/notes/${id}`, { id: id }, "DELETE");
    console.log(response);

    return response;
};


const generateViewButton = (id, note, element) => {
    const viewButton = document.createElement('button');
    viewButton.innerHTML = `<i class="fas fa-external-link-alt"></i>`;
    viewButton.classList.add("btn", "btn-primary", "btn-md", "mr-3");
    viewButton.type = "button";
    viewButton.addEventListener("click", async e => {
        console.log(note);
        const { value: formValues } = await Swal.fire({
            title: 'Edit Note',
            html:
                `
                    ID: ${id}
                    <div class="form-group">
                        <label class="form-check-label" for="swal-title">Title</label>
                        <input id="swal-title" type="text" class="form-control" value="${note.title}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-text">Text</label>
                        <input id="swal-text" type="text" class="form-control" value="${note.text}">
                    </div>
                    `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    id: id,
                    title: document.getElementById('swal-title').value,
                    text: document.getElementById('swal-text').value,
                };
            },
            showCancelButton: true,
            confirmButtonText:
                'Save',
        });
        if (formValues) {
            formValues.user = note.user;
            const response = await updateNote(formValues, id);
            Swal.fire(response.message);
            if(response.success) {
                const children = element.children;
                children[1].innerText = formValues.title;
                children[2].innerText = formValues.text;
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
            title: 'Are you sure you want to delete this note?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!confirmation.isConfirmed) return;
        const result = await deleteNote(id);
        console.log(result);
        Swal.fire(
            'Deleted!',
            'The note has been deleted.',
            'success'
        );

    });
    return deleteButton;
};
fetch("/api/notes/all").then(res => res.json()).then(response => {
    const notes = response.result;
    const table = $("#table");

    notes.forEach(note => {
        const html = `
                <td>${note.user}</td>
                <td>${note.title}</td>
                <td>${note.text}</td>
                <td class="action-buttons"></td>`;
        const element = document.createElement("tr");
        element.id = `row_${note.user}`;
        element.innerHTML = html;
        const viewBtn = generateViewButton(note._id, note, element);
        const delBtn = generateDeleteButton(note._id, note, element);
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

