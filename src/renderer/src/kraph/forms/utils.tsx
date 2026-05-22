// 2. Transformation utility
export const keyify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const ageNameify = (text) => {
  return (text || "")
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toUpperCase();
};

export const validateAgeName = (value) => {
  if (!value || value.length < 4) {
    return "Must be at least 4 characters long";
  }

  if (!/^[A-Z_][A-Z0-9_]*$/.test(value)) {
    return "Must be AGE-name compatible: upper case letters, numbers, and underscores only";
  }

  return undefined;
};
