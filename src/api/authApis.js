import api from "./axios";

export const staffLogin = async (credentials) => {
  const response = await api.post(
    "/auth/staff/login",
    credentials
  );

  return response.data;
};
