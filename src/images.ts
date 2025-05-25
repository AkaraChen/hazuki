const imports = import.meta.glob('/content/*.{jpg,jpeg}')
export const images: string[] = []

for (const [key, value] of Object.entries(imports)) {
  images.push(await value().then((v) => (v as { default: string }).default))
}
