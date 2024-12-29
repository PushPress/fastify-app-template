import fs from "fs";
import Repl from "repl";

export function repl(service: string, server: unknown) {
  const replHistoryFile = ".repl_history";
  const repl = Repl.start({
    prompt: `${service}> `,
  });

  repl.context.server = server;

  if (!fs.existsSync(replHistoryFile)) {
    fs.writeFileSync(replHistoryFile, "");
  }
  repl.setupHistory(replHistoryFile, (err, repl) => {
    // write the evaluated command to the history file
    repl.on("line", (cmd) => {
      fs.appendFileSync(replHistoryFile, `${cmd}\n`);
    });
    if (err) {
      console.error(err);
    }
  });
}
