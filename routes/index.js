var express = require("express");
const multer = require("multer");
const path = require("path");
var router = express.Router();
const { Akun, Kwitansi } = require("../models");
const { Op, where } = require("sequelize");

router.get("/", function (req, res, next) {
  res.render("home", { layout: "layouthome" });
});

/* GET beranda page */
router.get("/beranda", async function (req, res, next) {
  try {
    // Menyimpan hasil akun dan jumlah kwitansi dalam array
    const akunData = [];

    // Mendapatkan semua akun
    const akun = await Akun.findAll({});

    for (let i = 0; i < akun.length; i++) {
      // Hitung jumlah kwitansi untuk akun saat ini
      const jumlahKwitansi = await Kwitansi.count({
        where: { akun_id: akun[i].akun_id },
      });

      // Tambahkan data akun dan jumlah kwitansi ke array
      akunData.push({
        akun_id: akun[i].akun_id,
        nama_akun: akun[i].nama_akun,
        jumlah_kwitansi: jumlahKwitansi,
      });
    }

    res.render("beranda", {
      title: "Beranda",
      akunData, // Data akun dengan jumlah kwitansi
    });
  } catch (error) {
    console.error("Error starting beranda:", error);
    next(error);
  }
});

/* GET beranda page */
router.get("/daftar/:akunId", async function (req, res, next) {
  try {
    const akunId = req.params.akunId;

    // Temukan akun berdasarkan akunId
    const akun = await Akun.findOne({
      where: { akun_id: akunId },
    });

    if (!akun) {
      return res.status(404).send("Akun tidak ditemukan");
    }

    // Ambil data kwitansi berdasarkan akun_id
    const kwitansi = await Kwitansi.findAll({
      where: { akun_id: akunId },
    });

    res.render("daftar", {
      title: "Daftar Kwitansi",
      akun,
      kwitansi,
    });
  } catch (error) {
    console.error("Error loading daftar page:", error);
    next(error);
  }
});

router.post("/cari1", async function (req, res, next) {
  const { all } = req.body;
  try {
    const kwitansi = await Kwitansi.findAll({
      where: {
        [Op.or]: [{ no_bukti: { [Op.like]: `%${all}%` } }, { nama_pembayaran: { [Op.like]: `%${all}%` } }, { tanggal: { [Op.like]: `%${all}%` } }],
      },
    });

    res.render("daftar", {
      title: "Daftar Kwitansi",
      kwitansi,
    });
  } catch (error) {
    console.error("Error searching outgoing docs (All-in-One):", error);
    res.status(500).send("Internal Server Error");
  }
});

/* GET beranda page */
router.get("/detail/:kwitansiId", async function (req, res, next) {
  const kwitansiId = req.params.kwitansiId;

  // Temukan akun berdasarkan kwitansiId
  const kwitansi = await Kwitansi.findOne({
    where: { no_bukti: kwitansiId },
  });

  res.render("detail", {
    title: "Detail",
    kwitansi,
  });
});

/* GET beranda page */
router.get("/dokumen", function (req, res, next) {
  res.render("dokumen", { title: "Dokumen" });
});

/* GET beranda page */
// Konfigurasi Multer untuk menyimpan file ke folder /public/pdf
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/pdf")); // Folder tujuan
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname); // Mendapatkan ekstensi file
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension); // Format nama file
  },
});

// Middleware Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Batas ukuran file (5 MB)
  fileFilter: function (req, file, cb) {
    // Filter hanya file PDF
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PDF yang diperbolehkan!"));
    }
  },
});

router.get("/tambahakun", function (req, res, next) {
  res.render("tambahakun", { title: "Tambah Akun" });
});

router.post("/tambahakun", async function (req, res, next) {
  try {
    const { nama_akun } = req.body;

    // Simpan data ke database
    await Akun.create({
      nama_akun, // Simpan id_akun ke tabel Akun
    });

    res.redirect("/beranda"); // Redirect ke halaman daftar kwitansi
  } catch (error) {
    console.error("Error saat menambah kwitansi:", error.message);
    res.status(500).send("Terjadi kesalahan saat menyimpan data.");
  }
  res.render("tambahakun", { title: "Tambah Akun" });
});

