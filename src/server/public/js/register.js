import { postData } from "./utils.js";

const form = document.getElementsByTagName("form")[0];
form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    const data = await postData("/api/register", body);
    if (data.error) {
        alert(data.error.message);
    } else if (data.success) {
        alert("successfully registered, you can now login");
        window.location.replace("/login");
    } else {
        alert("Something went wrong, please try again");
    }
});