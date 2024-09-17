const adminSelect = document.getElementById("admin-hero-image");
const HERO_IMAGE_VALUE = adminSelect.dataset.heroImage.split("/").pop();

async function initHeroSelect() {
  const nullOption = document.createElement("option");
  nullOption.value = undefined;
  nullOption.innerText = "-- No Image --";
  adminSelect.appendChild(nullOption);

  adminSelect.addEventListener("change", () => {
    if (adminSelect.selectedIndex === 0) {
    }
  });

  const fethcer = await fetch("/admin/api/bucket-keys");
  const bucketKeys = await fethcer.json();
  for (const key of bucketKeys) {
    const option = document.createElement("option");
    option.value = `${adminSelect.dataset.url}${key}`;
    option.innerText = key;
    option.selected = key === HERO_IMAGE_VALUE;
    adminSelect.appendChild(option);
  }
}
initHeroSelect();

const adminCMSForm = document.getElementById("admin-form-cms");
const adminCMSSubmit = document.getElementById("admin-form-cms-submit");
adminCMSSubmit.onclick = (event) => {
  const body = {};
  const formData = new FormData(adminCMSForm);

  for (const [key, value] of formData) {
    body[key] = value;
  }

  fetch("admin/api/cms", {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

const adminCMSInputs = adminCMSForm.querySelectorAll("input");
for (const input of adminCMSInputs) {
  input.oninput = (event) => {
    console.log(input.name);
    const target = document.getElementById(input.name);
    target.innerHTML = input.value;
  };
}

const main = document.querySelector("main");
const spacer = main.querySelector(":scope > .spacer");
const HERO_IMAGE = document.getElementById("HERO_IMAGE");
const HEADER = document.getElementById("HEADER");
const heading = document.querySelector(".heading");
const absoluteWrapper = heading.querySelector(":scope > div");
let DESCRIPTION = document.getElementById("DESCRIPTION");
adminSelect.onchange = () => {
  HERO_IMAGE.src = adminSelect.value;

  // no image
  if (adminSelect.selectedIndex === 0) {
    HERO_IMAGE.style.display = "none";
    HEADER.classList.add("very-solid");
    heading.style.marginTop = "1.1rem";
    const temp = DESCRIPTION.cloneNode(true);
    DESCRIPTION.remove();
    DESCRIPTION = temp;
    spacer.insertBefore(DESCRIPTION, spacer.children[1]);
    spacer.classList.remove("hide");
  } else {
    HERO_IMAGE.style.display = "block";
    HEADER.classList.remove("very-solid");
    heading.style.marginTop = "0";
    DESCRIPTION.classList.add("hide");
    const temp = DESCRIPTION.cloneNode(true);
    DESCRIPTION.remove();
    DESCRIPTION = temp;
    absoluteWrapper.appendChild(DESCRIPTION);
    spacer.classList.add("hide");
  }
};

const isBlackEnough = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b < 156;

async function processImage(imageFile) {
  console.log(imageFile.type);
  const bitmap = await createImageBitmap(imageFile);

  let { width, height } = bitmap;

  const scale = 800 / width;
  width = width * scale;
  height = height * scale;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(bitmap, 0, 0, width, height);

  const data = ctx?.getImageData(0, 0, width, height).data;
  for (let i = 0; i < data.length; i += 4) {
    if (!isBlackEnough(data[i], data[i + 1], data[i + 2])) data[i + 3] = 0;
  }

  ctx.putImageData(new ImageData(data, width, height), 0, 0);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

const __adminPortal = document.getElementById("admin-portal");
const imgPreview = __adminPortal.querySelector("#admin-img-preview");

const adminAddProductContainer = document.getElementById("admin-add-product");
const adminAddProductInfoForm = document.getElementById(
  "admin-form-add-product",
);
const adminAddProductImageForms = __adminPortal.querySelectorAll(
  "form[id^='admin-form-add-product-image-']",
);
const adminAddProductImageInputs =
  __adminPortal?.querySelectorAll('input[type="file"]');

const labelKeys = ["image-1", "image-1", "image-2", "image-3"];
const errored = (res, i) => {
  if (res.ok) {
    console.log("File upload successful!");
    return false;
  } else {
    console.log("File upload failed...");
    const label = adminAddProductContainer.querySelector(
      `:scope > form > label[for="admin-add-product-${labelKeys[i]}"]`,
    );
    if (!label) return true;
    label.dataset.error = "An error occurred uploading this image 😞";
    return true;
  }
};

const getSignedUrl = (imageFile, name) => {
  if (!imageFile) return;

  imageFile.name = `${(name ?? imageFile.name).split(".")[0]}.${imageFile.type.split("/")[1]}`;
  return fetch(`/admin/api/generate-upload-url/${imageFile.name}`, {
    method: "GET",
  });
};

const uploadImage = async (signedUrl, imageFile) => {
  return fetch(await signedUrl, {
    method: "PUT",
    body: imageFile,
    headers: {
      "Content-Type": imageFile.type,
    },
  });
};

const adminAddProductSubmit = __adminPortal.querySelector(
  "#admin-form-add-product-submit",
);
adminAddProductSubmit.onclick = async () => {
  const formDataInfo = new FormData(adminAddProductInfoForm);

  const iter = formDataInfo.entries();
  const info = {
    name: iter.next().value[1],
    description: iter.next().value[1],
    price: iter.next().value[1],
  };

  for (const key in info)
    if (!info[key])
      return (adminAddProductInfoForm.querySelector(
        `:scope > label[for="admin-add-product-${key}"]`,
      ).dataset.error = "This field is required 😠");

  const imageFormData = [];

  for (let i = 0; i < adminAddProductImageForms.length; i++) {
    imageFormData.push(new FormData(adminAddProductImageForms[i]));
  }
  imageFiles = [];
  for (let i = 0; i < adminAddProductImageForms.length; i++) {
    if (!adminAddProductImageInputs[i].value) continue;

    const image = imageFormData[i].entries().next().value[1];

    if (i === 0) {
      const processedImage = await processImage(image);
      processedImage.name = `__processed-${image.name}`;
      imageFiles.push(processedImage);
    }
    imageFiles.push(image);
  }

  const signedUrls = [];
  for (const file of imageFiles) signedUrls.push(getSignedUrl(file));

  const uploadResponses = [];
  for (let i = 0; i < signedUrls.length; i++) {
    const signed = (await signedUrls[i])?.json();

    uploadResponses.push(uploadImage(signed, imageFiles[i]));
  }

  for (let i = 0; i < uploadResponses.length; i++)
    if (errored(await uploadResponses[i], i)) return;

  fetch(`/admin/api/product${window.location.pathname}`, {
    method: "POST",
    body: JSON.stringify({
      ...info,
      images: imageFiles.map((file) => file.name),
    }),
  });
};

const adminProducts = __adminPortal.querySelectorAll(".admin-product");
for (const product of adminProducts) {
  const productId = product.dataset.adminProductId;
  const target = document.getElementById(`product-${productId}`);
  product.addEventListener("mouseenter", () =>
    target.classList.add("admin-hover"),
  );
  product.addEventListener("mouseleave", () =>
    target.classList.remove("admin-hover"),
  );

  product.children[0].addEventListener("mouseenter", () =>
    target.classList.add("admin-might-remove"),
  );
  product.children[0].addEventListener("mouseleave", () =>
    target.classList.remove("admin-might-remove"),
  );
  product.children[0].addEventListener("click", async () => {
    const res = await fetch("/admin/api/product", {
      method: "DELETE",
      body: JSON.stringify({ id: productId }),
    });

    if (res.ok) {
      product.remove();
      target.remove();
    } else
      alert(
        `Error occurred, product may not have been removed (status: ${res.status}; ${res.statusText})`,
      );
  });
}
