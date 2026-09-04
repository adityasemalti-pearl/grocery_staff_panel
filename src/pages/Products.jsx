import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import ProductModal from "../components/ProductModal";
import AddVariantModal from "../components/AddVariantModal";
import ReceiveStockModal from "../components/ReceiveStockModal";
import {
  getCategories,
  getProducts,
  addProductVariant,
  updateProductVariant,
  getVariantInventory,
  receiveStock as receiveStockApi,
} from "../api/productApis";

export default function Products() {
  const [products, setProducts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [productModal, setProductModal] =
    useState(null);

  const [variantModal, setVariantModal] =
    useState(null);

  const [stockModal, setStockModal] =
    useState(null);

  const [toast, setToast] =
    useState("");

  const [inventoryByVariant, setInventoryByVariant] =
    useState({});

  const [inventoryLoading, setInventoryLoading] =
    useState(false);

  const [searchTimer, setSearchTimer] =
    useState(null);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const normalizeCategories = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    return [];
  };

  const normalizeProducts = (response) => {
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.items)) {
      return response.data.items;
    }

    return [];
  };

  const loadCategories = async () => {
    try {
      const response =
        await getCategories();

      const data =
        normalizeCategories(response);

      setCategories(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getProducts({
          limit: 100,
          search,
          categoryId: category,
        });

      const data =
        normalizeProducts(response);

      setProducts(data);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInventory = async (
    productList
  ) => {
    const variants =
      productList.flatMap(
        (product) =>
          product.variants || []
      );

    if (!variants.length) {
      setInventoryByVariant({});
      return;
    }

    try {
      setInventoryLoading(true);

      const results =
        await Promise.all(
          variants.map(async (variant) => {
            try {
              const response =
                await getVariantInventory(
                  variant.id
                );

              const inventory =
                response?.data ||
                response;

              return [
                variant.id,
                inventory,
              ];
            } catch {
              return [
                variant.id,
                null,
              ];
            }
          })
        );

      setInventoryByVariant(
        Object.fromEntries(results)
      );
    } finally {
      setInventoryLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    const timer = setTimeout(() => {
      loadProducts();
    }, 400);

    setSearchTimer(timer);

    return () => {
      clearTimeout(timer);
    };
  }, [search, category]);

  useEffect(() => {
    loadInventory(products);
  }, [products]);

  const getStock = (variant) => {
    const inventory =
      inventoryByVariant[variant.id];

    if (!inventory) {
      if (
        variant.stock !== undefined &&
        variant.stock !== null
      ) {
        return Number(variant.stock);
      }

      return null;
    }

    if (
      inventory.available !== undefined
    ) {
      return Number(
        inventory.available
      );
    }

    if (
      inventory.stock !== undefined
    ) {
      return Number(
        inventory.stock
      );
    }

    if (
      inventory.quantity !== undefined
    ) {
      return Number(
        inventory.quantity
      );
    }

    return 0;
  };

  const getStockStatus = (variant) => {
    const inventory =
      inventoryByVariant[variant.id];

    const stock = getStock(variant);

    if (inventory && inventory.isSellable === false) {
      return {
        text: "Not sellable",
        className:
          "bg-[#fbe9e7] text-[#b3382c]",
      };
    }

    if (stock === null) {
      return {
        text: inventoryLoading
          ? "Loading..."
          : "No record",
        className:
          "bg-[#dde3dc] text-[#5b6960]",
      };
    }

    if (stock <= 0) {
      return {
        text: "Out of stock",
        className:
          "bg-[#fbe9e7] text-[#b3382c]",
      };
    }

    const threshold =
      inventory?.effectiveLowStockThreshold ??
      inventory?.lowStockThreshold ??
      10;

    if (stock <= threshold) {
      return {
        text: `${stock} units`,
        className:
          "bg-[#fdf0d5] text-[#8a5a00]",
      };
    }

    return {
      text: `${stock} units`,
      className:
        "bg-[#e4f3e0] text-[#2f7a4f]",
    };
  };

  const handleProductSuccess = async (
    message
  ) => {
    setProductModal(null);
    showToast(message);
    await loadProducts();
  };

  const handleAddVariant = async (
    productId,
    variantData
  ) => {
    await addProductVariant(
      productId,
      variantData
    );

    showToast(
      "Pack size added successfully"
    );

    await loadProducts();
  };

  const handleReceiveStock = async (
    variantId,
    stockData
  ) => {
    await receiveStockApi(
      variantId,
      stockData
    );

    showToast(
      "Stock added successfully"
    );

    await loadProducts();
  };

  const handleVariantUpdate = async (
    productId,
    variantId,
    data
  ) => {
    try {
      await updateProductVariant(
        productId,
        variantId,
        data
      );

      showToast(
        "Pack size updated successfully"
      );

      await loadProducts();
    } catch (err) {
      showToast(
        err.message,
        true
      );
    }
  };

  const categoryName = (product) => {
    if (product.category?.name) {
      return product.category.name;
    }

    if (product.categoryName) {
      return product.categoryName;
    }

    const found =
      categories.find(
        (cat) =>
          String(cat.id) ===
          String(product.categoryId)
      );

    return (
      found?.name ||
      "Uncategorized"
    );
  };

  const productImage = (product) => {
    return (
      product.imageUrl ||
      product.image ||
      product.productImage ||
      ""
    );
  };

  const filteredProducts = useMemo(() => {
    return products;
  }, [products]);

  return (
    <Layout
      staffName={
        localStorage.getItem(
          "staffName"
        ) || "Staff"
      }
    >
      <main className="max-w-[1180px] mx-auto px-5 py-5">
        <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search products or scan SKU…"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-[240px] px-3.5 py-2 border border-[#dde3dc] rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-[#1b7340]"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-[200px] px-3.5 py-2 border border-[#dde3dc] rounded-lg bg-white text-sm outline-none"
            >
              <option value="">
                All categories
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

          <button
            onClick={() =>
              setProductModal({
                mode: "add",
              })
            }
            className="bg-[#1b7340] hover:bg-[#124d2a] text-white rounded-lg px-[18px] py-2.5 font-semibold text-sm"
          >
            + Add Product
          </button>
        </div>

        {error && (
          <div className="bg-[#fbe9e7] text-[#b3382c] px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-[#dde3dc] rounded-xl p-10 text-center text-[#5b6960]">
            Loading products...
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredProducts.map(
              (product) => {
                const image =
                  productImage(
                    product
                  );

                const active =
                  product.isActive !==
                  undefined
                    ? product.isActive
                    : product.active !==
                      undefined
                    ? product.active
                    : true;

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-[#dde3dc] rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start gap-3 mb-2.5">
                      <div className="flex gap-3">
                        <div className="w-14 h-14 rounded-lg bg-[#f7f8f4] border border-[#dde3dc] flex items-center justify-center overflow-hidden">
                          {image ? (
                            <img
                              src={image}
                              alt={
                                product.name
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-[#5b6960]">
                              No photo
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-base">
                            {
                              product.name
                            }
                          </div>

                          <div className="text-[#5b6960] text-[13px] mt-0.5">
                            {categoryName(
                              product
                            )}{" "}
                            ·{" "}
                            {
                              (
                                product.variants ||
                                []
                              ).length
                            }{" "}
                            pack size
                            {(
                              product.variants ||
                              []
                            ).length !==
                            1
                              ? "s"
                              : ""}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            active
                              ? "bg-[#e4f3e0] text-[#2f7a4f]"
                              : "bg-[#dde3dc] text-[#5b6960]"
                          }`}
                        >
                          {active
                            ? "Active"
                            : "Inactive"}
                        </span>

                        <button
                          onClick={() =>
                            setProductModal(
                              {
                                mode: "edit",
                                product,
                              }
                            )
                          }
                          className="px-3 py-1.5 border border-[#dde3dc] rounded-lg text-xs font-semibold hover:border-[#1b7340] hover:text-[#1b7340]"
                        >
                          Edit
                        </button>
                      </div>
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
                              "",
                            ].map(
                              (
                                heading,
                                index
                              ) => (
                                <th
                                  key={`${heading}-${index}`}
                                  className="text-left text-[11px] uppercase tracking-wider text-[#5b6960] p-2 border-b border-[#dde3dc]"
                                >
                                  {
                                    heading
                                  }
                                </th>
                              )
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {(
                            product.variants ||
                            []
                          ).map(
                            (variant) => {
                              const stockStatus =
                                getStockStatus(
                                  variant
                                );

                              const variantActive =
                                variant.isActive !==
                                undefined
                                  ? variant.isActive
                                  : true;

                              return (
                                <tr
                                  key={
                                    variant.id
                                  }
                                >
                                  <td className="p-2 border-b border-[#dde3dc] text-sm">
                                    <div className="flex items-center gap-2">
                                      <span>
                                        {
                                          variant.sku
                                        }
                                      </span>

                                      {!variantActive && (
                                        <span className="px-2 py-0.5 rounded-full bg-[#dde3dc] text-[#5b6960] text-[10px] font-semibold">
                                          Inactive
                                        </span>
                                      )}
                                    </div>
                                  </td>

                                  <td className="p-2 border-b border-[#dde3dc] text-sm">
                                    {
                                      variant.weight
                                    }{" "}
                                    {
                                      variant.unit
                                    }
                                  </td>

                                  <td className="p-2 border-b border-[#dde3dc] text-sm">
                                    ₹
                                    {Number(
                                      variant.mrp
                                    ).toFixed(
                                      2
                                    )}
                                  </td>

                                  <td className="p-2 border-b border-[#dde3dc] text-sm font-semibold">
                                    ₹
                                    {Number(
                                      variant.sellingPrice ??
                                        variant.price
                                    ).toFixed(
                                      2
                                    )}
                                  </td>

                                  <td className="p-2 border-b border-[#dde3dc] text-sm">
                                    <span
                                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${stockStatus.className}`}
                                    >
                                      {
                                        stockStatus.text
                                      }
                                    </span>
                                  </td>

                                  <td className="p-2 border-b border-[#dde3dc]">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() =>
                                          setStockModal(
                                            {
                                              productId:
                                                product.id,
                                              variant,
                                              productName:
                                                product.name,
                                            }
                                          )
                                        }
                                        className="px-3 py-1.5 border border-[#dde3dc] rounded-lg text-xs font-semibold hover:border-[#1b7340] hover:text-[#1b7340]"
                                      >
                                        + Stock
                                      </button>

                                      <button
                                        onClick={() =>
                                          handleVariantUpdate(
                                            product.id,
                                            variant.id,
                                            {
                                              isActive:
                                                !variantActive,
                                            }
                                          )
                                        }
                                        className="px-3 py-1.5 border border-[#dde3dc] rounded-lg text-xs font-semibold hover:border-[#1b7340] hover:text-[#1b7340]"
                                      >
                                        {variantActive
                                          ? "Deactivate"
                                          : "Activate"}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() =>
                          setVariantModal(
                            {
                              productId:
                                product.id,
                              productName:
                                product.name,
                            }
                          )
                        }
                        className="px-3 py-1.5 border border-[#dde3dc] rounded-lg text-xs font-semibold hover:border-[#1b7340] hover:text-[#1b7340]"
                      >
                        + Add pack size
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

        {!loading &&
          filteredProducts.length ===
            0 && (
            <div className="text-center text-[#5b6960] py-16">
              No products found.
            </div>
          )}
      </main>

      {productModal && (
        <ProductModal
          categories={categories}
          product={
            productModal.mode ===
            "edit"
              ? productModal.product
              : null
          }
          onClose={() =>
            setProductModal(null)
          }
          onSuccess={
            handleProductSuccess
          }
        />
      )}

      {variantModal && (
        <AddVariantModal
          productName={
            variantModal.productName
          }
          onClose={() =>
            setVariantModal(null)
          }
          onSave={(data) =>
            handleAddVariant(
              variantModal.productId,
              data
            )
          }
        />
      )}

      {stockModal && (
        <ReceiveStockModal
          productName={
            stockModal.productName
          }
          variant={
            stockModal.variant
          }
          onClose={() =>
            setStockModal(null)
          }
          onSave={(data) =>
            handleReceiveStock(
              stockModal.variant.id,
              data
            )
          }
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1b1f1c] text-white px-5 py-3 rounded-lg text-sm z-50">
          {toast}
        </div>
      )}
    </Layout>
  );
}