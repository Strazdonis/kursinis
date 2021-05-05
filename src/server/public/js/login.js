import { postData, showError } from "./utils.js";



const form = document.getElementsByTagName("form")[0];
form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    const err_el = document.getElementById("err_msg");
    const data = await postData("/api/login", body);
    if (data.error) {
        const userInput = document.getElementById("input-user");
        const passInput = document.getElementById("input-pass");
        showError(data.error.message, err_el, userInput, passInput);
    } else if (data.success) {
        window.location.replace("/");
    } else {
        showError("Something went wrong, please try again", err_el);
    }
});