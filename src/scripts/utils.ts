export function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const random = (min: number, max: number) =>
  Math.random() * (max - min) + min;
export const randomInt = (min: number, max: number) =>
  Math.floor(random(min, max));

export function chunkArray<T>(array: T[], chunkSize: number) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArr.push(array.slice(i, i + chunkSize));
  }
  return chunkedArr;
}
