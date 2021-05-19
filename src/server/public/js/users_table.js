import { postData } from "./utils.js";
document.getElementsByClassName("active")[0].classList.remove("active");
document.getElementById("tables-container").classList.add("active");
document.getElementById("users-table").classList.add("active");
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};
const updateUser = async (data, id) => {
    const response = await postData(`/api/user/`, data, "PUT");
    if (response.success) {
        const index = users.findIndex((user) => user._id === id);
        console.log(index, users[index], response.user);
        users[index] = response.user;
    }

    return response;
};
const deleteUser = async (id) => {
    const response = await postData(`/api/user/`, { id: id }, "DELETE");
    if (response.success) {
        const index = users.findIndex((user) => user._id === id);
        users = users.splice(index, 1);
        console.log(index, users[index], users);
        users[index] = response.user;
        console.log(users);
        document.getElementById(`row_${id}`).style.display = "none";
    }

    return response;
};

let users;
const generateViewButton = (id, element) => {
    const viewButton = document.createElement('button');
    viewButton.innerHTML = `<i class="fas fa-external-link-alt"></i>`;
    viewButton.classList.add("btn", "btn-primary", "btn-md", "mr-3");
    viewButton.type = "button";
    viewButton.addEventListener("click", async e => {
        const user = users.find(user => user._id === id);
        console.log(user);
        const { value: formValues } = await Swal.fire({
            title: 'Edit user',
            html:
                `
                    ID: ${id}
                    <div class="form-group">
                        <label class="form-check-label" for="swal-email">Email</label>
                        <input id="swal-email" type="email" class="form-control" value="${user.email}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-username">Username</label>
                        <input id="swal-username" type="text" class="form-control" value="${user.username}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-displayname">Display name</label>
                        <input id="swal-displayname" type="text" class="form-control" value="${user.displayname}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-firstname">First name</label>
                        <input id="swal-firstname" type="text" class="form-control" value="${user.firstname}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-lastname">Last name</label>
                        <input id="swal-lastname" type="text" class="form-control" value="${user.lastname}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-lastname">City</label>
                        <input id="swal-city" type="text" class="form-control" value="${user.city}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-lastname">Verification code</label>
                        <input id="swal-code" type="text" class="form-control" value="${user.code}">
                    </div>
                    <div class="form-group">
                        <label class="form-check-label" for="swal-perms">Permissions</label>
                        <select id="swal-perms" class="custom-select">
                            <option selected disabled value="${user.perms}">${capitalize(user.perms)}</option>
                            <option value="normal">Normal</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <label class="form-check-label" for="swal-verified">Verification status</label><br/>
                    <div class="form-check form-check-inline col-md-5">
                        <input class="form-check-input swal2-select " ${user.verified ? 'checked' : ''} type="radio" name="isVerified" id="swal-verified-true" value="true">
                        <label class="form-check-label" for="swal-verified-true">Verified</label>
                    </div>
                    <div class="form-check form-check-inline col-md-5">
                        <input class="form-check-input swal2-select " ${user.verified ? '' : 'checked'} type="radio" name="isVerified" id="swal-verified-false" value="false">
                        <label class="form-check-label" for="swal-verified-false">Unverified</label>
                    </div>
                    
                    `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    id: id,
                    email: document.getElementById('swal-email').value,
                    username: document.getElementById('swal-username').value,
                    displayname: document.getElementById('swal-displayname').value,
                    firstname: document.getElementById('swal-firstname').value,
                    lastname: document.getElementById('swal-lastname').value,
                    city: document.getElementById('swal-city').value,
                    perms: document.getElementById('swal-perms').value,
                    code: document.getElementById('swal-code').value,
                    verified: document.getElementById('swal-verified-true').checked
                };
            },
            showCancelButton: true,
            confirmButtonText:
                'Save',
        });
        if (formValues) {
            const response = await updateUser(formValues, id);
            Swal.fire(response.message);
            if(response.success) {
                const children = element.children;
                const data = response.user;
                children[0].innerText = data.username;
                children[1].innerText = data.displayname;
                children[2].innerText = data.fullname;
                children[3].innerText = data.perms;
                children[4].innerText = data.verified;
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
            title: 'Are you sure you want to delete this user?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!confirmation.isConfirmed) return;
        const result = await deleteUser(id);
        console.log(result);
        Swal.fire(
            'Deleted!',
            'The user has been deleted.',
            'success'
        );

    });
    return deleteButton;
};
fetch("/api/users").then(res => res.json()).then(response => {
    users = response.result;
    const table = $("#table");

    users.forEach(user => {
        const html = `<td>${user.username}</td>
                <td>${user.displayname}</td>
                <td>${user.firstname} ${user.lastname}</td>
                <td>${user.perms}</td>
                <td>${user.verified}</td>
                <td class="action-buttons"></td>`;
        const element = document.createElement("tr");
        element.id = `row_${user._id}`;
        element.innerHTML = html;
        const viewBtn = generateViewButton(user._id, element);
        const delBtn = generateDeleteButton(user._id, element);
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

