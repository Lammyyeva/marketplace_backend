#!/usr/bin/env node
/* eslint-disable */
/**
 * sync-tk-po.js
 *
 * Reads Vendure's bundled `en.po` (the source-of-truth msgid catalog
 * for the React Dashboard's admin chrome), applies a curated Turkmen
 * translation dictionary for high-frequency UI vocabulary, and
 * (re)writes our project's `tk.po` so it contains:
 *
 *   - EVERY msgid that Vendure ships, in the same order, with header
 *     metadata preserved.
 *   - Existing non-empty msgstr entries from our previous tk.po
 *     (we never overwrite a translator's work).
 *   - Curated dictionary entries for common UI words.
 *   - `msgstr ""` for every other entry — Lingui auto-falls-back to
 *     the English source text for empty msgstr, which is the
 *     intentional behaviour described in docs/ADMIN_I18N.md.
 *
 * Run me after every `@vendure/dashboard` upgrade:
 *
 *   node scripts/translate/sync-tk-po.js
 *
 * Dependency-free (no `gettext-parser` etc.) so it runs in any Node
 * 18+ environment without an install step.
 */

const fs = require("node:fs");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const EN_PO_PATH = path.join(
  PROJECT_ROOT,
  "node_modules/@vendure/dashboard/src/i18n/locales/en.po",
);
const TK_PO_PATH = path.join(
  PROJECT_ROOT,
  "src/plugins/search-meili/dashboard/i18n/tk.po",
);

