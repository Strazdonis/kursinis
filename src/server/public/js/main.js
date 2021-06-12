document.getElementById("create-room").addEventListener("click", e => {
    fetch("/api/create-room").then(res => res.json()).then((room) => {
        window.location.href = "/room/" + room;
    });
});
const input = document.getElementById("room-input");
document.getElementById("join-room").addEventListener("click", e => {
    const room = input.value;
    if(!room) {
        return Swal.fire("Error", "You need to input a room id", "error");
    }
    window.location.href = "/room/" + room;
})