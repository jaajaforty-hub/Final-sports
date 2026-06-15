

document.getElementById("login-form").addEventListener("submit", login);

async function login(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            loginEmail: email,
            loginPassword: password
        })
    });

    const data = await res.json();
    
    if(data.success){
        window.location.href = "/soccer"
    }
   
    const message = document.getElementById("login-message");
    message.textContent = data.message;
    message.style.color = data.color;
    
}
