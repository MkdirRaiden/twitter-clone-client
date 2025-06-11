// copy404.js
import fs from "fs";
fs.copyFileSync("dist/index.html", "dist/404.html");
console.log(" Copied index.html to 404.html for GitHub Pages fallback");
