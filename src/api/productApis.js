import api from "./axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

export const getBrands = async () => {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
  }
};

export const getProducts = async ({
  limit = 100,
  search = "",
  categoryId = "",
} = {}) => {
  try {
    const params = {
      limit,
    };

    if (search) {
      params.search = search;
    }

    if (categoryId) {
      params.categoryId = categoryId;
    }

    const response = await api.get("/products", {
      params,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

/*
 * Both create and update now carry images directly on the /products route
 * as multipart/form-data (name, slug, description, brandId, categoryId,
 * variants as a JSON string, and one or more "images" files) — see the
 * sample payload you tested with. There is no separate image-upload step
 * anymore; whatever FormData the caller builds (see ProductModal) is sent
 * as-is. The axios instance strips the default JSON Content-Type for any
 * FormData body, so the browser can set the correct multipart boundary.
 */

export const createProduct = async (formData) => {
  try {
    const response = await api.post("/products", formData);

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(getErrorMessage(error, "Failed to create product."));
  }
};

export const updateProduct = async (productId, formData) => {
  try {
    const response = await api.patch(
      `/products/${productId}`,
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(getErrorMessage(error, "Failed to update product."));
  }
};

export const addProductVariant = async (productId, variantData) => {
  try {
    const response = await api.post(
      `/products/${productId}/variants`,
      variantData,
    );

    return response.data;
  } catch (error) {
    console.error("Error adding variant:", error);
    throw new Error(getErrorMessage(error, "Failed to add pack size."));
  }
};

export const updateProductVariant = async (
  productId,
  variantId,
  variantData,
) => {
  try {
    const response = await api.patch(
      `/products/${productId}/variants/${variantId}`,
      variantData,
    );

    return response.data;
  } catch (error) {
    console.error("Error updating variant:", error);
    throw new Error(getErrorMessage(error, "Failed to update pack size."));
  }
};

export const getVariantInventory = async (variantId) => {
  try {
    const response = await api.get(`/inventory/${variantId}`);

    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
  }
};

export const receiveStock = async (variantId, stockData) => {
  try {
    const response = await api.post(
      `/inventory/${variantId}/receive`,
      stockData,
    );

    return response.data;
  } catch (error) {
    console.error("Error receiving stock:", error);
    throw new Error(getErrorMessage(error, "Failed to add stock."));
  }
};

/**
 * Uploads a single image and returns its public URL.
 * Still used by AddVariantModal for per-variant photos — only the
 * product-level photos (product create/update) moved to the multipart
 * /products flow. productId is optional and simply omitted when absent,
 * rather than being sent as the literal string "undefined".
 */
export const uploadProductImage = async (file, productId) => {
  try {
    const formData = new FormData();

    formData.append("file", file);

    if (productId) {
      formData.append("productId", productId);
    }

    const response = await api.post(
      "/uploads/product-image",
      formData
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(getErrorMessage(error, "Failed to upload image."));
  }
};

export const getAllOrders = async () => {
  try {
    const response = await api.get("/orders");

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};