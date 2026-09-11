import api from "./axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  fallback;

/*
 * GET endpoints on /brands are public (no auth required by the backend).
 * The shared axios instance will still attach an Authorization header if a
 * staff session happens to exist in localStorage — that's harmless for a
 * public route, so no special-casing is needed here.
 */

export const getBrands = async () => {
  try {
    const response = await api.get("/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw new Error(getErrorMessage(error, "Failed to load brands."));
  }
};

export const getBrand = async (brandId) => {
  try {
    const response = await api.get(`/brands/${brandId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw new Error(getErrorMessage(error, "Failed to load brand."));
  }
};

export const createBrand = async (brandData) => {
  try {
    const response = await api.post("/brands", brandData);
    return response.data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw new Error(getErrorMessage(error, "Failed to create brand."));
  }
};

export const updateBrand = async (brandId, brandData) => {
  try {
    const response = await api.patch(`/brands/${brandId}`, brandData);
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw new Error(getErrorMessage(error, "Failed to update brand."));
  }
};

export const deleteBrand = async (brandId) => {
  try {
    const response = await api.delete(`/brands/${brandId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw new Error(getErrorMessage(error, "Failed to delete brand."));
  }
};