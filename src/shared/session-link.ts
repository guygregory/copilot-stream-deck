import { execFile } from "node:child_process";
import { promisify } from "node:util";

export function validateSessionLink(value: unknown, id: string): string {
  if (typeof value !== "string" || !/^[a-zA-Z0-9-]{1,100}$/.test(id) ||
      value !== `ghapp://sessions/${id}`) throw new Error("Invalid Copilot session link");
  return value;
}

export async function openSessionLink(url: string, platform: NodeJS.Platform = process.platform): Promise<void> {
  const run = promisify(execFile);
  if (platform === "win32") {
    await run("rundll32.exe", ["url.dll,FileProtocolHandler", url], { timeout: 10000, windowsHide: true });
  } else if (platform === "darwin") {
    await run("/usr/bin/open", [url], { timeout: 10000 });
  } else {
    throw new Error("Opening Copilot session links requires Windows or macOS");
  }
}
