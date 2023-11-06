import { readFile, unlink, access, stat } from "fs/promises";
import path from "path";
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

export const getVideoFileInfo = async (filename: string) => {
  const filepath = `files/video/${filename}`;
  const exists = await checkFileExists(filepath);
  if (exists) {
    const extension = path.extname(filepath);
    const stats = await stat(filepath);
    return { stats, extension, filepath };
  } else {
    throw new FileNotExistsError("File does not exist");
  }
};
