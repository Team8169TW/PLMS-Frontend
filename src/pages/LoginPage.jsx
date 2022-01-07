import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ExpiredStorage from "expired-storage";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { Toast } from "../units/Alert";
import "../css/LoginPage.css";
import API from "../API";

const expiredStorage = new ExpiredStorage();

export default function LoginPage() {
  const user = new ExpiredStorage().getJson("user");
  const history = useHistory();
  const [msg, setMsg] = useState("登入基本資訊載入中...");
  const [enable, setEnable] = useState(false);
  const [clientId, setClientId] = useState("");

  useEffect(async () => {
    if (user) {
      expiredStorage.removeItem("access_token");
      expiredStorage.removeItem("user");
      history.push("/login");
      Toast.fire({
        icon: "success",
        title: `${user.name} 登出成功！`,
      });
    }
    await API.get("/authInfo").then((res) => {
      if (res.status === 200) {
        setMsg("一鍵登入，簡單快速");
        setClientId(res.data.clientId);
        setEnable(true);
      }
    });
  }, [true]);

  return (
    <Container className="login-container">
      <h2>使用者登入</h2>
      <div className="Login">
        {enable && (
          <GoogleLogin
            className=""
            clientId={clientId}
            onSuccess={async (response) => {
              setMsg("身分驗證成功...");
              setEnable(false);
              await API.post("/auth/token", {
                id_token: response.tokenId,
              }).then((res) => {
                switch (res.status) {
                  case 200: {
                    // eslint-disable-next-line camelcase
                    const { access_token, expires_in } = res.data;
                    const { user: userInfo } = jwtDecode(access_token);
                    expiredStorage.setItem(
                      "access_token",
                      access_token,
                      expires_in
                    );
                    expiredStorage.setJson("user", userInfo, expires_in);
                    Toast.fire({
                      icon: "success",
                      title: `${userInfo.name} 歡迎回來`,
                    });
                    setTimeout(() => {
                      history.push("/index");
                      if (userInfo.role === "visitor") {
                        Swal.fire({
                          title: "功能受限",
                          html: `您目前的身分為 <code>訪客</code><br>若為團隊成員，請聯絡管理員協助您啟用帳號。<br>目前帳號：${userInfo.email}`,
                          icon: "warning",
                        });
                      }
                    }, 1500);
                    break;
                  }
                  default:
                    throw new Error();
                }
              });
            }}
            onFailure={(e) => {
              switch (e.error) {
                case "popup_blocked_by_browser":
                  setMsg(
                    "您使用的瀏覽器不能正常開啟 Google 登入畫面，請檢查是否有阻擋「彈出視窗」。"
                  );
                  break;
                case "popup_closed_by_user":
                  setMsg("請不要關閉 Google 登入彈出視窗！");
                  break;
                case "idpiframe_initialization_failed":
                  setEnable(false);
                  switch (e.details) {
                    case "Cookies are not enabled in current environment.":
                      setMsg("請在您的瀏覽器啟用 Cookie。");
                      break;
                    default:
                      setMsg("發生錯誤，請聯絡管理員！");
                      break;
                  }
                  break;
                default:
                  break;
              }
            }}
            onRequest={() => setMsg("登入進行中...")}
          />
        )}
        {msg !== "" && <p>{msg}</p>}
      </div>
    </Container>
  );
}
