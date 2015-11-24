'use strict';
// Script para control de política de cookies. 
// La pagina tiene que tener un elemento div id="cookie1", para que funcione correctamente.
var divCook = document.getElementById('cookie1');
var cook = document.cookie.indexOf('connect.sid');

if (divCook && localStorage.controlCookie && localStorage.controlCookie > 0) {
  divCook.style.display = 'none';

} else {
  if (!divCook && location.pathname != '/politica.html')  {
    alert("Página no valida para este aplicativo");
  }
  if (cook != -1 && location.pathname != "/" && location.pathname != '/politica.html') {
    location.href = "/";
  }
}
  

function controlCookies() {
  // si variable no existe se crea (al clicar en Aceptar)
  localStorage.controlCookie = (localStorage.controlCookie || '0');
  if (parseInt(localStorage.controlCookie) == 0) {
    localStorage.controlCookie = '1'; // incrementamos cuenta de la cookie
    location.reload();
     
  } else if (parseInt(localStorage.controlCookie) > 0) {
    divCook.style.display = 'none'; // Esconde la política de cookies

    // Si no hay incio de session se redirige a la página principal.
    if (!cook) {
      var nc = document.getElementById('noCookies');
      if (nc) {
        location.href = "/";
        location.reload();
      }
    }
  }
}
function denegarCookies() {
  localStorage.removeItem("controlCookie");
  location.href = "/";
}
