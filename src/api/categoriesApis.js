import api from "./axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

/*
 * GET endpoints on /categories are public (no auth required by the
 * backend). The shared axios instance will still attach an Authorization
 * header if a staff session happens to exist in localStorage — that's
 * harmless for a public route, so no special-casing is needed here.
 */

export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error(getErrorMessage(error, "Failed to load categories."));
  }
};

export const getCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error(getErrorMessage(error, "Failed to load category."));
  }
};

export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error(getErrorMessage(error, "Failed to create category."));
  }
};

export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.patch(
      `/categories/${categoryId}`,
      categoryData
    );

    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error(getErrorMessage(error, "Failed to update category."));
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error(getErrorMessage(error, "Failed to delete category."));
  }
};