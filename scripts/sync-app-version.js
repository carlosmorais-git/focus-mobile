/**
 * Sincroniza a versão do package.json com o app.json do Expo.
 *
 * Roda automaticamente pelo hook "version" do npm, entre o bump da versão
 * e o commit — então o app.json entra no mesmo commit e na mesma tag.
 *
 * O que faz:
 *   expo.version              <- versão do package.json (ex: "1.2.0")
 *   expo.android.versionCode  <- inteiro, +1 a cada release (exigência da Play Store)
 *   expo.ios.buildNumber      <- string, espelha a versão
 */

const fs = require("fs");
const path = require("path");

const raiz = path.resolve(__dirname, "..");
const caminhoPackage = path.join(raiz, "package.json");
const caminhoApp = path.join(raiz, "app.json");

const { version } = JSON.parse(fs.readFileSync(caminhoPackage, "utf8"));

if (!/^\d+\.\d+\.\d+/.test(version)) {
  console.error(`✗ Versão inválida no package.json: "${version}"`);
  process.exit(1);
}

const app = JSON.parse(fs.readFileSync(caminhoApp, "utf8"));

const versaoAnterior = app.expo.version;
const codeAnterior = app.expo.android?.versionCode ?? 0;

app.expo.version = version;

app.expo.android = { ...app.expo.android, versionCode: codeAnterior + 1 };
app.expo.ios = { ...app.expo.ios, buildNumber: version };

fs.writeFileSync(caminhoApp, JSON.stringify(app, null, 2) + "\n", "utf8");

console.log(`✓ app.json sincronizado`);
console.log(`  version      ${versaoAnterior} -> ${version}`);
console.log(`  versionCode  ${codeAnterior} -> ${codeAnterior + 1}`);
console.log(`  buildNumber  ${version}`);
