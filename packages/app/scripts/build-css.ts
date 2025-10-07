import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { material, app, ant } from "../src/theme";

const outDir = resolve(process.cwd(), "dist");
mkdirSync(outDir, { recursive: true });

writeFileSync(resolve(outDir, 'pkv.app.css'), app.toString({ minify: false }), 'utf8');
writeFileSync(resolve(outDir, 'pkv.app.min.css'), app.toString({ minify: true }), 'utf8');
writeFileSync(resolve(outDir, "pkv.material.css"), material.toString({ minify: false }), "utf8");
writeFileSync(resolve(outDir, "pkv.material.min.css"), material.toString({ minify: true }), "utf8");
writeFileSync(resolve(outDir, 'pkv.ant.css'), ant.toString({ minify: false }), 'utf8');
writeFileSync(resolve(outDir, 'pkv.ant.min.css'), ant.toString({ minify: true }), 'utf8');