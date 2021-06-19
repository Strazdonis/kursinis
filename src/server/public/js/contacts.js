document.getElementById("share-room-bttn").addEventListener('click', e => {
    const split = window.location.pathname.split("/");
    if(split[1] != "room") return Swal.fire("You are not in a room", "", "error");
    return Swal.fire("Share room", `Send this url to your friends:<br><b>${window.location}</b>`);
});