// Route GET untuk menampilkan form tambah kwitansi
router.get("/tambahkwitansi", async function (req, res, next) {
  try {
    const akun = await Akun.findAll(); // Ambil semua data akun dari database
    res.render("tambahkwitansi", {
      title: "Tambah Kwitansi",
      akun, // Kirim data akun ke view
    });
  } catch (error) {
    console.error("Error saat mengambil data akun:", error.message);
    res.status(500).send("Terjadi kesalahan saat mengambil data akun.");
  }
});

// Route POST untuk menyimpan kwitansi
router.post("/tambahkwitansi", upload.single("signed_file"), async function (req, res, next) {
  try {
    const { no_bukti, nama_pembayaran, tanggal, jumlah_bayar, akun_id } = req.body;

    // Nama file PDF yang diunggah
    const dokumen = req.file ? req.file.filename : null;

    // Simpan data ke database
    await Kwitansi.create({
      no_bukti,
      nama_pembayaran,
      tanggal,
      jumlah_bayar,
      dokumen,
      akun_id, // Simpan id_akun ke tabel kwitansi
    });

    res.redirect("/daftar/" + akun_id); // Redirect ke halaman daftar kwitansi
  } catch (error) {
    console.error("Error saat menambah kwitansi:", error.message);
    res.status(500).send("Terjadi kesalahan saat menyimpan data.");
  }
});

/* GET beranda page */
router.get("/editkwitansi/:kwitansiId", async function (req, res, next) {
  const kwitansiId = req.params.kwitansiId;

  // Temukan akun berdasarkan kwitansiId
  const kwitansi = await Kwitansi.findOne({
    where: { no_bukti: kwitansiId },
  });
  console.log("_____" + kwitansi.no_bukti);
  res.render("editkwitansi", {
    title: "Edit Kwitansi",
    kwitansi,
  });
});

router.post("/editForm/:kwitansiId", async function (req, res, next) {
  const kwitansiId = req.params.kwitansiId;
  const { no_bukti, nama_pembayaran, tanggal, jumlah_bayar } = req.body;

  try {
    await Kwitansi.update(
      {
        no_bukti,
        nama_pembayaran,
        tanggal,
        jumlah_bayar,
      },
      {
        where: { no_bukti: kwitansiId },
      }
    );

    // Redirect dengan query parameter success=true
    return res.redirect(`/editkwitansi/${kwitansiId}?success=true`);
  } catch (error) {
    console.error("Error updating kwitansi:", error);
    next(error); // Tangani error dengan middleware
  }
});

router.post("/hapusKwitansi/:kwitansiId", async function (req, res, next) {
  const kwitansiId = req.params.kwitansiId;

  const kwitansi = await Kwitansi.findOne({
    where: { no_bukti: kwitansiId },
  });
  try {
    const hapus = await Kwitansi.destroy({
      where: { no_bukti: kwitansiId },
    });

    return res.redirect(`/daftar/${kwitansi.akun_id}`);
  } catch (error) {
    console.error("Error updating kwitansi:", error);
    next(error); // Tangani error dengan middleware
  }
});
router.post("/editForm/:kwitansiId", async function (req, res, next) {
  const kwitansiId = req.params.kwitansiId;
  const { no_bukti, nama_pembayaran, tanggal, jumlah_bayar } = req.body;

  try {
    await Kwitansi.update(
      {
        no_bukti,
        nama_pembayaran,
        tanggal,
        jumlah_bayar,
      },
      {
        where: { no_bukti: kwitansiId },
      }
    );

    // Redirect dengan query parameter success=true
    return res.redirect(`/editkwitansi/${kwitansiId}?success=true`);
  } catch (error) {
    console.error("Error updating kwitansi:", error);
    next(error); // Tangani error dengan middleware
  }
});

/* GET beranda page */
router.get("/editakun/:akunId", async function (req, res, next) {
  try {
    const akunId = req.params.akunId;
    // const { nama_akun } = req.body;

    // const akun = await Akun.findOne({
    //   where: { nama_akun: nama_akun },
    // });

    // await Akun.update(
    //   {
    //     nama_akun,
    //   },
    //   {
    //     where: { akun_id: akunId },
    //   }
    // );

    res.render("editakun", {
      title: "Edit Akun",
      akunId
    });
  } catch (error) {
    console.error("Error loading daftar page:", error);
    next(error);
  }
});

module.exports = router;
