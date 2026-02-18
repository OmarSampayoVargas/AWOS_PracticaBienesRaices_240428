const formularioLogin = (req, res) => {
    res.render("auth/login", {pagina: "inicia sesion"});
}

const formularioRegistro = (req, res) => {
    res.render("auth/registro", {pagina: "Registrate"});
}

const formularioRecuperacion = (req, res) => {
    res.render("auth/recuperarPassword", {pagina: "Recupera tu contraseña"});
}    
export {
    formularioLogin,
    formularioRegistro,
    formularioRecuperacion
}