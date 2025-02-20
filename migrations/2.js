"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("kwitansi", {
      no_bukti: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      akun_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "akun", // Nama tabel `akun`
          key: "akun_id", // Kolom referensi di tabel `akun`
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      nama_pembayaran: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      jumlah_bayar: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      dokumen: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("kwitansi");
  },
};
