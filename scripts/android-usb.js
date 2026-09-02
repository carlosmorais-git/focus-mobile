/**
 * Sobe o app num Android conectado por cabo USB, sem depender de Wi-Fi.
 *
 * Passos:
 *   1. adb wait-for-device            espera o celular aparecer e ser autorizado
 *   2. adb reverse tcp:8081 tcp:8081  o localhost:8081 do celular vira o do PC
 *   3. expo start --android --localhost
 *
 * Por que este script existe em vez de um "&&" no package.json:
 *
 * Com --localhost o Node resolve "localhost" e, a partir do Node 17, respeita a
 * ordem devolvida pelo DNS — no Windows isso quase sempre é ::1 (IPv6) primeiro.
 * O Metro então escuta SÓ em [::1]:8081. Mas o "adb reverse" encaminha para o
 * 127.0.0.1 (IPv4) do PC, onde não tem ninguém escutando: o celular mostra
 * "java.io.IOException: failed" ao tentar baixar o bundle.
 *
 * NODE_OPTIONS=--dns-result-order=ipv4first força o bind em 127.0.0.1, que é
 * exatamente para onde o túnel aponta. Setar variável de ambiente inline não
 * funciona no cmd.exe do Windows, daí o wrapper em Node.
 */

const { spawnSync } = require("child_process");

const PORTA = process.env.RCT_METRO_PORT || "8081";

function executar(comando, argumentos, opcoes = {}) {
  const resultado = spawnSync(comando, argumentos, {
    stdio: "inherit",
    shell: process.platform === "win32",
    ...opcoes,
  });

  if (resultado.error) {
    if (resultado.error.code === "ENOENT") {
      console.error(`✗ "${comando}" não encontrado no PATH.`);
      if (comando === "adb") {
        console.error("  Instale o Android SDK Platform Tools e adicione ao PATH.");
      }
    } else {
      console.error(`✗ Falha ao executar ${comando}: ${resultado.error.message}`);
    }
    process.exit(1);
  }

  if (resultado.status !== 0) {
    console.error(`✗ ${comando} ${argumentos.join(" ")} saiu com código ${resultado.status}`);
    process.exit(resultado.status ?? 1);
  }

  return resultado;
}

console.log("→ Esperando dispositivo Android (Ctrl+C para cancelar)...");
executar("adb", ["wait-for-device"]);

console.log(`→ Criando túnel: adb reverse tcp:${PORTA} tcp:${PORTA}`);
executar("adb", ["reverse", `tcp:${PORTA}`, `tcp:${PORTA}`]);

console.log("→ Iniciando o Metro em 127.0.0.1 (IPv4)\n");
executar("npx", ["expo", "start", "--android", "--localhost", "--port", PORTA], {
  env: {
    ...process.env,
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--dns-result-order=ipv4first"]
      .filter(Boolean)
      .join(" "),
  },
});
