'use strict';
// evita que se saque el botón de no aceptar las cookies.
// bloquea los botones de inicio de sesión hasta que se acepte las cookies
if (!(localStorage.controlCookie && localStorage.controlCookie > 0)) {
  var nc = document.getElementById('noCookies');
  if (nc) {
    nc.style.display = "none";
    var elementos = document.getElementsByTagName("a");
    var elem;
    for (var i = 0; i < elementos.length; i++) {
      elem = elementos[i];
      if (elem.className != "btn btn-danger" && elem.href != "/") {
        elem.setAttribute("href", "#");
        elem.setAttribute("disabled", "disabled");

      }
    }
  }
}
