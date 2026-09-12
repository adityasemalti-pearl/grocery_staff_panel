import { useEffect, useRef, useState } from "react";
import {
  createProduct,
  updateProduct,
  updateProductVariant,
  receiveStock,
  uploadProductImages,
  bulkImportProducts,
} from "../api/productApis";

let tempImageId = 0;
const nextTempId = () => `temp-${Date.now()}-${tempImageId++}`;

export default function ProductModal({
  categories,
  brands,
  product,
  onClose,
  onSuccess,
}) {
  const isEdit = !!product;
  const fileInputRef = useRef(null);
  const csvInputRef = useRef(null);

  // "single" | "bulk" — bulk tab only ever shown when adding, not editing
  const [mode, setMode] = useState("single");

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
   * - isExisting: true for photos already saved on the product (server URL)
   * - file: the original File for a newly picked, not-yet-uploaded photo
   * New photos are uploaded via POST /uploads/product-images once we have
   * a real productId (i.e. right after create/update succeeds) — they are
   * never sent as part of the product create/update payload itself.
   */
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- bulk import state ---
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [bulkBrandId, setBulkBrandId] = useState("");
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [bulkResult, setBulkResult] = useState(null);

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
      setMode("single");
      setBulkCategoryId(categories?.[0]?.id || "");
      setBulkBrandId("");
      setBulkFile(null);
      setBulkResult(null);
      setBulkError("");
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

  /*
   * Uploads every not-yet-saved photo in `images` for the given product,
   * via POST /uploads/product-images (productId + files[]). Existing
   * (already-saved) photos are left alone — there's no reorder/primary
   * endpoint confirmed yet, so photo order beyond "kept vs new" isn't
   * sent anywhere.
   */
  const uploadPendingImages = async (productId) => {
    const pending = images.filter((image) => !image.isExisting && image.file);

    if (!pending.length) return;

    await uploadProductImages(
      productId,
      pending.map((image) => image.file)
    );
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
          productFormData.append("brandId", form.brandId);
        }

        productFormData.append("categoryId", form.categoryId);
        productFormData.append("isActive", String(form.isActive));

        await updateProduct(product.id, productFormData);

        await uploadPendingImages(product.id);

        const variantError = validateEditVariants();

        if (variantError) {
          setError(variantError);
          setLoading(false);
          return;
        }

        for (const variant of variants) {
          const variantPayload = {
            sku: variant.sku.trim(),
            weight: Number(variant.weight),
            unit: variant.unit,
            mrp: Number(variant.mrp),
            sellingPrice: Number(variant.sellingPrice),
            isActive: variant.isActive,
            isAvailable: variant.isAvailable,
          };

          await updateProductVariant(
            product.id,
            variant.id,
            variantPayload
          );
        }

        onSuccess("Product and variants updated successfully");
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

      if (form.weight === "" || Number(form.weight) < 0) {
        setError("Weight is required.");
        setLoading(false);
        return;
      }

      if (form.mrp === "" || Number(form.mrp) < 0) {
        setError("MRP is required.");
        setLoading(false);
        return;
      }

      if (
        form.sellingPrice === "" ||
        Number(form.sellingPrice) < 0
      ) {
        setError("Selling price is required.");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name.trim());

      if (form.slug.trim()) {
        formData.append("slug", form.slug.trim());
      }

      formData.append("description", form.description.trim());

      if (form.brandId) {
        formData.append("brandId", form.brandId);
      }

      formData.append("categoryId", form.categoryId);

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

      const response = await createProduct(formData);

      const createdProduct = response?.data || response;
      const variantId = createdProduct?.variants?.[0]?.id;

      if (createdProduct?.id) {
        await uploadPendingImages(createdProduct.id);
      }

      const initialStock = Number(form.stock) || 0;

      if (initialStock > 0 && variantId) {
        try {
          await receiveStock(variantId, {
            quantity: initialStock,
            reason: "Initial stock on product creation",
            performedBy:
              localStorage.getItem("staffName") || "Staff",
          });

          onSuccess("Product created successfully");
        } catch (stockError) {
          onSuccess(
            `Product created, but stock could not be added. ${
              stockError?.message || "Unknown error"
            }`
          );
        }
      } else {
        onSuccess("Product created successfully");
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

  const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    e.target.value = "";
    setBulkFile(file);
    setBulkError("");
    setBulkResult(null);
  };

  const submitBulkImport = async (e) => {
    e.preventDefault();

    setBulkError("");
    setBulkResult(null);

    if (!bulkCategoryId) {
      setBulkError("Please select a category for this batch.");
      return;
    }

    if (!bulkFile) {
      setBulkError("Please choose a CSV file to import.");
      return;
    }

    try {
      setBulkLoading(true);

      const response = await bulkImportProducts(
        bulkCategoryId,
        bulkBrandId,
        bulkFile
      );

      const data = response?.data || response || {};

      setBulkResult({
        created:
          data.created ??
          data.successCount ??
          data.imported ??
          null,
        failed:
          data.failed ??
          data.failedCount ??
          data.errors?.length ??
          null,
        errors: data.errors || data.failures || [],
      });

      onSuccess("Bulk import completed");
    } catch (err) {
      setBulkError(
        err?.message || "Failed to bulk import products."
      );
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,38,32,0.45)] flex items-start justify-center px-4 py-6 overflow-y-auto z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[14px] max-w-[760px] w-full p-6 mt-5 mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right text-2xl text-[#5b6960]"
        >
          ×
        </button>

        <h2 className="font-['Baloo_2'] text-xl font-bold mb-1">
          {isEdit
            ? "Edit Product"
            : mode === "bulk"
            ? "Bulk Import Products"
            : "Add Product"}
        </h2>

        {!isEdit && (
          <div className="flex gap-2 mb-5 mt-3">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border ${
                mode === "single"
                  ? "bg-[#1b7340] text-white border-[#1b7340]"
                  : "border-[#dde3dc] text-[#5b6960] hover:border-[#1b7340] hover:text-[#1b7340]"
              }`}
            >
              Single Product
            </button>

            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border ${
                mode === "bulk"
                  ? "bg-[#1b7340] text-white border-[#1b7340]"
                  : "border-[#dde3dc] text-[#5b6960] hover:border-[#1b7340] hover:text-[#1b7340]"
              }`}
            >
              Bulk Import (CSV)
            </button>
          </div>
        )}

        {mode === "bulk" && !isEdit ? (
          <form onSubmit={submitBulkImport}>
            {bulkError && (
              <div className="bg-[#fbe9e7] text-[#b3382c] px-3 py-2.5 rounded-lg text-sm mb-4">
                {bulkError}
              </div>
            )}

            {bulkResult && (
              <div className="bg-[#e4f3e0] text-[#2f7a4f] px-3 py-2.5 rounded-lg text-sm mb-4">
                Import finished.
                {bulkResult.created !== null &&
                  ` ${bulkResult.created} created.`}
                {bulkResult.failed
                  ? ` ${bulkResult.failed} failed.`
                  : ""}
                {bulkResult.errors?.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 text-[#8a5a00]">
                    {bulkResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>
                        {typeof err === "string"
                          ? err
                          : err.message || JSON.stringify(err)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <p className="text-xs text-[#5b6960] mb-4">
              Every row in the CSV is created under the category (and
              brand, if chosen) selected below. Expected columns: Name,
              Description, SKU, MRP, SellingPrice, Unit, Weight,
              InitialStock, ImageUrl.
            </p>

            <div className="grid grid-cols-2 gap-x-3.5">
              <div>
                <label className="label">Category</label>

                <select
                  required
                  value={bulkCategoryId}
                  onChange={(e) =>
                    setBulkCategoryId(e.target.value)
                  }
                  className="input"
                >
                  <option value="">Select category</option>

                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Brand</label>

                <select
                  value={bulkBrandId}
                  onChange={(e) => setBulkBrandId(e.target.value)}
                  className="input"
                >
                  <option value="">No brand</option>

                  {(brands || []).map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="label">CSV file</label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="px-3.5 py-2 border border-[#dde3dc] rounded-lg text-xs font-semibold hover:border-[#1b7340] hover:text-[#1b7340]"
              >
                Choose CSV
              </button>

              <span className="text-sm text-[#5b6960]">
                {bulkFile ? bulkFile.name : "No file chosen"}
              </span>

              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleBulkFileChange}
                className="hidden"
              />
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={bulkLoading}
                className="flex-1 py-3 border border-[#dde3dc] rounded-lg font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={bulkLoading}
                className="flex-1 py-3 bg-[#1b7340] hover:bg-[#124d2a] text-white rounded-lg font-semibold disabled:opacity-60"
              >
                {bulkLoading ? "Importing..." : "Import Products"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={submit}>
            {error && (
              <div className="bg-[#fbe9e7] text-[#b3382c] px-3 py-2.5 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold mb-3">
              Product Information
            </p>

            <label className="label">Product name</label>

            <input
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="input"
              placeholder="Enter product name"
            />

            <div className="grid grid-cols-2 gap-x-3.5">
              <div>
                <label className="label">Slug</label>

                <input
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  className="input"
                  placeholder="product-slug"
                />
              </div>

              <div>
                <label className="label">Brand</label>

                <select
                  value={form.brandId}
                  onChange={(e) => update("brandId", e.target.value)}
                  className="input"
                >
                  <option value="">No brand</option>

                  {(brands || []).map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="label">Category</label>

            <select
              required
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="input"
            >
              <option value="">Select category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <label className="label">Description</label>

            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="input min-h-[90px] resize-none"
              placeholder="Enter product description"
            />

            {isEdit && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => update("isActive", e.target.checked)}
                  className="w-4 h-4"
                />

                <label className="text-sm font-semibold">
                  Product Active
                </label>
              </div>
            )}

            {/* PRODUCT PHOTOS */}

            <div className="h-px bg-[#dde3dc] my-[20px]" />

            <div className="flex items-center justify-between mb-1">
              <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold">
                Product Photos
              </p>

              <span className="text-xs text-[#5b6960]">
                {images.length} photo{images.length !== 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-xs text-[#5b6960] mb-3">
              New photos upload automatically right after you save.
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

            {/* EXISTING VARIANTS */}

            {isEdit && (
              <>
                <div className="h-px bg-[#dde3dc] my-[20px]" />

                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold">
                    Pack Sizes / Variants
                  </p>

                  <span className="text-xs text-[#5b6960]">
                    {variants.length} variant
                    {variants.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {variants.length === 0 ? (
                  <div className="border border-dashed border-[#dde3dc] rounded-lg p-5 text-center text-sm text-[#5b6960]">
                    No variants found.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {variants.map((variant, index) => (
                      <div
                        key={variant.id}
                        className="border border-[#dde3dc] rounded-xl p-4"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-sm font-bold">
                            Pack Size #{index + 1}
                          </p>

                          <span className="text-[11px] text-[#5b6960]">
                            ID: {variant.id}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-x-3.5">
                          <div>
                            <label className="label">SKU</label>

                            <input
                              required
                              value={variant.sku}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
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
                              value={variant.weight}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "weight",
                                  e.target.value
                                )
                              }
                              className="input"
                            />
                          </div>

                          <div>
                            <label className="label">Unit</label>

                            <select
                              value={variant.unit}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "unit",
                                  e.target.value
                                )
                              }
                              className="input"
                            >
                              <option value="G">G</option>
                              <option value="KG">KG</option>
                              <option value="ML">ML</option>
                              <option value="L">L</option>
                              <option value="PCS">PCS</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3.5">
                          <div>
                            <label className="label">MRP (₹)</label>

                            <input
                              required
                              type="number"
                              step="0.01"
                              min="0"
                              value={variant.mrp}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
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
                              value={variant.sellingPrice}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "sellingPrice",
                                  e.target.value
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
                              checked={variant.isActive}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "isActive",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4"
                            />
                            Variant Active
                          </label>

                          <label className="flex items-center gap-2 text-sm font-semibold">
                            <input
                              type="checkbox"
                              checked={variant.isAvailable}
                              onChange={(e) =>
                                updateVariant(
                                  variant.id,
                                  "isAvailable",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4"
                            />
                            Available for Sale
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ADD PRODUCT — SINGLE VARIANT */}

            {!isEdit && (
              <>
                <div className="h-px bg-[#dde3dc] my-[18px]" />

                <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold mb-3">
                  Pack Size
                </p>

                <div className="grid grid-cols-3 gap-x-3.5">
                  <div>
                    <label className="label">SKU</label>

                    <input
                      required
                      value={form.sku}
                      onChange={(e) => update("sku", e.target.value)}
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Weight / Qty</label>

                    <input
                      required
                      type="number"
                      step="0.001"
                      min="0"
                      value={form.weight}
                      onChange={(e) =>
                        update("weight", e.target.value)
                      }
                      className="input"
                    />
                  </div>

                  <div>
                    <label className="label">Unit</label>

                    <select
                      value={form.unit}
                      onChange={(e) => update("unit", e.target.value)}
                      className="input"
                    >
                      <option value="G">G</option>
                      <option value="KG">KG</option>
                      <option value="ML">ML</option>
                      <option value="L">L</option>
                      <option value="PCS">PCS</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-3.5">
                  <div>
                    <label className="label">MRP (₹)</label>

                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.mrp}
                      onChange={(e) => update("mrp", e.target.value)}
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
                      value={form.sellingPrice}
                      onChange={(e) =>
                        update("sellingPrice", e.target.value)
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
                    onChange={(e) => update("stock", e.target.value)}
                    className="input"
                  />
                </div>
              </>
            )}

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
        )}
      </div>
    </div>
  );
}