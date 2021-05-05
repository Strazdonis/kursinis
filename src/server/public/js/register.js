import { postData, showError } from "./utils.js";

const form = document.getElementsByTagName("form")[0];
form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const body = Object.fromEntries(new FormData(form).entries());
    const err_el = document.getElementById("err_msg");
    const data = await postData("/api/register", body);
    if (data.error) {
        const msg = data.error.message;
        const inputs = {
            user: document.getElementById("input-user"),
            email: document.getElementById("input-email"),
            firstname: document.getElementById("input-firstname"),
            lastname: document.getElementById("input-lastname"),
            pass: document.getElementById("input-pass"),
            pass2: document.getElementById("input-pass2"),
        };

        if(msg == "passShort" || msg == "passMismatch") {
            let text = msg == "passShort" ? "The entered password is too short. Password must be at least 6 characters long" : "The entered passwords don't match";
            showError(text, err_el, inputs.pass, inputs.pass2);
        } else if(msg == "emailTaken") {
            showError("An account with this email already exists", err_el, inputs.email);
        } else {
            const highlight = Object.keys(data.error?.errors).map(input => inputs[input]) || []; //jshint ignore:line
            console.log(highlight);
            showError(data.error.message.replace(data.error._message + ":", "").trim() || "Something went wrong, please try again", err_el, ...highlight);
            
        }

    } else if (data.success) {
        alert("successfully registered, you can now login");
        window.location.replace("/login");
    } else {
        showError("Something went wrong, please try again", err_el);
    }
});