const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("#password-toggle");
const loginForm = document.querySelector("#login-form");
const formMessage = document.querySelector("#form-message");

passwordToggle.addEventListener("click", () => {
  const isPasswordHidden = passwordInput.type === "password";
  passwordInput.type = isPasswordHidden ? "text" : "password";
  passwordToggle.textContent = isPasswordHidden ? "Ocultar" : "Mostrar";
  passwordToggle.setAttribute("aria-label", isPasswordHidden ? "Ocultar senha" : "Mostrar senha");
  passwordToggle.setAttribute("aria-pressed", String(isPasswordHidden));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "A autenticação ainda não está conectada a um serviço.";
});