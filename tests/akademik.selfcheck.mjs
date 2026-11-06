import assert from "node:assert";

// 1. Verify preset holidays
const PRESET_NATIONAL_HOLIDAYS = {
  2026: [
    { tanggal: "2026-01-01", keterangan: "Tahun Baru 2026 Masehi" },
    { tanggal: "2026-01-16", keterangan: "Isra Mi'raj Nabi Muhammad SAW" },
    { tanggal: "2026-02-17", keterangan: "Tahun Baru Imlek 2577 Kongzili" },
    { tanggal: "2026-03-21", keterangan: "Hari Raya Nyepi Tahun Baru Saka 1948" },
    { tanggal: "2026-03-20", keterangan: "Hari Raya Idul Fitri 1447 H (Hari ke-1)" },
    { tanggal: "2026-03-21", keterangan: "Hari Raya Idul Fitri 1447 H (Hari ke-2)" },
    { tanggal: "2026-04-03", keterangan: "Wafat Yesus Kristus" },
    { tanggal: "2026-05-01", keterangan: "Hari Buruh Internasional" },
    { tanggal: "2026-05-14", keterangan: "Kenaikan Yesus Kristus" },
    { tanggal: "2026-05-27", keterangan: "Hari Raya Idul Adha 1447 H" },
    { tanggal: "2026-05-31", keterangan: "Hari Raya Waisak 2570 BE" },
    { tanggal: "2026-06-01", keterangan: "Hari Lahir Pancasila" },
    { tanggal: "2026-06-16", keterangan: "Tahun Baru Islam 1448 Hijriah" },
    { tanggal: "2026-08-17", keterangan: "Hari Kemerdekaan Republik Indonesia" },
    { tanggal: "2026-08-25", keterangan: "Maulid Nabi Muhammad SAW" },
    { tanggal: "2026-12-25", keterangan: "Hari Raya Natal" },
  ],
  2027: [
    { tanggal: "2027-01-01", keterangan: "Tahun Baru 2027 Masehi" },
    { tanggal: "2027-01-06", keterangan: "Isra Mi'raj Nabi Muhammad SAW" },
    { tanggal: "2027-02-06", keterangan: "Tahun Baru Imlek 2578 Kongzili" },
    { tanggal: "2027-03-10", keterangan: "Hari Raya Idul Fitri 1448 H (Hari ke-1)" },
    { tanggal: "2027-03-11", keterangan: "Hari Raya Idul Fitri 1448 H (Hari ke-2)" },
    { tanggal: "2027-03-26", keterangan: "Wafat Yesus Kristus" },
    { tanggal: "2027-05-01", keterangan: "Hari Buruh Internasional" },
    { tanggal: "2027-05-06", keterangan: "Kenaikan Yesus Kristus" },
    { tanggal: "2027-05-17", keterangan: "Hari Raya Idul Adha 1448 H" },
    { tanggal: "2027-05-20", keterangan: "Hari Raya Waisak 2571 BE" },
    { tanggal: "2027-06-01", keterangan: "Hari Lahir Pancasila" },
    { tanggal: "2027-06-06", keterangan: "Tahun Baru Islam 1449 Hijriah" },
    { tanggal: "2027-08-15", keterangan: "Maulid Nabi Muhammad SAW" },
    { tanggal: "2027-08-17", keterangan: "Hari Kemerdekaan Republik Indonesia" },
    { tanggal: "2027-12-25", keterangan: "Hari Raya Natal" },
  ],
};

console.log("Running self-check tests for fitur Akademik...");

assert(Array.isArray(PRESET_NATIONAL_HOLIDAYS[2026]), "2026 holidays should be an array");
assert(PRESET_NATIONAL_HOLIDAYS[2026].length >= 16, "2026 should have 16 preset holidays");
assert(Array.isArray(PRESET_NATIONAL_HOLIDAYS[2027]), "2027 holidays should be an array");

for (const holiday of [...PRESET_NATIONAL_HOLIDAYS[2026], ...PRESET_NATIONAL_HOLIDAYS[2027]]) {
  assert(/^\d{4}-\d{2}-\d{2}$/.test(holiday.tanggal), `Invalid date format: ${holiday.tanggal}`);
  assert(holiday.keterangan && holiday.keterangan.trim().length > 0, "Empty holiday description");
}

// 2. Verify date ordering validation logic
const isDateRangeValid = (start, end) => new Date(start) <= new Date(end);
assert(isDateRangeValid("2026-07-01", "2027-06-30") === true, "Valid range should pass");
assert(isDateRangeValid("2027-07-01", "2026-06-30") === false, "Inverted range should fail");

// 3. Verify semester date containment logic
const isDateInSemester = (target, semStart, semEnd) =>
  target >= semStart && target <= semEnd;

assert(isDateInSemester("2026-08-15", "2026-07-01", "2026-12-31") === true);
assert(isDateInSemester("2027-02-15", "2026-07-01", "2026-12-31") === false);

console.log("All akademik self-check assertions passed successfully!");
