
fetch("/api/stats").then(res => res.json()).then(data => {
    const users_stats = document.getElementById("total-users-stat");
    const todo_stats = document.getElementById("total-todos-stat");
    const crypto_stats = document.getElementById("total-cryptos-stat");
    const notes_stats = document.getElementById("total-notes-stat");
    console.log(data);
    users_stats.innerHTML = data.users;
    todo_stats.innerHTML = data.todo;
    crypto_stats.innerHTML = data.crypto;
    notes_stats.innerHTML = data.notes;
});