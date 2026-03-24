import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarToken } from "../lib/tokens.js";
import { emailRegistro, emailResetearPassword } from "../lib/email.js";
import crypto from "crypto";

// GET
export const formularioLogin = (req, res) => {
  const creado = req.query.creado === "1";

  return res.render("auth/login", {
    pagina: "Inicia sesión",
    errores: [],
    mensaje: creado ? "✅ Cuenta creada. Revisa tu correo y confirma tu cuenta." : null,
    datos: {},
  });
};

export const formularioRegistro = (req, res) => {
  return res.render("auth/registro", {
    pagina: "Registrate con nosotros :)",
    errores: [],
    datos: {},
  });
};

export const formularioRecuperacion = (req, res) => {
  return res.render("auth/recuperarPassword", {
    pagina: "Te ayudamos a restaurar tu contraseña",
    errores: [],
    ok: null,
    datos: {},
  });
};

export const formularioActualizacionPassword = async (req, res) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({
    where: { tokenRecovery: token },
  });

  if (!usuario) {
    return res.render("templates/mesaje", {
      title: "Error",
      msg: "Token no válido o expirado",
      buttonVisibility: true,
      buttonText: "Volver",
      buttonURL: "/auth/recuperarPassword",
    });
  }

  if (usuario.tokenExpiration && new Date(usuario.tokenExpiration) < new Date()) {
    return res.render("templates/mesaje", {
      title: "Token expirado",
      msg: "El token de recuperación ya expiró.",
      buttonVisibility: true,
      buttonText: "Solicitar otro",
      buttonURL: "/auth/recuperarPassword",
    });
  }

  return res.render("auth/resetearPassword", {
    pagina: "Ingresa tu nueva contraseña",
    errores: [],
    datos: {},
  });
};

// POST
export const registrarUsuario = async (req, res) => {
  await check("nombreUsuario")
    .notEmpty()
    .withMessage("El nombre de la persona no puede ser vacío")
    .run(req);

  await check("emailUsuario")
    .notEmpty()
    .withMessage("El correo electrónico no puede ser vacío")
    .isEmail()
    .withMessage("El correo electrónico no tiene un formato adecuado")
    .run(req);

  await check("passwordUsuario")
    .notEmpty()
    .withMessage("La contraseña parece estar vacía")
    .isLength({ min: 8, max: 30 })
    .withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres")
    .run(req);

  await check("confirmarPasswordUsuario")
    .custom((value, { req }) => value === req.body.passwordUsuario)
    .withMessage("Ambas contraseñas deben ser iguales")
    .run(req);

  const resultadoValidacion = validationResult(req);

  if (!resultadoValidacion.isEmpty()) {
    return res.render("auth/registro", {
      pagina: "Error al intentar crear una cuenta.",
      errores: resultadoValidacion.array(),
      datos: {
        nombreUsuario: req.body.nombreUsuario,
        emailUsuario: req.body.emailUsuario,
      },
    });
  }

  try {
    const name = (req.body.nombreUsuario || "").trim();
    const email = (req.body.emailUsuario || "").trim().toLowerCase();
    const password = req.body.passwordUsuario || "";

    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.render("auth/registro", {
        pagina: "Registrate con nosotros :)",
        errores: [{ msg: `Ya existe un usuario asociado al correo: ${email}` }],
        datos: { nombreUsuario: name, emailUsuario: email },
      });
    }

    const token = generarToken();
    const tokenExpira = new Date(Date.now() + 60 * 60 * 1000);

    const usuario = await Usuario.create({
      name,
      email,
      password,
      confirmed: false,
      tokenRecovery: token,
      tokenExpiration: tokenExpira,
    });

    try {
      await emailRegistro({
        nombre: usuario.name,
        email: usuario.email,
        token: usuario.tokenRecovery,
      });
    } catch (e) {
      console.error("Error enviando email:", e.message);
    }

    return res.redirect("/auth/login?creado=1");
  } catch (error) {
    console.error(error);

    return res.render("auth/registro", {
      pagina: "Error al intentar crear una cuenta.",
      errores: [{ msg: error?.message || "No se pudo crear la cuenta" }],
      datos: {
        nombreUsuario: req.body.nombreUsuario,
        emailUsuario: req.body.emailUsuario,
      },
    });
  }
};

export const paginaConfirmacion = async (req, res) => {
  const { token: tokenCuenta } = req.params;

  try {
    const usuarioToken = await Usuario.findOne({
      where: { tokenRecovery: tokenCuenta },
    });

    if (!usuarioToken) {
      return res.render("templates/mesaje", {
        title: "Error al confirmar la cuenta",
        msg: "El token no es válido o ya fue utilizado.",
      });
    }

    if (usuarioToken.confirmed) {
      return res.render("templates/mesaje", {
        title: "Cuenta ya confirmada",
        msg: "Tu cuenta ya estaba confirmada. Ya puedes iniciar sesión.",
      });
    }

    if (
      usuarioToken.tokenExpiration &&
      new Date(usuarioToken.tokenExpiration) < new Date()
    ) {
      return res.render("templates/mesaje", {
        title: "Token expirado",
        msg: "El token de confirmación expiró. Vuelve a registrarte o solicita uno nuevo.",
      });
    }

    usuarioToken.confirmed = true;
    usuarioToken.tokenRecovery = null;
    usuarioToken.tokenExpiration = null;

    await usuarioToken.save();

    return res.render("templates/mesaje", {
      title: "Confirmación exitosa",
      msg: `La cuenta de: ${usuarioToken.name}, asociada al correo: ${usuarioToken.email}, se confirmó correctamente. Ahora puedes iniciar sesión.`,
    });
  } catch (error) {
    console.error(error);
    return res.render("templates/mesaje", {
      title: "Error",
      msg: "Ocurrió un error al confirmar la cuenta.",
    });
  }
};

