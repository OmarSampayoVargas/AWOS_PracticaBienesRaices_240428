import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Usuario = db.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "nombre",
      validate: {
        notEmpty: { msg: "El nombre no puede estar vacío" }
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: "El email ya está registrado" },
      field: "email",
      validate: {
        isEmail: { msg: "Debe proporcionar un email válido" },
        notEmpty: { msg: "El email no puede estar vacío" }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password",
      validate: {
        notEmpty: { msg: "La contraseña no puede estar vacía" },
        len: {
          args: [8, 100],
          msg: "La contraseña debe tener al menos 8 caracteres"
        }
      }
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "confirmado"
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "token"
    },
    tokenRecovery: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "token_recuperacion"
    },
    tokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "token_expiracion"
    },
    regStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "reg_status"
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "ultimo_acceso"
    }
  },
  {
    tableName: "tb_users",
    timestamps: true
  }
);

export default Usuario;