// ─── Curated Turkmen UI dictionary ──────────────────────────────────────────
// Add carefully — wrong translations are worse than the English source.
// The script ONLY uses an entry when the exact msgid matches (case-sensitive).
const DICTIONARY = {
  // Core verbs
  "Save": "Ýatda sakla",
  "Cancel": "Goý",
  "Delete": "Aýyr",
  "Remove": "Aýyr",
  "Edit": "Üýtget",
  "Create": "Döret",
  "Add": "Goş",
  "Update": "Täzele",
  "Refresh": "Täzele",
  "Close": "Ýap",
  "Open": "Aç",
  "Search": "Gözle",
  "Filter": "Filtr",
  "Sort": "Tertiple",
  "Export": "Eksport",
  "Import": "Import",
  "Upload": "Ýükle",
  "Download": "Ýükläp al",
  "Submit": "Iber",
  "Confirm": "Tassykla",
  "Apply": "Ulanmak",
  "Reset": "Sürçi",
  "Clear": "Arassala",
  "Copy": "Göçür",
  "Print": "Çap et",
  "Back": "Yza",
  "Next": "Indiki",
  "Previous": "Öňki",
  "Continue": "Dowam et",
  "Finish": "Tamamla",
  "Done": "Boldy",
  "View": "Gör",
  "Preview": "Öňünden gör",
  "Hide": "Gizle",
  "Show": "Görkez",
  "Enable": "Işjeňleşdir",
  "Disable": "Bes et",
  "Activate": "Işjeňleşdir",
  "Deactivate": "Bes et",
  "Publish": "Çap et",
  "Unpublish": "Çapdan al",
  "Archive": "Arhiwle",
  "Restore": "Dikelt",
  "Approve": "Tassykla",
  "Reject": "Ret et",
  "Assign": "Belle",
  "Login": "Giriş",
  "Log in": "Giriş",
  "Logout": "Çykyş",
  "Log out": "Çykyş",
  "Sign in": "Giriş",
  "Sign out": "Çykyş",

  // Common nouns
  "Name": "Ady",
  "Description": "Beýan",
  "Code": "Kody",
  "Slug": "Salgy",
  "Title": "Adyň",
  "Type": "Görnüşi",
  "Status": "Ýagdaýy",
  "State": "Ýagdaýy",
  "Date": "Sene",
  "Time": "Wagt",
  "Email": "Email",
  "Phone": "Telefon",
  "Address": "Salgy",
  "City": "Şäher",
  "Country": "Ýurt",
  "Region": "Sebit",
  "Province": "Welaýat",
  "Language": "Dil",
  "Currency": "Walýuta",
  "Channel": "Kanal",
  "Channels": "Kanallar",
  "Role": "Rol",
  "Roles": "Rollar",
  "Permission": "Rugsat",
  "Permissions": "Rugsatlar",
  "User": "Ulanyjy",
  "Users": "Ulanyjylar",
  "Username": "Ulanyjy ady",
  "Password": "Parol",
  "Settings": "Sazlamalar",
  "Configuration": "Düzgün",
  "Notification": "Habarnama",
  "Notifications": "Habarnamalar",
  "Error": "Säwlik",
  "Warning": "Duýduryş",
  "Info": "Maglumat",
  "Success": "Üstünlikli",
  "Loading": "Ýüklenýär",
  "Loading...": "Ýüklenýär…",
  "Image": "Surat",
  "Images": "Suratlar",
  "Asset": "Faýl",
  "Assets": "Faýllar",
  "File": "Faýl",
  "Files": "Faýllar",
  "Tag": "Bellik",
  "Tags": "Bellikler",
  "Label": "Bellik",
  "Labels": "Bellikler",
  "Note": "Bellik",
  "Notes": "Bellikler",
  "Comment": "Düşündiriş",
  "Comments": "Düşündirişler",

  // Catalog
  "Catalog": "Katalog",
  "Product": "Haryt",
  "Products": "Harytlar",
  "Variant": "Wariant",
  "Variants": "Wariantlar",
  "Collection": "Toplum",
  "Collections": "Toplumlar",
  "Category": "Kategoriýa",
  "Categories": "Kategoriýalar",
  "Brand": "Marka",
  "Brands": "Markalar",
  "Facet": "Faset",
  "Facets": "Fasetler",
  "Facet value": "Faset gymmaty",
  "Facet values": "Faset gymmatlary",
  "Option": "Wariant",
  "Options": "Wariantlar",
  "SKU": "SKU",
  "Stock": "Gor",
  "Stock level": "Gor derejesi",
  "Stock on hand": "Gory",
  "In stock": "Gory bar",
  "Out of stock": "Gory ýok",
  "Inventory": "Inwentar",
  "Quantity": "Mukdar",
  "Price": "Baha",
  "Cost": "Çykdajy",
  "Tax": "Salgyt",
  "Tax rate": "Salgyt nyrhy",
  "Tax category": "Salgyt kategoriýasy",

  // Orders
  "Order": "Sargyt",
  "Orders": "Sargytlar",
  "Order code": "Sargyt kody",
  "Order list": "Sargytlar sanawy",
  "Order details": "Sargyt jikme-jiklikleri",
  "Order state": "Sargyt ýagdaýy",
  "Order total": "Sargyt jemi",
  "Total": "Jemi",
  "Subtotal": "Aralyk jem",
  "Shipping": "Eltip bermek",
  "Shipping method": "Eltip bermek usuly",
  "Shipping methods": "Eltip bermek usullary",
  "Fulfillment": "Ýerine ýetiriş",
  "Fulfillments": "Ýerine ýetirişler",
  "Payment": "Tölegi",
  "Payments": "Töleglar",
  "Payment method": "Töleg usuly",
  "Payment methods": "Töleg usullary",
  "Refund": "Yzyna gaýtarmak",
  "Refunds": "Yzyna gaýtarmaklar",
  "Discount": "Arzanladyş",
  "Discounts": "Arzanladyşlar",
  "Promotion": "Aksiýa",
  "Promotions": "Aksiýalar",
  "Coupon": "Kupon",
  "Coupons": "Kuponlar",
  "Cart": "Sebet",
  "Checkout": "Töleg",

  // Customer
  "Customer": "Müşderi",
  "Customers": "Müşderiler",
  "Customer group": "Müşderi topary",
  "Customer groups": "Müşderi toparlary",
  "First name": "Ady",
  "Last name": "Familiýasy",
  "Email address": "Email salgysy",
  "Phone number": "Telefon belgisi",

  // Common UI words
  "Yes": "Hawa",
  "No": "Ýok",
  "OK": "Bolýar",
  "All": "Hemmesi",
  "None": "Ýok",
  "Default": "Esasy",
  "Optional": "Saýlama",
  "Required": "Hökmany",
  "Public": "Açyk",
  "Private": "Ýapyk",
  "Active": "Işjeň",
  "Inactive": "Işjeň däl",
  "Enabled": "Işjeňleşdirildi",
  "Disabled": "Bes edildi",
  "Visible": "Görünýär",
  "Hidden": "Gizlendi",
  "Draft": "Çernowik",
  "Published": "Çap edildi",
  "Archived": "Arhiwlendi",
  "Pending": "Garaşylýar",
  "Completed": "Tamamlandy",
  "Cancelled": "Goýuldy",
  "Failed": "Şowsuz",
  "In progress": "Dowam edýär",
  "Not set": "Düzülmedi",
  "No results": "Netije ýok",
  "No data": "Maglumat ýok",
  "Select...": "Saýla…",
  "Select an option": "Wariant saýla",
  "Search...": "Gözle…",

  // Auth
  "Forgot password?": "Paroly ýatdan çykardyňyzmy?",
  "Remember me": "Meni ýatda sakla",
  "Reset password": "Paroly täzele",
  "Change password": "Paroly üýtget",
  "Current password": "Häzirki parol",
  "New password": "Täze parol",
  "Confirm password": "Paroly tassykla",

  // Dates / time
  "Today": "Şu gün",
  "Yesterday": "Düýn",
  "Tomorrow": "Ertir",
  "Last week": "Geçen hepde",
  "Last month": "Geçen aý",
  "This week": "Şu hepde",
  "This month": "Şu aý",
  "This year": "Şu ýyl",
  "Created at": "Döredildi",
  "Updated at": "Täzelendi",
  "Last updated": "Soňky täzeleniş",

  // Misc
  "Dashboard": "Dolandyryş paneli",
  "Overview": "Umumy syn",
  "Statistics": "Statistika",
  "Reports": "Hasabatlar",
  "Help": "Kömek",
  "Documentation": "Dokumentasiýa",
  "About": "Hakda",
  "Version": "Wersiýa",
  "Profile": "Profil",
  "Account": "Hasap",
};

