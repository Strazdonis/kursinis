const form = document.getElementsByTagName("form")[0];
form.addEventListener('submit', async ev => {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    console.log(data);
    const response = await fetch("/api/register", {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    (response.json()).then(data => {
       // console.log(data);
        if(data.error) {
            alert(data.error.message);
        } else if(data.success) {
            alert("successfully registered, you can now login");
            window.location.replace("/login")
        } else {
            alert("Something went wrong, please try again")
        }
    });
});