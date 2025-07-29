export function getImageBlobURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], {
        type: file.type,
      })
      const url = URL.createObjectURL(blob)
      resolve(url)
    }

    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
