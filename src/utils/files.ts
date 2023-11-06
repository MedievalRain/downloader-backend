import { readFile, unlink } from "fs/promises";

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

export const deleteFile = async (filePath: string) => {
  try {
    return unlink(filePath);
  } catch (error) {
    console.error("Error deleting JSON file:", error);
    throw error;
  }
};
