const regForm = document.getElementById("register-form").addEventListener("submit",register);

async function register(e) {
    e.preventDefault();

    const regEmail = document.getElementById("register-email").value;
    const regPassword = document.getElementById("register-password").value;
    const confPassword = document.getElementById("confirm-password").value;
    const getKey = document.getElementById("register-key").value;

    const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            Email: regEmail,
            Password: regPassword,
            ConfirmPassword: confPassword,
            KEY: getKey
        })
    });

    const msg = await res.json();
    const message = document.getElementById("success-message")
    message.textContent = msg.message;
    message.style.color = msg.color;
}







