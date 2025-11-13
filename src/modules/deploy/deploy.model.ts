import fs from "fs/promises";
import path from "path";

export class DeployModel {
  static async createTempSite(uid: string, html: string): Promise<string> {
    const tempDir = path.resolve("/tmp", `site-${uid}`);
    const filePath = path.join(tempDir, "index.html");

    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(filePath, html, "utf8");

    return tempDir;
  }

  static async cleanTempSite(uid: string): Promise<void> {
    const tempDir = path.resolve("/tmp", `site-${uid}`);
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}