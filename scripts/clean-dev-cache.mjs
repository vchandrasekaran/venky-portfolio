import fs from "fs";
import path from "path";

const targets = [".next", ".next-cache"];
const cwd = process.cwd();

for (const dir of targets) {
  const full = path.join(cwd, dir);
  try {
    if (fs.existsSync(full)) {
      fs.rmSync(full, { recursive: true, force: true });
      console.log(`[clean] Removed ${dir}`);
    }
  } catch (err) {
    console.error(`[clean] Failed to remove ${dir}:`, err);
  }
}
