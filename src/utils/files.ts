import { readFile, unlink, access, stat } from "fs/promises";
import { FileNotExistsError } from "../types/errors";

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

export const checkFileExists = async (filepath: string) => {
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
};

export const getFileSize = async (filepath: string) => {
  const exists = await checkFileExists(filepath);
  if (exists) {
    return stat(filepath);
  } else {
    throw new FileNotExistsError("File does not exist");
  }
};