// ─── PO parser ──────────────────────────────────────────────────────────────

function decodePoString(input) {
  // Single-pass: walk the string, expand \n \t \" \\ in one go to avoid
  // any escape-ordering issues that bite multi-replace approaches.
  let out = "";
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (ch !== "\\" || i + 1 >= input.length) {
      out += ch;
      continue;
    }
    const next = input[++i];
    if (next === "n") out += "\n";
    else if (next === "t") out += "\t";
    else if (next === "r") out += "\r";
    else out += next; // covers \\ \"  and any other one-char escape
  }
  return out;
}

function encodePoString(s) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "\\") out += "\\\\";
    else if (ch === '"') out += '\\"';
    else if (ch === "\n") out += "\\n";
    else if (ch === "\t") out += "\\t";
    else if (ch === "\r") out += "\\r";
    else out += ch;
  }
  return out;
}

function parsePo(text) {
  const lines = text.split(/\r?\n/);
  const entries = [];
  let header = null;
  let current = null;
  let mode = null;

  const flush = () => {
    if (!current) return;
    if (current.msgid === "" && header == null) {
      header = current;
    } else {
      entries.push(current);
    }
    current = null;
    mode = null;
  };

  const startEntry = () => {
    current = { comments: [], msgid: "", msgstr: "" };
  };

  for (const line of lines) {
    if (line.trim() === "") {
      flush();
      continue;
    }
    if (line.startsWith("#")) {
      if (!current) startEntry();
      current.comments.push(line);
      continue;
    }
    const msgidMatch = line.match(/^msgid\s+"(.*)"\s*$/);
    if (msgidMatch) {
      if (!current) startEntry();
      current.msgid = decodePoString(msgidMatch[1]);
      mode = "msgid";
      continue;
    }
    const msgstrMatch = line.match(/^msgstr\s+"(.*)"\s*$/);
    if (msgstrMatch) {
      if (!current) startEntry();
      current.msgstr = decodePoString(msgstrMatch[1]);
      mode = "msgstr";
      continue;
    }
    const contMatch = line.match(/^"(.*)"\s*$/);
    if (contMatch && current && mode) {
      current[mode] += decodePoString(contMatch[1]);
      continue;
    }
    if (!current) startEntry();
    current.comments.push(line);
  }
  flush();
  return { header, entries };
}

