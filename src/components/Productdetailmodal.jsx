import { useState } from "react";

export default function ProductDetailModal({
  product,
  getStockStatus,
  onClose,
  onEdit,
}) {
  const [activeImage, setActiveImage] = useState(0);

  if (!product) return null;

  const images =
    Array.isArray(product.images) && product.images.length
      ? product.images
      : [
          product.imageUrl ||
            product.image ||
            product.productImage ||
            "",
        ].filter(Boolean);

  const active =
    product.isActive !== undefined
      ? product.isActive
      : product.active !== undefined
      ? product.active
      : true;

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const mainImage = images[activeImage] || images[0] || "";

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,38,32,0.45)] flex items-start justify-center px-4 py-6 overflow-y-auto z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[14px] max-w-[820px] w-full p-6 mt-5 mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right text-2xl text-[#5b6960]"
        >
          ×
        </button>

        <div className="flex items-start justify-between gap-3 pr-8">
          <div>
            <h2 className="font-['Baloo_2'] text-xl font-bold">
              {product.name}
            </h2>

            <div className="text-[#5b6960] text-sm mt-1">
              {product.brand?.name && (
                <>{product.brand.name} · </>
              )}
              {product.category?.name || "Uncategorized"}
            </div>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              active
                ? "bg-[#e4f3e0] text-[#2f7a4f]"
                : "bg-[#dde3dc] text-[#5b6960]"
            }`}
          >
            {active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* PHOTO GALLERY */}

        <div className="mt-5">
          <div className="w-full h-64 rounded-xl bg-[#f7f8f4] border border-[#dde3dc] overflow-hidden flex items-center justify-center">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-sm text-[#5b6960]">
                No photo available
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-2.5 flex-wrap">
              {images.map((url, index) => (
                <button
                  key={url + index}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 ${
                    index === activeImage
                      ? "border-[#1b7340]"
                      : "border-[#dde3dc]"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DESCRIPTION + META */}

        <div className="h-px bg-[#dde3dc] my-5" />

        <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold mb-2">
          Description
        </p>

        <p className="text-sm text-[#1b1f1c] mb-4 whitespace-pre-wrap">
          {product.description || "No description provided."}
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-[#5b6960]">Slug: </span>
            {product.slug || "—"}
          </div>

          <div>
            <span className="text-[#5b6960]">Product ID: </span>
            {product.id}
          </div>

          <div>
            <span className="text-[#5b6960]">Created: </span>
            {formatDate(product.createdAt)}
          </div>

          <div>
            <span className="text-[#5b6960]">Last updated: </span>
            {formatDate(product.updatedAt)}
          </div>
        </div>

        {/* VARIANTS */}

        <div className="h-px bg-[#dde3dc] my-5" />

        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-wider text-[#5b6960] font-semibold">
            Pack Sizes / Variants
          </p>

          <span className="text-xs text-[#5b6960]">
            {(product.variants || []).length} variant
            {(product.variants || []).length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {[
                  "SKU",
                  "Pack",
                  "MRP",
                  "Price",
                  "Stock",
                  "Status",
                ].map((heading, index) => (
                  <th
                    key={`${heading}-${index}`}
                    className="text-left text-[11px] uppercase tracking-wider text-[#5b6960] p-2 border-b border-[#dde3dc]"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {(product.variants || []).map((variant) => {
                const stockStatus = getStockStatus
                  ? getStockStatus(variant)
                  : {
                      text: "—",
                      className: "bg-[#dde3dc] text-[#5b6960]",
                    };

                const variantActive =
                  variant.isActive !== undefined
                    ? variant.isActive
                    : true;

                const variantAvailable =
                  variant.isAvailable !== undefined
                    ? variant.isAvailable
                    : true;

                return (
                  <tr key={variant.id}>
                    <td className="p-2 border-b border-[#dde3dc] text-sm">
                      {variant.sku}
                    </td>

                    <td className="p-2 border-b border-[#dde3dc] text-sm">
                      {variant.weight} {variant.unit}
                    </td>

                    <td className="p-2 border-b border-[#dde3dc] text-sm">
                      ₹{Number(variant.mrp).toFixed(2)}
                    </td>

                    <td className="p-2 border-b border-[#dde3dc] text-sm font-semibold">
                      ₹
                      {Number(
                        variant.sellingPrice ?? variant.price
                      ).toFixed(2)}
                    </td>

                    <td className="p-2 border-b border-[#dde3dc] text-sm">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.className}`}
                      >
                        {stockStatus.text}
                      </span>
                    </td>

                    <td className="p-2 border-b border-[#dde3dc] text-sm">
                      <div className="flex gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            variantActive
                              ? "bg-[#e4f3e0] text-[#2f7a4f]"
                              : "bg-[#dde3dc] text-[#5b6960]"
                          }`}
                        >
                          {variantActive ? "Active" : "Inactive"}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            variantAvailable
                              ? "bg-[#e4f3e0] text-[#2f7a4f]"
                              : "bg-[#fdf0d5] text-[#8a5a00]"
                          }`}
                        >
                          {variantAvailable
                            ? "For sale"
                            : "Not for sale"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2.5 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-[#dde3dc] rounded-lg font-semibold"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="flex-1 py-3 bg-[#1b7340] hover:bg-[#124d2a] text-white rounded-lg font-semibold"
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}