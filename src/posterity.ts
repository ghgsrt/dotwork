//   function useAnimation<P extends any>(
//     args: P[],
//     ...callbacks: [
//       (i: number, ...args: P[]) => void,
//       (i: number, ...args: P[]) => boolean,
//       number,
//     ][]
//   ) {
//     const registry = Array.from({ length: callbacks.length }, () => [0, 0]);

//     let rafId: number;
//     const step = (elapsed: number) => {
//       for (let c = 0; c < callbacks.length; c++) {
//         if (elapsed - registry[c][1] > callbacks[c][2]) {
//           const [_step, condition] = callbacks[c];

//           if (condition(registry[c][0], ...args))
//             _step(registry[c][0], ...args);
//           else callbacks.splice(c, 1);

//           registry[c][0]++;
//           registry[c][1] = elapsed;
//         }
//       }

//       if (callbacks.length !== 0) rafId = requestAnimationFrame(step);
//     };

//     return [
//       () => (rafId = requestAnimationFrame(step)),
//       () => cancelAnimationFrame(rafId),
//     ];
//   }

//   const heading = document.querySelector(".heading")!;
//   const heroImage = document.getElementById("HERO_IMAGE")! as HTMLImageElement;
//   const canvas = document.createElement("canvas")!;
//   canvas.style.position = "absolute";
//   canvas.style.top = "0";
//   canvas.style.left = "0";
//   const ctx = canvas.getContext("2d")!;

//   function setupCanvas() {
//     canvas.width = heroImage.width;
//     canvas.height = heroImage.height;

//     ctx.drawImage(heroImage, 0, 0, heroImage.width, heroImage.height);
//     const data = ctx.getImageData(0, 0, heroImage.width, heroImage.height).data;

//     const path: [number, number][][] = []; //Array.from({ length: data.length }, () => 0);
//     // for (let i = 0; i < data.length; i += 4) {
//     //   if (data[i + 3] === 0) continue;
//     //   const idx = i / 4
//     //   path.push([idx % heroImage.width, (idx / heroImage.height)]);
//     // }
//     const shapeSize = 1;
//     const shapeSpacing = 2;
//     const depth = Math.floor((canvas.width + canvas.height - 2) / shapeSize);

//     const queuePad = 3;
//     const maxAvailQueues = 10;

//     let queue: [number, number][][] = Array.from(
//       { length: queuePad + 1 },
//       () => [],
//     );
//     // for (let i = 0; i < data.length; i += 4) {
//     //   const _path: [number, number][] = [];

//     //   if (i > queuePad) {
//     //     const availQueues = Math.max(
//     //       Math.min(maxAvailQueues, i, depth - i - queuePad),
//     //       0,
//     //     );

//     //     const temp = queue.flat();
//     //     shuffleArray(temp);
//     //     queue = chunkArray(temp, temp.length / availQueues);
//     //     shuffleArray(queue);

//     //     if (queue.length > availQueues) _path.push(...queue.pop()!);
//     //     else {
//     //       if (queue.length < availQueues) queue.unshift([]);

//     //       if (queue.length > 0) {
//     //         const queueIdx = Math.floor(Math.random() * queue.length);
//     //         _path.push(...queue[queueIdx]);
//     //         queue[queueIdx] = [];
//     //       }
//     //     }
//     //   }

//     //   //   for (let x = Math.min(i, canvas.width - 1); x >= 0; x -= 1) {
//     //   // const y = i - x;
//     //   // if (y < canvas.height && y >= 0) {
//     //   //   const offset = (y * canvas.width + x) * 4;
//     //   for (let j = 0; j < data.length / 1000; j++, i += 4) {
//     //     if (data[i + 3] === 0) continue;
//     //     const beans: [number, number] = [i % canvas.width, i / canvas.width];
//     //     if (
//     //       queue.length > 0 &&
//     //       i > queuePad &&
//     //       i < depth - queuePad &&
//     //       Math.random() > 0.1
//     //     ) {
//     //       queue[Math.floor(Math.random() * queue.length)].push(beans);
//     //     } else _path.push(beans);
//     //     // } else if (y >= canvas.height) break;
//     //   }
//     //   //   }

//     //   if (_path.length === 0) continue;

//     //   shuffleArray(_path);
//     //   let chunks = chunkArray(_path, _path.length / 10);
//     //   shuffleArray(chunks);
//     //   chunks = chunkArray(chunks.flat(), _path.length / 0.01);
//     //   shuffleArray(chunks);
//     //   const moreChunks = chunkArray(chunks, chunks.length / 2);
//     //   shuffleArray(moreChunks);
//     //   chunks = moreChunks.flat();
//     //   for (const chunk of chunks) path.push(chunk);
//     // }
//     // for (let i = 0; i < depth; i += 2) {
//     //   const _path: [number, number][] = [];

