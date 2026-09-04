import { useEffect, useState } from "react";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
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
    categoryId: "",
    sku: "",
    weight: "",
    unit: "G",
    mrp: "",
    sellingPrice: "",
    stock: 0,
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
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

      setImageUrl(product.imageUrl || product.image || "");
      setImagePreview(product.imageUrl || product.image || "");
    } else {
      setForm({
        name: "",
        categoryId: categories?.[0]?.id || "",
        sku: "",
        weight: "",
        unit: "G",
        mrp: "",
        sellingPrice: "",
        stock: 0,
        isActive: true,
      });

      setImageUrl("");
      setImagePreview("");
    }
  }, [product, categories]);

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setError("");

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    try {
      setUploadingImage(true);

      const response = await uploadProductImage(file);

      const url =
        response?.data?.url ||
        response?.url ||
        "";

      if (!url) {
        throw new Error("Image URL was not returned");
      }

      setImageUrl(url);
    } catch (err) {
      setImageFile(null);
      setImagePreview(
        product?.imageUrl ||
          product?.image ||
          ""
      );
      setImageUrl(
        product?.imageUrl ||
          product?.image ||
          ""
      );
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (uploadingImage) {
      setError("Please wait until the image upload is completed.");
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

      if (isEdit) {
        const payload = {
          name: form.name.trim(),
          categoryId: form.categoryId,
          imageUrl: imageUrl || undefined,
          isActive: form.isActive,
        };

        await updateProduct(product.id, payload);

        onSuccess("Product updated successfully");
      } else {
        const payload = {
          name: form.name.trim(),
          categoryId: form.categoryId,
          imageUrl: imageUrl || undefined,
          variants: [
            {
              sku: form.sku.trim(),
              weight: Number(form.weight),
              unit: form.unit,
              mrp: Number(form.mrp),
              sellingPrice: Number(form.sellingPrice),
            },
          ],
        };

        const response = await createProduct(payload);

        const createdProduct =
          response?.data || response;

        const variantId =
          createdProduct?.variants?.[0]?.id;

        const initialStock = Number(form.stock) || 0;

        if (initialStock > 0 && variantId) {
          const { receiveStock } = await import(
            "../api/productApis"
          );

          try {
            await receiveStock(variantId, {
              quantity: initialStock,
              reason: "Initial stock on product creation",
              performedBy:
                localStorage.getItem("staffName") ||
                "Staff",
            });

            onSuccess("Product created successfully");
          } catch (stockError) {
            onSuccess(
              `Product created, but stock could not be added. ${stockError.message}`
            );
          }
        } else {
          onSuccess("Product created successfully");
        }
      }

      onClose();
    } catch (err) {
      setError(err.message);
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
        className="bg-white rounded-[14px] max-w-[640px] w-full p-6 mt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right text-2xl text-[#5b6960]"
        >
          ×
        </button>

        <h2 className="font-['Baloo_2'] text-xl font-bold mb-5">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        {error && (
          <div className="bg-[#fbe9e7] text-[#b3382c] px-3 py-2.5 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label className="label">
            Product name
          </label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              update("name", e.target.value)
            }
            className="input"
          />

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
                onChange={handleImageChange}
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

          {!isEdit && (
            <>
              <div className="h-px bg-[#dde3dc] my-[18px]" />

              <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold mb-3">
                Pack size
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
                    <option>G</option>
                    <option>KG</option>
                    <option>ML</option>
                    <option>L</option>
                    <option>PCS</option>
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
                    Selling price (₹)
                  </label>

                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.sellingPrice}
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
                  Initial stock (units)
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

          {isEdit && (
            <div className="mt-4 flex items-center gap-2">
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