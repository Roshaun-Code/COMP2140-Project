document.addEventListener("DOMContentLoaded", () => {
    let bodysign = document.querySelector(".body-sign")
    let signup = document.querySelector(".signup");
    let login = document.querySelector(".login");

    bodysign.addEventListener("click", () => {
        window.location.href = 'signup.html';
    })
    
    signup.addEventListener("click", () => {
        window.location.href = 'signup.html';
    })

    login.addEventListener("click", () => {
        window.location.href = 'login.html';
    })
})