//     //   if (i > queuePad) {
//     //     const availQueues = Math.max(
//     //       Math.min(maxAvailQueues, i, depth - i - queuePad),
//     //       0,
//     //     );

//     //     const temp = queue.flat();
//     //     shuffleArray(temp);
//     //     queue = chunkArray(temp, temp.length / availQueues);
//     //     shuffleArray(queue);

//     //     if (queue.length > availQueues) _path.push(...queue.pop()!);
//     //     else {
//     //       if (queue.length < availQueues) queue.unshift([]);

//     //       if (queue.length > 0) {
//     //         const queueIdx = Math.floor(Math.random() * queue.length);
//     //         _path.push(...queue[queueIdx]);
//     //         queue[queueIdx] = [];
//     //       }
//     //     }
//     //   }

//     //   for (let x = Math.min(i, canvas.width - 1); x >= 0; x -= 1) {
//     //     const y = i - x;
//     //     if (y < canvas.height && y >= 0) {
//     //       const offset = (y * canvas.width + x) * 4;

//     //       if (data[offset + 3] === 0) continue;

//     //       if (
//     //         queue.length > 0 &&
//     //         i > queuePad &&
//     //         i < depth - queuePad &&
//     //         Math.random() > 0.1
//     //       ) {
//     //         queue[Math.floor(Math.random() * queue.length)].push([x, y]);
//     //       } else _path.push([x, y]);
//     //     } else if (y >= canvas.height) break;
//     //   }

//     //   if (_path.length === 0) continue;

//     //   shuffleArray(_path);
//     //   let chunks = chunkArray(_path, _path.length / 10);
//     //   shuffleArray(chunks);
//     //   chunks = chunkArray(chunks.flat(), _path.length / 0.01);
//     //   console.log(chunks.length, chunks[0].length);
//     //   shuffleArray(chunks);
//     //   const moreChunks = chunkArray(chunks, chunks.length / 2);
//     //   shuffleArray(moreChunks);
//     //   chunks = moreChunks.flat();
//     //   for (const chunk of chunks) path.push(chunk);
//     // }
//     for (let i = 0; i < depth; i += 2) {
//       const _path: [number, number][] = [];

//       if (i > queuePad) {
//         const availQueues = Math.max(
//           Math.min(maxAvailQueues, i, depth - i - queuePad),
//           0,
//         );

//         const temp = queue.flat();
//         shuffleArray(temp);
//         queue = chunkArray(temp, temp.length / availQueues);
//         shuffleArray(queue);

//         if (queue.length > availQueues) _path.push(...queue.pop()!);
//         else {
//           if (queue.length < availQueues) queue.unshift([]);

//           if (queue.length > 0) {
//             const queueIdx = Math.floor(Math.random() * queue.length);
//             _path.push(...queue[queueIdx]);
//             queue[queueIdx] = [];
//           }
//         }
//       }

//       for (let x = Math.min(i, canvas.width - 1); x >= 0; x -= 2) {
//         const y = i - x;
//         if (y < canvas.height && y >= 0) {
//           const offset = (y * canvas.width + x) * 4;

//           if (data[offset + 3] === 0) continue;

//           if (
//             queue.length > 0 &&
//             i > queuePad &&
//             i < depth - queuePad &&
//             Math.random() > 0.1
//           ) {
//             queue[Math.floor(Math.random() * queue.length)].push([x, y]);
//           } else _path.push([x, y]);
//         } else if (y >= canvas.height) break;
//       }

//       if (_path.length === 0) continue;

//       shuffleArray(_path);
//       let chunks = chunkArray(_path, _path.length / 10);
//       shuffleArray(chunks);
//       chunks = chunkArray(chunks.flat(), _path.length / 0.01);
//       shuffleArray(chunks);
//       const moreChunks = chunkArray(chunks, chunks.length / 2);
//       shuffleArray(moreChunks);
//       chunks = moreChunks.flat();
//       for (const chunk of chunks) path.push(chunk);
//     }

//     ctx.clearRect(0, 0, heroImage.width, heroImage.height);
//     const [play, pause] = useAnimation<[number, number][][]>(
//       [path],
//       [
//         (i, path) => {
//           for (const [x, y] of path[i]) ctx.fillRect(x, y, 1, 1);
//         },
//         (i: number) => i < path.length,
//         1,
//       ],
//     );

//     console.log("hmm");
//     heading.appendChild(canvas);

//     ctx.fillStyle = "black";

//     play();
//   }

//   if (heroImage.complete) setupCanvas();
//   else heroImage.addEventListener("load", setupCanvas);
