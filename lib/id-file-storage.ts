import { BlobNotFoundError, del } from "@vercel/blob";

/** Removes a stored ID file. The pathname or URL is not document contents. */
export async function deleteStoredIdFile(stored: string): Promise<void> {
  try {
    await del(stored);
  } catch (err) {
    if (err instanceof BlobNotFoundError) return;
    throw err;
  }
}
