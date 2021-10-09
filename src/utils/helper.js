/**
 * Generates uniq id.
 * @returns {string} - Genrated id.
 */
export function generateRandomId() {
  return Math.random().toString(36).substr(2, 9) + Date.now();
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
