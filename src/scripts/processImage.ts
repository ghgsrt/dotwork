export function processImage(url: string) {
  const image = new Image();
  image.src = url;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = image.width;
  canvas.height = image.height;

  ctx?.drawImage(image, 0, 0);

  const data = ctx?.getImageData(0, 0, image.width, image.height);

  console.log(data);
}

processImage("mount-1-clean.jpg");
