import express from "express";
import { body } from "express-validator";

import {
  formularioLogin,
  formularioRegistro,
  formularioRecuperacion,
  registrarUsuario,
  autenticarUsuario,
  solicitarRecuperacionPassword,
  paginaConfirmacion,
  formularioActualizacionPassword,
  resetearPassword,
} from "../controllers/usuarioController.js";

const router = express.Router();

// GET
router.get("/login", formularioLogin);
router.get("/registro", formularioRegistro);
router.get("/recuperarPassword", formularioRecuperacion);
router.get("/confirma/:token", paginaConfirmacion);
router.get("/actualizarPassword/:token", formularioActualizacionPassword);

// POST REGISTRO
router.post(
  "/registro",
  body("nombreUsuario")
    .trim()
    .notEmpty()
    .withMessage("El nombre de la persona no puede ser vacío"),

  body("emailUsuario")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico no puede ser vacío")
    .isEmail()
    .withMessage("El correo electrónico no tiene un formato adecuado"),

  body("passwordUsuario")
    .trim()
    .notEmpty()
    .withMessage("La contraseña parece estar vacía")
    .isLength({ min: 8, max: 30 })
    .withMessage("La longitud de la contraseña debe ser entre 8 y 30 caractéres"),

  body("confirmarPasswordUsuario")
    .trim()
    .notEmpty()
    .withMessage("La confirmación de contraseña es obligatoria")
    .custom((value, { req }) => value === req.body.passwordUsuario)
    .withMessage("Ambas contraseñas deben ser iguales"),

  registrarUsuario
);

// POST LOGIN
router.post(
  "/login",
  body("emailUsuario")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico no puede ser vacío")
    .isEmail()
    .withMessage("El correo electrónico no tiene un formato adecuado"),

  body("passwordUsuario")
    .trim()
    .notEmpty()
    .withMessage("La contraseña es obligatoria"),

  autenticarUsuario
);

// POST RECUPERAR PASSWORD
router.post(
  "/recuperarPassword",
  body("emailUsuario")
    .trim()
    .notEmpty()
    .withMessage("El correo electrónico no puede ser vacío")
    .isEmail()
    .withMessage("El correo electrónico no tiene un formato adecuado"),

  solicitarRecuperacionPassword
);

// POST NUEVA PASSWORD
router.post(
  "/actualizarPassword/:token",
  body("passwordUsuario")
    .trim()
    .notEmpty()
    .withMessage("La contraseña no puede ir vacía")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener mínimo 8 caracteres"),

  body("confirmarPasswordUsuario")
    .trim()
    .notEmpty()
    .withMessage("Debes confirmar la contraseña")
    .custom((value, { req }) => value === req.body.passwordUsuario)
    .withMessage("Ambas contraseñas deben ser iguales"),

  resetearPassword
);

export default router;