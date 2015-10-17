// Script para control de política de cookies. 
// La pagina tiene qut tener un elemento div id="cookie1", para que funcione correctamente.
if (localStorage.controlCookie && !isNaN(localStorage.controlCookie) && parseInt(localStorage.controlCookie) > 0) 
  cookie1.style.display='none';
else
  if (location.pathname != "/" && location.pathname != "/politica.html")
    location.href="/";

function controlCookies() {
  // si variable no existe se crea (al clicar en Aceptar)
  localStorage.controlCookie = (localStorage.controlCookie || "0");
  if (isNaN(localStorage.controlCookie) || parseInt(localStorage.controlCookie)== 0) {
    localStorage.controlCookie="1"; // incrementamos cuenta de la cookie
  }
  if (!isNaN(localStorage.controlCookie) && parseInt(localStorage.controlCookie) > 0) {
    cookie1.style.display='none'; // Esconde la política de cookies
  }
}
function denegarCookies() {
  localStorage.removeItem("controlCookie");
  location.href = "/";
}