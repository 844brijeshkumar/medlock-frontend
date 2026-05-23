import api from "./api";

export const loginUser = async (credentials) => {
  const res = await api.post("/.netlify/functions/patientLogin", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await api.post("/.netlify/functions/patientRegister", userData);
  return res.data;
};

export const loginDoctor = async (userData) => {
  const res = await api.post("/.netlify/functions/doctorLogin", userData);
  return res.data;
};

export const loginAdmin = async (userData) => {
  const res = await api.post("/.netlify/functions/loginAdmin", userData);
  return res.data;
};

export const doctorRegister = async (token, userData) => {
  const res = await api.post("/.netlify/functions/doctorRegister", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const doctorUpdate = async (token, userData) => {
  const res = await api.post("/.netlify/functions/doctorUpdate", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const receptionistUpdate = async (token, userData) => {
  const res = await api.post("/.netlify/functions/receptionistUpdate", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};
export const hospitalUpdate = async (token, userData) => {
  const res = await api.post("/.netlify/functions/hospitalUpdate", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const registerReceptionist = async (token, userData) => {
  const res = await api.post("/.netlify/functions/registerReceptionist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const hospitalRegister = async (token, userData) => {
  const res = await api.post("/.netlify/functions/hospitalRegister", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const loginHospital = async (userData) => {
  const res = await api.post("/.netlify/functions/hospitalLogin", userData);
  return res.data;
};

export const createReport = async (token, userData) => {
  const res = await api.post("/.netlify/functions/createReport", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getDoctorsByHospital = async (token) => {
  const res = await api.get("/.netlify/functions/getDoctorsByHospital", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
export const getReceptionistsByHospital = async (token) => {
  const res = await api.get("/.netlify/functions/getReceptionistsByHospital", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getReportsByHospital = async (token) => {
  const res = await api.get("/.netlify/functions/getReportsByHospital", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getReportsByDoctor = async (token) => {
  const res = await api.get("/.netlify/functions/getReportsByDoctor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getReportsByPatient = async (token, id) => {
  const res = await api.get(
    `/.netlify/functions/getReportsByPatient?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const hospitalSearch = async (
  token,
  selectedState,
  selectedDistrict,
  debouncedSearch,
  id,
) => {
  const res = await api.get(
    `/.netlify/functions/hospitalSearch?state=${selectedState}&district=${selectedDistrict}&search=${debouncedSearch}&id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const createOpdTicket = async (
  token,
  Id,
  slot,
  department,
  hospitalName,
) => {
  const res = await api.post(
    `/.netlify/functions/createOpdTicket?hospitalId=${Id}&slot=${slot}&department=${department}&hospitalName=${hospitalName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};
export const getPartners = async () => {
  const res = await api.get("/.netlify/functions/getPartners");
  return res.data;
};

export const loginReceptionist = async (credentials) => {
  const res = await api.post(
    "/.netlify/functions/loginReceptionist",
    credentials,
  );
  return res.data;
};

export const getAppointmentsByReceptionist = async (token) => {
  const res = await api.get(
    "/.netlify/functions/getAppointmentsByReceptionist",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getAppointmentsByPatient = async (token, id) => {
  const res = await api.get(
    `/.netlify/functions/getAppointmentsByPatient?id=${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getHospitalForAdmin = async (token) => {
  const res = await api.get("/.netlify/functions/getHospitalForAdmin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getDoctorForAdmin = async (token) => {
  const res = await api.get("/.netlify/functions/getDoctorForAdmin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getReceptionistForAdmin = async (token) => {
  const res = await api.get("/.netlify/functions/getReceptionistForAdmin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getTheme = async (token) => {
  const res = await api.get("/.netlify/functions/getTheme", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateAppointmentsByReceptionist = async (token, userData) => {
  const res = await api.post(
    "/.netlify/functions/updateAppointmentsByReceptionist",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: userData,
    },
  );
  return res.data;
};

export const transferDoctor = async (token, userData) => {
  const res = await api.post("/.netlify/functions/transferDoctor", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const transferReceptionist = async (token, userData) => {
  const res = await api.post("/.netlify/functions/transferReceptionist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};
export const sendOtpForReport = async (token, userData) => {
  const res = await api.post("/.netlify/functions/sendOtpForReport", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const verifyOtpForReport = async (token, userData) => {
  const res = await api.post("/.netlify/functions/verifyOtpForReport", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};
export const logoutUser = async () => {
  // This call triggers the backend to clear the HttpOnly cookie
  const res = await api.post("/.netlify/functions/logout");
  return res.data;
};

export const getAdmins = async () => {
  const res = await api.post("/.netlify/functions/getAdmins");
  return res.data;
};

export const verifyPatientAdhaar = async (token, userData) => {
  const res = await api.post("/.netlify/functions/verifyPatientAdhaar", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const patientSettings = async (token, userData) => {
  const res = await api.post("/.netlify/functions/patientSettings", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: userData,
  });
  return res.data;
};

export const getPatient = async (token) => {
  const res = await api.get("/.netlify/functions/getPatient", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
