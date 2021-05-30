import { postData } from "./utils.js";
[...document.getElementsByClassName("settings-edit")].forEach(button => {
    button.addEventListener("click", async (e) => {
        const fieldKey = button.getAttribute("attr-field");
        const fieldPretty = button.getAttribute("attr-pretty");
        const fieldCurrent = button.getAttribute("attr-current");
        const { value: newValue } = await Swal.fire({
            title: `Set new ${fieldPretty}`,
            input: 'text',
            inputPlaceholder: `${fieldCurrent}`
        });

        if (!newValue || (newValue == fieldCurrent)) {
            return;
        }
        const options = {};
        options[fieldKey] = newValue;
        const response = await postData("/api/user/", options, "PATCH");
        if(response.success) {
            document.location.reload();
        }

    });
});