export const autenticarUsuario = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("auth/login", {
      pagina: "Inicia sesión",
      errores: errores.array(),
      mensaje: null,
      datos: { emailUsuario: req.body.emailUsuario },
    });
  }

  try {
    const email = (req.body.emailUsuario || "").trim().toLowerCase();
    const password = req.body.passwordUsuario || "";

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.render("auth/login", {
        pagina: "Inicia sesión",
        errores: [{ msg: "El correo no está registrado" }],
        mensaje: null,
        datos: { emailUsuario: email },
      });
    }

    if (!usuario.confirmed) {
      return res.render("auth/login", {
        pagina: "Inicia sesión",
        errores: [{ msg: "Debes confirmar tu cuenta desde tu correo antes de iniciar sesión." }],
        mensaje: null,
        datos: { emailUsuario: email },
      });
    }

    const okPass = await usuario.validarPassword(password);

    if (!okPass) {
      return res.render("auth/login", {
        pagina: "Inicia sesión",
        errores: [{ msg: "Contraseña incorrecta" }],
        mensaje: null,
        datos: { emailUsuario: email },
      });
    }

    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("auth/login", {
      pagina: "Inicia sesión",
      errores: [{ msg: "Ocurrió un error al iniciar sesión" }],
      mensaje: null,
      datos: { emailUsuario: req.body.emailUsuario },
    });
  }
};

export const solicitarRecuperacionPassword = async (req, res) => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("auth/recuperarPassword", {
      pagina: "Te ayudamos a restaurar tu contraseña",
      errores: errores.array(),
      ok: null,
      datos: { emailUsuario: req.body.emailUsuario },
    });
  }

  try {
    const email = (req.body.emailUsuario || "").trim().toLowerCase();
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.render("auth/recuperarPassword", {
        pagina: "Te ayudamos a restaurar tu contraseña",
        errores: [],
        ok: "Si el correo existe, te llegará un mensaje con instrucciones.",
        datos: { emailUsuario: email },
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expira = new Date(Date.now() + 60 * 60 * 1000);

    usuario.tokenRecovery = token;
    usuario.tokenExpiration = expira;
    await usuario.save();

    try {
      await emailResetearPassword({
        nombre: usuario.name,
        email: usuario.email,
        token: usuario.tokenRecovery,
      });
    } catch (e) {
      console.error("Error enviando correo de recuperación:", e.message);
    }

    return res.render("auth/recuperarPassword", {
      pagina: "Te ayudamos a restaurar tu contraseña",
      errores: [],
      ok: "Listo. Revisa tu correo.",
      datos: { emailUsuario: email },
    });
  } catch (error) {
    console.error(error);
    return res.render("auth/recuperarPassword", {
      pagina: "Te ayudamos a restaurar tu contraseña",
      errores: [{ msg: "Ocurrió un error al solicitar la recuperación" }],
      ok: null,
      datos: { emailUsuario: req.body.emailUsuario },
    });
  }
};

export const resetearPassword = async (req, res) => {
  const { token } = req.params;
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.render("auth/resetearPassword", {
      pagina: "Ingresa tu nueva contraseña",
      errores: errores.array(),
    });
  }

  try {
    const usuario = await Usuario.findOne({
      where: { tokenRecovery: token },
    });

    if (!usuario) {
      return res.render("templates/mesaje", {
        title: "Error",
        msg: "Token no válido o expirado",
        buttonVisibility: true,
        buttonText: "Volver",
        buttonURL: "/auth/recuperarPassword",
      });
    }

    if (usuario.tokenExpiration && new Date(usuario.tokenExpiration) < new Date()) {
      return res.render("templates/mesaje", {
        title: "Token expirado",
        msg: "El token de recuperación ya expiró.",
        buttonVisibility: true,
        buttonText: "Solicitar otro",
        buttonURL: "/auth/recuperarPassword",
      });
    }

    usuario.password = req.body.passwordUsuario;
    usuario.tokenRecovery = null;
    usuario.tokenExpiration = null;

    await usuario.save();

    return res.render("templates/mesaje", {
      title: "Contraseña actualizada",
      msg: "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.",
      buttonVisibility: true,
      buttonText: "Iniciar sesión",
      buttonURL: "/auth/login",
    });
  } catch (error) {
    console.error(error);
    return res.render("templates/mesaje", {
      title: "Error",
      msg: "Ocurrió un error al actualizar la contraseña.",
      buttonVisibility: true,
      buttonText: "Volver",
      buttonURL: "/auth/recuperarPassword",
    });
  }
};