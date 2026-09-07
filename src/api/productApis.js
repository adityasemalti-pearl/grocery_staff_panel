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
    console.error("Image upload error:", error);
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Image upload error:", error);
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.patch(`/products/${productId}`, productData);

    return response.data;
  } catch (error) {
    console.error("Image upload error:", error);
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
    console.error("Image upload error:", error);
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
    console.error("Image upload error:", error);
  }
};

export const getVariantInventory = async (variantId) => {
  try {
    const response = await api.get(`/inventory/${variantId}`);

    return response.data;
  } catch (error) {
    console.error("Image upload error:", error);
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
    console.error("Image upload error:", error);
  }
};

export const uploadProductImage = async (file, productId) => {
  try {
    const formData = new FormData();
  

    formData.append("file", file);
    formData.append("productId", productId);

    const response = await api.post("/uploads/product-image", formData);

    return response.data;
  } catch (error) {
    console.error("Image upload error:", error);
  }
};




export const getAllOrders = async () => {
  try {
    const response = await api.get('/orders');

    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};