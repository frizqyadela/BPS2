"use strict";

module.exports = (sequelize, DataTypes) => {
  const Kwitansi = sequelize.define(
    "Kwitansi",
    {
      no_bukti: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      akun_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nama_pembayaran: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      jumlah_bayar: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tanggal: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dokumen: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "kwitansi",
      timestamps: false,
    }
  );

  Kwitansi.associate = function (models) {
    Kwitansi.belongsTo(models.Akun, {
      foreignKey: "akun_id",
      as: "akun",
    });
  };

  return Kwitansi;
};
