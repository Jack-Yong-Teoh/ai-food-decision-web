export async function convertToFormData(
  original: FormData
): Promise<FormData> {
  const newFormData = new FormData();

  for (const [key, value] of original.entries()) {
    if (value instanceof File) {
      const blob = new Blob([await value.arrayBuffer()], { type: value.type });
      newFormData.append(key, blob, value.name);
    } else {
      newFormData.append(key, value);
    }
  }

  return newFormData;
}
