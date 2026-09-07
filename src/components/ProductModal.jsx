
import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
  updateProductVariant,
  uploadProductImage,
  receiveStock,
} from "../api/productApis";

export default function ProductModal({
  categories,
  product,
  onClose,
  onSuccess,
}) {
  const isEdit = !!product;

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

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [uploadingImage, setUploadingImage] =
    useState(false);

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

      const existingImage =
        product.imageUrl ||
        product.image ||
        product.productImage ||
        "";

      setImageUrl(existingImage);
      setImagePreview(existingImage);
      setImageFile(null);
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
      setImageUrl("");
      setImagePreview("");
      setImageFile(null);
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

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setError("");

    const localPreview =
      URL.createObjectURL(file);

    setImagePreview(localPreview);

    try {
      setUploadingImage(true);

      /*
       * Keeping your existing upload API.
       * For edit, productId is passed when available.
       */
      const response =
        await uploadProductImage(
          file,
          product?.id
        );

      const url =
        response?.data?.url ||
        response?.url ||
        response?.data?.imageUrl ||
        response?.imageUrl ||
        "";

      if (!url) {
        throw new Error(
          "Image URL was not returned"
        );
      }

      setImageUrl(url);
    } catch (err) {
      setImageFile(null);

      const oldImage =
        product?.imageUrl ||
        product?.image ||
        product?.productImage ||
        "";

      setImagePreview(oldImage);
      setImageUrl(oldImage);

      setError(
        err?.message ||
          "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);
    }
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

    if (uploadingImage) {
      setError(
        "Please wait until the image upload is completed."
      );
      return;
    }

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
        const productPayload = {
          name: form.name.trim(),
          slug:
            form.slug.trim() ||
            undefined,
          description:
            form.description.trim() ||
            null,
          brandId:
            form.brandId.trim() ||
            null,
          categoryId: form.categoryId,
          imageUrl:
            imageUrl || null,
          isActive: form.isActive,
        };

        /*
         * Update main product first.
         */
        await updateProduct(
          product.id,
          productPayload
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

      const payload = {
        name: form.name.trim(),
        slug:
          form.slug.trim() || undefined,
        description:
          form.description.trim() ||
          undefined,
        brandId:
          form.brandId.trim() || undefined,
        categoryId: form.categoryId,
        imageUrl:
          imageUrl || undefined,
        variants: [
          {
            sku: form.sku.trim(),
            weight: Number(form.weight),
            unit: form.unit,
            mrp: Number(form.mrp),
            sellingPrice:
              Number(form.sellingPrice),
          },
        ],
      };

      const response =
        await createProduct(payload);

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
                Brand ID
              </label>

              <input
                value={form.brandId}
                onChange={(e) =>
                  update(
                    "brandId",
                    e.target.value
                  )
                }
                className="input"
                placeholder="Brand ID"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-3.5">
            <div>
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
            </div>

            <div>
              <label className="label">
                Product photo
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
                className="input text-sm"
              />

              {uploadingImage && (
                <p className="text-xs text-[#1b7340] mt-1">
                  Uploading image...
                </p>
              )}

              {imagePreview && (
                <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-[#dde3dc]">
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

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
              disabled={
                loading ||
                uploadingImage
              }
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





