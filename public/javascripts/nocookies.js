'use strict';
// evita que se saque el botón de no aceptar las cookies.
if (!(localStorage.controlCookie && localStorage.controlCookie > 0)) {
  var nc = document.getElementById('noCookies');
  if (nc)
    nc.style.display = "none";
}
