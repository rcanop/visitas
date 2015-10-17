'use strict';
// Script para control de política de cookies. 
// La pagina tiene que tener un elemento div id="cookie1", para que funcione correctamente.
var divCook = document.getElementById('cookie1');
if (divCook && localStorage.controlCookie && localStorage.controlCookie > 0)
  divCook.style.display = 'none';

else
  if (location.pathname != "/" && location.pathname != "/politica.html")
    location.href = "/";

function controlCookies() {
  // si variable no existe se crea (al clicar en Aceptar)
  localStorage.controlCookie = (localStorage.controlCookie || '0');
  if (parseInt(localStorage.controlCookie) == 0) {
    localStorage.controlCookie = '1'; // incrementamos cuenta de la cookie
  }
  if (parseInt(localStorage.controlCookie) > 0) {
    divCook.style.display = 'none'; // Esconde la política de cookies
    
    var nc = document.getElementById('noCookies');
    if (nc)
      location.href = "/";

  }
}
function denegarCookies() {
  localStorage.removeItem("controlCookie");
  location.href = "/";
}
