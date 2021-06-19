import { postData } from "./utils.js";
document.getElementsByClassName("active")[0].classList.remove("active");
document.getElementById("tables-container").classList.add("active");
document.getElementById("cryptos-table").classList.add("active");
const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const updateTracks = async (data, id) => {
    const result = await postData("/api/crypto/update_user", data, "POST");
    return result;
};

const generateViewButton = (id, cryptos, element) => {
    const viewButton = document.createElement('button');
    viewButton.innerHTML = `<i class="fas fa-external-link-alt"></i>`;
    viewButton.classList.add("btn", "btn-primary", "btn-md", "mr-3");
    viewButton.type = "button";
    viewButton.addEventListener("click", async e => {
        const { value: formValues } = await Swal.fire({
            title: 'Edit tracked cryptos',
            html:
                `
                    ID: ${id}
                    <div class="form-group">
                        <label class="form-check-label" for="swal-cryptos">Cryptos</label>
                        <input id="swal-cryptos" type="text" class="form-control" value="${cryptos.join(", ")}">
                    </div>
                    
                    
                    `,
            focusConfirm: false,
            preConfirm: () => {
                return {
                    user: id,
                    cryptos: document.getElementById('swal-cryptos').value.split(", "),
                };
            },
            showCancelButton: true,
            confirmButtonText:
                'Save',
        });
        if (formValues) {
            const response = await updateTracks(formValues, id);
            Swal.fire(response.message);
            if(response.success) {
                const children = element.children;
                children[1].innerText = formValues.cryptos.join(", ");
            }
            // Swal.fire(JSON.stringify(formValues));
        }
    });
    return viewButton;
};

fetch("/api/crypto/all").then(res => res.json()).then(response => {
    const data = response.result;
    const table = $("#table");
    data.forEach(crypto => {
        const html = `<td>${crypto.user}</td>
                <td>${crypto.crypto.join(", ")}</td>
                <td class="action-buttons"></td>`;
        const element = document.createElement("tr");
        element.id = `row_${crypto._id}`;
        element.innerHTML = html;
        const viewBtn = generateViewButton(crypto.user, crypto.crypto, element);
        const buttonsEl = element.getElementsByClassName("action-buttons")[0];
        buttonsEl.appendChild(viewBtn);

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

