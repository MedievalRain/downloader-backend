import { readFile } from "fs/promises";

export const readJsonFile = async (filePath: string): Promise<any> => {
  try {
    const data = await readFile(filePath, { encoding: "utf8" });
    const object = JSON.parse(data);
    return object;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    throw error;
  }
};
