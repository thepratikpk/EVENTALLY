import { API } from "../lib/axios"


 const getUserByUsername = async (username) => {
  const res = await API.get(`/auth/superadmin/search?username=${username}`);
  return res.data.data;
};

 const updateUserRole = async (id, role) => {
  const res = await API.patch(`/auth/superadmin/${id}/role`, { role });
  return res.data.data;
};


export {
   getUserByUsername,
   updateUserRole
}