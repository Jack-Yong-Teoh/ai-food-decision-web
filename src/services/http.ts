import axios, { AxiosResponse } from "axios";

const http = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Add a response interceptor to perform "redirect" signal from route handler
http.interceptors.response.use(
  (response) => {
    // If the response has a redirect instruction, handle it
    if (response.data?.redirectTo) {
      if (typeof window !== "undefined") {
        window.location.href = response.data.redirectTo;
      }
    }
    return response;
  },
  (error) => {
    // Also handle redirect on error response
    if (error.response?.data?.redirectTo) {
      if (typeof window !== "undefined") {
        window.location.href = error.response?.data?.redirectTo;
      }
    }
    return Promise.reject(error);
  }
);

export const httpSubmitForm = async ({
  endpoint,
  formData,
  method,
}: {
  formData: FormData;
  endpoint: string;
  method: "post" | "put" | "patch";
}): Promise<AxiosResponse> =>
  await http({
    method: method,
    url: endpoint,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });

export default http;
