fetch("/api/stats", { cache: "force-cache" }).then(res => res.json()).then(data => {
    const users_stats = document.getElementById("total-users-stat");
    const todo_stats = document.getElementById("total-todos-stat");
    const crypto_stats = document.getElementById("total-cryptos-stat");
    const notes_stats = document.getElementById("total-notes-stat");
    console.log(data);
    users_stats.innerHTML = data.users || "N/A";
    todo_stats.innerHTML = data.todo || "N/A";
    crypto_stats.innerHTML = data.crypto || "N/A";
    notes_stats.innerHTML = data.notes || "N/A";
});

fetch("/api/notes/new").then(res => res.json()).then(data => {
    const container = document.getElementById("new-notes-body");
    data.result.forEach(note => {
        const el = document.createElement("tr");
        el.id = note._id;
        el.innerHTML = `<td>${note.user}</td>
        <td>${note.title}</td>
        <td>${note.text}</td>
        <td>${(new Date(note.date)).toLocaleString()}</td>
        <td>
          <a href="#" class="text-muted">
            <i class="delete-icon fas fa-trash"></i>
          </a>
        </td>`;
        el.getElementsByClassName("delete-icon")[0].addEventListener('click', e => {
            console.log('clicked', e.target);
        });
        container.appendChild(el);

    });

})