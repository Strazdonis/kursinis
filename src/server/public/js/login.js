import { postData } from "./utils.js";

const form = document.getElementsByTagName("form")[0];
form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    console.log(body);
    const data = await postData("/api/login", body);
    if (data.error) {
        alert(data.error.message);
    } else if (data.success) {
        window.location.replace("/");
    } else {
        alert("Something went wrong, please try again");
    }
});