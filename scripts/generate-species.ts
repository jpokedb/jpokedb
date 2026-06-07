import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const CSV_PATH = join(process.cwd(), "src", "csv", "Species (0001-1025).csv");
const OUTPUT_DIR = join(process.cwd(), "data");
const OUTPUT_PATH = join(OUTPUT_DIR, "species.json");

interface Species {
  legendary: boolean;
  baby: boolean;
  mythical: boolean;
  name: string;
  name_ja: string;
  num: number;
  gen: number;
  primary_type: string;
  secondary_type: string | null;
}

const raw = readFileSync(CSV_PATH, "utf-8");
const lines = raw.split(/\r?\n/).filter((line) => line.trim() !== "");
const [, ...rows] = lines;

const species: Species[] = rows.map((line) => {
  const [
    legendary,
    baby,
    mythical,
    name,
    name_ja,
    num,
    gen,
    primary_type,
    secondary_type,
  ] = line.split(",");

  return {
    legendary: legendary === "true",
    baby: baby === "true",
    mythical: mythical === "true",
    name,
    name_ja,
    num: Number(num),
    gen: Number(gen),
    primary_type,
    secondary_type: secondary_type === "—" ? null : secondary_type,
  };
});

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_PATH, JSON.stringify(species, null, 2) + "\n", "utf-8");

console.log(`Wrote ${species.length} species to ${OUTPUT_PATH}`);
