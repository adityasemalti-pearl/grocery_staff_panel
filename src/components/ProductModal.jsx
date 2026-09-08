import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  updateProduct,
  updateProductVariant,
  receiveStock,
} from "../api/productApis";

let tempImageId = 0;
const nextTempId = () => `temp-${Date.now()}-${tempImageId++}`;

/*
 * Field names the /products route expects for photos. Confirmed from the
 * create payload you tested with: "images" carries the actual file(s).
 * The two below (existing photos kept on an edit, and which one is primary)
 * are our best-guess names for the update side — there wasn't a sample
 * payload for that yet, so rename these in one place if your API differs.
 */
const IMAGES_FIELD = "images";
const EXISTING_IMAGES_FIELD = "existingImages";
const PRIMARY_IMAGE_FIELD = "primaryImageUrl";

export default function ProductModal({
  categories,
  brands,
  product,
  onClose,
  onSuccess,
}) {
  const isEdit = !!product;
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    brandId: "",
    categoryId: "",
    sku: "",
    weight: "",
    unit: "G",
    mrp: "",
    sellingPrice: "",
    stock: 0,
    isActive: true,
  });

  const [variants, setVariants] = useState([]);

  /*
   * images: [{ id, url, previewUrl, file, isExisting }]
   * - isExisting: true for photos already saved on the product (url points at
   *   the server), false for a newly picked file that will upload on submit
   * - url: server URL for existing photos, "" for not-yet-saved new ones
   * - previewUrl: what we render — the server url, or a local object URL for
   *   a freshly picked file
   * - file: the original File for new photos (null for existing ones)
   * The first entry in the array is always treated as the primary photo.
   */
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        brandId: product.brandId || "",
        categoryId:
          product.categoryId ||
          product.category?.id ||
          "",
        sku: "",
        weight: "",
        unit: "G",
        mrp: "",
        sellingPrice: "",
        stock: 0,
        isActive:
          product.isActive !== undefined
            ? product.isActive
            : true,
      });

      /*
       * Load all existing variants into edit form.
       *
       * Backend example:
       * variants: [
       *   {
       *     sku,
       *     mrp,
       *     sellingPrice,
       *     unit,
       *     weight,
       *     isActive,
       *     isAvailable
       *   }
       * ]
       */
      setVariants(
        (product.variants || []).map((variant) => ({
          id: variant.id,
          sku: variant.sku || "",
          weight:
            variant.weight !== undefined &&
            variant.weight !== null
              ? String(variant.weight)
              : "",
          unit: variant.unit || "G",
          mrp:
            variant.mrp !== undefined &&
            variant.mrp !== null
              ? String(variant.mrp)
              : "",
          sellingPrice:
            variant.sellingPrice !== undefined &&
            variant.sellingPrice !== null
              ? String(variant.sellingPrice)
              : "",
          isActive:
            variant.isActive !== undefined
              ? variant.isActive
              : true,
          isAvailable:
            variant.isAvailable !== undefined
              ? variant.isAvailable
              : true,
        }))
      );

      /*
       * Existing photos come back as product.images (ordered array).
       * Fall back to a single legacy image field for older records that
       * predate multi-image support.
       */
      const existingImages =
        Array.isArray(product.images) && product.images.length
          ? product.images
          : [
              product.imageUrl ||
                product.image ||
                product.productImage ||
                "",
            ].filter(Boolean);

      setImages(
        existingImages.map((url) => ({
          id: url,
          url,
          previewUrl: url,
          file: null,
          isExisting: true,
        }))
      );
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        brandId: "",
        categoryId: categories?.[0]?.id || "",
        sku: "",
        weight: "",
        unit: "G",
        mrp: "",
        sellingPrice: "",
        stock: 0,
        isActive: true,
      });

      setVariants([]);
      setImages([]);
    }

    setError("");
  }, [product, categories]);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateVariant = (variantId, key, value) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [key]: value,
            }
          : variant
      )
    );
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files || []);

    e.target.value = "";

    if (!files.length) return;

    setError("");

    const newEntries = files.map((file) => ({
      id: nextTempId(),
      url: "",
      previewUrl: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setImages((prev) => [...prev, ...newEntries]);
  };

  const removeImage = (imageId) => {
    setImages((prev) =>
      prev.filter((image) => image.id !== imageId)
    );
  };

  const makePrimary = (imageId) => {
    setImages((prev) => {
      const index = prev.findIndex(
        (image) => image.id === imageId
      );

      if (index <= 0) return prev;

      const next = [...prev];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);

      return next;
    });
  };

  const validateEditVariants = () => {
    for (const variant of variants) {
      if (!variant.sku?.trim()) {
        return `SKU is required for variant ${variant.id}.`;
      }

      if (
        variant.weight === "" ||
        variant.weight === null ||
        Number(variant.weight) < 0
      ) {
        return `Weight is required for SKU ${variant.sku}.`;
      }

      if (
        variant.mrp === "" ||
        variant.mrp === null ||
        Number(variant.mrp) < 0
      ) {
        return `MRP is required for SKU ${variant.sku}.`;
      }

      if (
        variant.sellingPrice === "" ||
        variant.sellingPrice === null ||
        Number(variant.sellingPrice) < 0
      ) {
        return `Selling price is required for SKU ${variant.sku}.`;
      }

      if (!variant.unit) {
        return `Unit is required for SKU ${variant.sku}.`;
      }
    }

    return "";
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Product name is required.");
      return;
    }

    if (!form.categoryId) {
      setError("Please select a category.");
      return;
    }

    try {
      setLoading(true);

      /* =========================
         EDIT PRODUCT
      ========================= */
      if (isEdit) {
        const productFormData = new FormData();

        productFormData.append("name", form.name.trim());

        if (form.slug.trim()) {
          productFormData.append("slug", form.slug.trim());
        }

        productFormData.append(
          "description",
          form.description.trim()
        );

        if (form.brandId) {
          productFormData.append(
            "brandId",
            form.brandId
          );
        }

        productFormData.append(
          "categoryId",
          form.categoryId
        );

        productFormData.append(
          "isActive",
          String(form.isActive)
        );

        /*
         * Photos that already live on the product (server URLs), in the
         * order they should appear — the caller/backend is responsible
         * for reconciling this against what's actually stored.
         */
        const keptExistingUrls = images
          .filter((image) => image.isExisting)
          .map((image) => image.url);

        productFormData.append(
          EXISTING_IMAGES_FIELD,
          JSON.stringify(keptExistingUrls)
        );

        /*
         * Freshly picked photos that haven't been uploaded anywhere yet —
         * they go up together with the rest of the product data.
         */
        images
          .filter((image) => !image.isExisting)
          .forEach((image) => {
            productFormData.append(IMAGES_FIELD, image.file);
          });

        /*
         * Tell the backend which photo is primary. If it's one of the
         * existing photos we can name it directly; if it's a freshly
         * picked file, it's simply the first entry under IMAGES_FIELD.
         */
        if (images[0]?.isExisting) {
          productFormData.append(
            PRIMARY_IMAGE_FIELD,
            images[0].url
          );
        }

        /*
         * Update main product first.
         */
        await updateProduct(
          product.id,
          productFormData
        );

        /*
         * Validate variants before sending.
         */
        const variantError =
          validateEditVariants();

        if (variantError) {
          setError(variantError);
          setLoading(false);
          return;
        }

        /*
         * Update every existing variant.
         *
         * We intentionally send only editable fields.
         */
        for (const variant of variants) {
          const variantPayload = {
            sku: variant.sku.trim(),
            weight: Number(variant.weight),
            unit: variant.unit,
            mrp: Number(variant.mrp),
            sellingPrice:
              Number(variant.sellingPrice),
            isActive:
              variant.isActive,
            isAvailable:
              variant.isAvailable,
          };

          await updateProductVariant(
            product.id,
            variant.id,
            variantPayload
          );
        }

        onSuccess(
          "Product and variants updated successfully"
        );

        onClose();
        return;
      }

      /* =========================
         CREATE PRODUCT
      ========================= */

      if (!form.sku.trim()) {
        setError("SKU is required.");
        setLoading(false);
        return;
      }

      if (
        form.weight === "" ||
        Number(form.weight) < 0
      ) {
        setError("Weight is required.");
        setLoading(false);
        return;
      }

      if (
        form.mrp === "" ||
        Number(form.mrp) < 0
      ) {
        setError("MRP is required.");
        setLoading(false);
        return;
      }

      if (
        form.sellingPrice === "" ||
        Number(form.sellingPrice) < 0
      ) {
        setError(
          "Selling price is required."
        );
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name.trim());

      if (form.slug.trim()) {
        formData.append("slug", form.slug.trim());
      }

      formData.append(
        "description",
        form.description.trim()
      );

      if (form.brandId) {
        formData.append("brandId", form.brandId);
      }

      formData.append(
        "categoryId",
        form.categoryId
      );

      formData.append(
        "variants",
        JSON.stringify([
          {
            sku: form.sku.trim(),
            weight: Number(form.weight),
            unit: form.unit,
            mrp: Number(form.mrp),
            sellingPrice: Number(form.sellingPrice),
          },
        ])
      );

      /*
       * All photos are brand new at creation time — every entry in
       * `images` is an unsaved File, appended in the order the staff
       * arranged them (first = primary).
       */
      images.forEach((image) => {
        formData.append(IMAGES_FIELD, image.file);
      });

      const response =
        await createProduct(formData);

      const createdProduct =
        response?.data || response;

      const variantId =
        createdProduct?.variants?.[0]?.id;

      const initialStock =
        Number(form.stock) || 0;

      if (initialStock > 0 && variantId) {
        try {
          await receiveStock(variantId, {
            quantity: initialStock,
            reason:
              "Initial stock on product creation",
            performedBy:
              localStorage.getItem(
                "staffName"
              ) || "Staff",
          });

          onSuccess(
            "Product created successfully"
          );
        } catch (stockError) {
          onSuccess(
            `Product created, but stock could not be added. ${
              stockError?.message ||
              "Unknown error"
            }`
          );
        }
      } else {
        onSuccess(
          "Product created successfully"
        );
      }

      onClose();
    } catch (err) {
      setError(
        err?.message ||
          "Something went wrong while saving the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,38,32,0.45)] flex items-start justify-center px-4 py-6 overflow-y-auto z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[14px] max-w-[760px] w-full p-6 mt-5 mb-8"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right text-2xl text-[#5b6960]"
        >
          ×
        </button>

        <h2 className="font-['Baloo_2'] text-xl font-bold mb-5">
          {isEdit
            ? "Edit Product"
            : "Add Product"}
        </h2>

        {error && (
          <div className="bg-[#fbe9e7] text-[#b3382c] px-3 py-2.5 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          {/* =========================
              PRODUCT INFORMATION
          ========================= */}

          <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold mb-3">
            Product Information
          </p>

          <label className="label">
            Product name
          </label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              update(
                "name",
                e.target.value
              )
            }
            className="input"
            placeholder="Enter product name"
          />

          <div className="grid grid-cols-2 gap-x-3.5">
            <div>
              <label className="label">
                Slug
              </label>

              <input
                value={form.slug}
                onChange={(e) =>
                  update(
                    "slug",
                    e.target.value
                  )
                }
                className="input"
                placeholder="product-slug"
              />
            </div>

            <div>
              <label className="label">
                Brand
              </label>

              <select
                value={form.brandId}
                onChange={(e) =>
                  update(
                    "brandId",
                    e.target.value
                  )
                }
                className="input"
              >
                <option value="">
                  No brand
                </option>

                {(brands || []).map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label className="label">
            Category
          </label>

          <select
            required
            value={form.categoryId}
            onChange={(e) =>
              update(
                "categoryId",
                e.target.value
              )
            }
            className="input"
          >
            <option value="">
              Select category
            </option>

            {categories.map((cat) => (
              <option
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </option>
            ))}
          </select>

          <label className="label">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={(e) =>
              update(
                "description",
                e.target.value
              )
            }
            className="input min-h-[90px] resize-none"
            placeholder="Enter product description"
          />

          {isEdit && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  update(
                    "isActive",
                    e.target.checked
                  )
                }
                className="w-4 h-4"
              />

              <label className="text-sm font-semibold">
                Product Active
              </label>
            </div>
          )}

          {/* =========================
              PRODUCT PHOTOS
          ========================= */}

          <div className="h-px bg-[#dde3dc] my-[20px]" />

          <div className="flex items-center justify-between mb-1">
            <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold">
              Product Photos
            </p>

            <span className="text-xs text-[#5b6960]">
              {images.length} photo
              {images.length !== 1 ? "s" : ""}
            </span>
          </div>

          <p className="text-xs text-[#5b6960] mb-3">
            The first photo is used as the main listing image. New photos
            upload when you save.
          </p>

          <div className="flex flex-wrap gap-3">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#dde3dc] bg-[#f7f8f4] group"
              >
                <img
                  src={image.previewUrl}
                  alt={`Product photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {index === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-[#1b7340] text-white text-[9px] font-bold uppercase tracking-wide text-center py-0.5">
                    Primary
                  </span>
                )}

                {!image.isExisting && index !== 0 && (
                  <span className="absolute bottom-0 left-0 right-0 bg-[#1b1f1c]/70 text-white text-[9px] font-semibold text-center py-0.5">
                    New
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-[#1b1f1c]/70 text-white text-xs leading-none flex items-center justify-center hover:bg-[#b3382c]"
                  aria-label="Remove photo"
                >
                  ×
                </button>

                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(image.id)}
                    className="absolute bottom-0 left-0 right-0 bg-[#1b1f1c]/60 text-white text-[9px] font-semibold text-center py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Make primary
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-lg border-2 border-dashed border-[#dde3dc] text-[#5b6960] text-xs font-semibold flex flex-col items-center justify-center gap-1 hover:border-[#1b7340] hover:text-[#1b7340]"
            >
              <span className="text-xl leading-none">+</span>
              Add photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImagesChange}
              className="hidden"
            />
          </div>

          {/* =========================
              EXISTING VARIANTS
          ========================= */}

          {isEdit && (
            <>
              <div className="h-px bg-[#dde3dc] my-[20px]" />

              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold">
                  Pack Sizes / Variants
                </p>

                <span className="text-xs text-[#5b6960]">
                  {variants.length} variant
                  {variants.length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

              {variants.length === 0 ? (
                <div className="border border-dashed border-[#dde3dc] rounded-lg p-5 text-center text-sm text-[#5b6960]">
                  No variants found.
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {variants.map(
                    (variant, index) => (
                      <div
                        key={variant.id}
                        className="border border-[#dde3dc] rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm font-bold">
                            Pack Size #
                            {index + 1}
                          </p>

                          <span className="text-[11px] text-[#5b6960]">
                            ID:{" "}
                            {variant.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-x-3.5">
                          <div>
                            <label className="label">
                              SKU
                            </label>

                            <input
                              required
                              value={
                                variant.sku
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "sku",
                                  e.target
                                    .value
                                )
                              }
                              className="input"
                            />
                          </div>

                          <div>
                            <label className="label">
                              Weight / Qty
                            </label>

                            <input
                              required
                              type="number"
                              step="0.001"
                              min="0"
                              value={
                                variant.weight
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "weight",
                                  e.target
                                    .value
                                )
                              }
                              className="input"
                            />
                          </div>

                          <div>
                            <label className="label">
                              Unit
                            </label>

                            <select
                              value={
                                variant.unit
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "unit",
                                  e.target
                                    .value
                                )
                              }
                              className="input"
                            >
                              <option value="G">
                                G
                              </option>
                              <option value="KG">
                                KG
                              </option>
                              <option value="ML">
                                ML
                              </option>
                              <option value="L">
                                L
                              </option>
                              <option value="PCS">
                                PCS
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3.5">
                          <div>
                            <label className="label">
                              MRP (₹)
                            </label>

                            <input
                              required
                              type="number"
                              step="0.01"
                              min="0"
                              value={
                                variant.mrp
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "mrp",
                                  e.target
                                    .value
                                )
                              }
                              className="input"
                            />
                          </div>

                          <div>
                            <label className="label">
                              Selling Price (₹)
                            </label>

                            <input
                              required
                              type="number"
                              step="0.01"
                              min="0"
                              value={
                                variant.sellingPrice
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "sellingPrice",
                                  e.target
                                    .value
                                )
                              }
                              className="input"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-5 mt-2">
                          <label className="flex items-center gap-2 text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={
                                variant.isActive
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "isActive",
                                  e.target
                                    .checked
                                )
                              }
                              className="w-4 h-4"
                            />

                            Variant Active
                          </label>

                          <label className="flex items-center gap-2 text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={
                                variant.isAvailable
                              }
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "isAvailable",
                                  e.target
                                    .checked
                                )
                              }
                              className="w-4 h-4"
                            />

                            Available for Sale
                          </label>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          )}

          {/* =========================
              ADD PRODUCT VARIANT
          ========================= */}

          {!isEdit && (
            <>
              <div className="h-px bg-[#dde3dc] my-[18px]" />

              <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold mb-3">
                Pack Size
              </p>

              <div className="grid grid-cols-3 gap-x-3.5">
                <div>
                  <label className="label">
                    SKU
                  </label>

                  <input
                    required
                    value={form.sku}
                    onChange={(e) =>
                      update(
                        "sku",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    Weight / Qty
                  </label>

                  <input
                    required
                    type="number"
                    step="0.001"
                    min="0"
                    value={form.weight}
                    onChange={(e) =>
                      update(
                        "weight",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    Unit
                  </label>

                  <select
                    value={form.unit}
                    onChange={(e) =>
                      update(
                        "unit",
                        e.target.value
                      )
                    }
                    className="input"
                  >
                    <option value="G">
                      G
                    </option>
                    <option value="KG">
                      KG
                    </option>
                    <option value="ML">
                      ML
                    </option>
                    <option value="L">
                      L
                    </option>
                    <option value="PCS">
                      PCS
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-3.5">
                <div>
                  <label className="label">
                    MRP (₹)
                  </label>

                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.mrp}
                    onChange={(e) =>
                      update(
                        "mrp",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </div>

                <div>
                  <label className="label">
                    Selling Price (₹)
                  </label>

                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={
                      form.sellingPrice
                    }
                    onChange={(e) =>
                      update(
                        "sellingPrice",
                        e.target.value
                      )
                    }
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">
                  Initial Stock (units)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    update(
                      "stock",
                      e.target.value
                    )
                  }
                  className="input"
                />
              </div>
            </>
          )}

          {/* =========================
              BUTTONS
          ========================= */}

          <div className="flex gap-2.5 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 border border-[#dde3dc] rounded-lg font-semibold disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#1b7340] hover:bg-[#124d2a] text-white rounded-lg font-semibold disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Product"
                : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}