function emitEntry(entry) {
  const out = [];
  if (entry.comments.length) out.push(...entry.comments);
  out.push(`msgid "${encodePoString(entry.msgid)}"`);
  out.push(`msgstr "${encodePoString(entry.msgstr)}"`);
  return out.join("\n");
}

function emitPo({ header, entries }) {
  const parts = [];
  if (header) parts.push(emitEntry(header));
  for (const e of entries) parts.push(emitEntry(e));
  return parts.join("\n\n") + "\n";
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(EN_PO_PATH)) {
    console.error(`[sync-tk-po] en.po not found at ${EN_PO_PATH}`);
    console.error("  Run `npm install` first so @vendure/dashboard is on disk.");
    process.exit(1);
  }
  const enPo = parsePo(fs.readFileSync(EN_PO_PATH, "utf8"));

  const existing = new Map();
  if (fs.existsSync(TK_PO_PATH)) {
    const tkPo = parsePo(fs.readFileSync(TK_PO_PATH, "utf8"));
    for (const e of tkPo.entries) {
      if (e.msgstr) existing.set(e.msgid, e.msgstr);
    }
  }

  let preserved = 0;
  let fromDict = 0;
  let blank = 0;

  const seenIds = new Set();
  const tkEntries = enPo.entries.map((e) => {
    seenIds.add(e.msgid);
    const prior = existing.get(e.msgid);
    if (prior) {
      preserved++;
      return { comments: [], msgid: e.msgid, msgstr: prior };
    }
    if (Object.prototype.hasOwnProperty.call(DICTIONARY, e.msgid)) {
      fromDict++;
      return { comments: [], msgid: e.msgid, msgstr: DICTIONARY[e.msgid] };
    }
    blank++;
    return { comments: [], msgid: e.msgid, msgstr: "" };
  });

  // Append any extra translations that exist in our tk.po but NOT in
  // Vendure's en.po (typically strings from our own custom plugin code).
  // We never drop translator work, even if the source has moved.
  let extras = 0;
  for (const [msgid, msgstr] of existing) {
    if (seenIds.has(msgid)) continue;
    tkEntries.push({
      comments: ["# Plugin-only msgid — not present in Vendure core en.po"],
      msgid,
      msgstr,
    });
    preserved++;
    extras++;
  }

  const header = {
    comments: [
      "# Turkmen (tk) translation catalog for the Vendure Admin Dashboard.",
      "#",
      "# Regenerated by `node scripts/translate/sync-tk-po.js`. Empty msgstr",
      "# entries intentionally fall back to the English source via Lingui.",
      "# Translators: edit msgstr values in place — the script preserves",
      "# every non-empty translation on the next run.",
    ],
    msgid: "",
    msgstr: [
      "",
      "POT-Creation-Date: 2026-05-24 00:00+0000",
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: 8bit",
      "X-Generator: scripts/translate/sync-tk-po.js",
      "Language: tk",
      "Plural-Forms: nplurals=2; plural=(n != 1);",
    ].join("\n"),
  };

  const output = emitPo({ header, entries: tkEntries });
  fs.mkdirSync(path.dirname(TK_PO_PATH), { recursive: true });
  fs.writeFileSync(TK_PO_PATH, output, "utf8");

  console.log(`[sync-tk-po] Wrote ${TK_PO_PATH}`);
  console.log(`  Total msgids:      ${enPo.entries.length}`);
  console.log(`  Preserved (kept):  ${preserved} (incl. ${extras} plugin-only)`);
  console.log(`  From dictionary:   ${fromDict}`);
  console.log(`  Blank (fallback):  ${blank}`);
  console.log(
    `  Coverage:          ${(((preserved - extras + fromDict) / enPo.entries.length) * 100).toFixed(1)}% of Vendure core`,
  );
}

main();
