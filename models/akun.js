"use strict";

module.exports = (sequelize, DataTypes) => {
  const Akun = sequelize.define(
    "Akun",
    {
      akun_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      nama_akun: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      tableName: "akun",
      timestamps: false,
    }
  );

  Akun.associate = function (models) {
    Akun.hasMany(models.Kwitansi, {
      foreignKey: "akun_id",
      as: "kwitansiList",
    });
  };

  return Akun;
};
