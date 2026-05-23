import api from "./api";

export const getUsers = async () => {
  const res = await api.get("/api/auth/userlist");
  return res.data;
};

export const updateProfile = async (userId, profileData) => {
  const res = await api.put(`/api/auth/user/${userId}`, profileData);
  return res.data;
};
