import axios from "axios";
import Swal from "sweetalert2";
import ExpiredStorage from "expired-storage";

const productionBaseURL = "https://api.rnrs.deershark.com";
const developmentBaseURL = "http://localhost:3030";
const baseURL =
  process.env.NODE_ENV === "production"
    ? productionBaseURL
    : developmentBaseURL;

const instance = axios.create({
  baseURL,
  validateStatus(status) {
    return status < 500;
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = new ExpiredStorage().getItem("access_token");
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  },
  (err) => {
    Swal.fire({
      title: "伺服器錯誤!",
      text: "請洽詢 主辦單位 或 Deershark 。",
      icon: "error",
    });
    Promise.reject(err);
  }
);
instance.interceptors.response.use(
  (res) => {
    if (res.status === 401) {
      if (res.config.method !== "post" && res.config.url !== "/auth") {
        Swal.fire({
          title: "尚未登入!",
          text: "請先登入，或登入階段已逾期。",
          confirmButtonText: "登入去",
          icon: "error",
        }).then(() => {
          window.location = "/login";
        });
      }
    }
    if (res.status === 403) {
      Swal.fire({
        title: "權限錯誤!",
        text: "請先登入，或你沒有權限操作此功能。",
        icon: "error",
      });
    }
    return res;
  },
  (err) => {
    Swal.fire({
      title: "伺服器錯誤!",
      text: "請洽詢 主辦單位 或 Deershark 。",
      icon: "error",
    });
    Promise.reject(err);
  }
);

export default instance;
