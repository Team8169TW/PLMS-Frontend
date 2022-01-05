import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import ExpiredStorage from "expired-storage";
import jwtDecode from "jwt-decode";
import { useHistory } from "react-router-dom";
import API from "../API";
import { Toast } from "../units/Alert";

export default function LoginForm() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return account.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = { account, password };
    await API.post("/auth", payload)
      .then((res) => {
        switch (res.status) {
          case 200: {
            // eslint-disable-next-line camelcase
            const { access_token, expires_in } = res.data;
            const expiredStorage = new ExpiredStorage();
            const { user } = jwtDecode(access_token);
            expiredStorage.setItem("access_token", access_token, expires_in);
            expiredStorage.setJson("user", user, expires_in);
            Toast.fire({
              icon: "success",
              title: `${user.name} 歡迎回來`,
            });
            setTimeout(() => {
              history.push("/index");
            }, 1500);
            break;
          }
          case 401:
            Swal.fire({
              title: "登入失敗!",
              text: "使用者帳號或密碼錯誤。",
              icon: "error",
            });
            break;
          default:
            throw new Error();
        }
      })
      .catch(() => {});
  }

  return (
    <div className="Login">
      <Form onSubmit={(e) => handleSubmit(e)}>
        <h2>使用者登入</h2>
        <Form.Group size="lg" controlId="account">
          <Form.Label>帳號</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            /* value={account} */
            onChange={(e) => setAccount(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>密碼</Form.Label>
          <Form.Control
            type="password"
            /* value={password} */
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button
          block
          size="lg"
          type="submit"
          disabled={!validateForm()}
          className="btn-rnrs"
        >
          登入
        </Button>
      </Form>
    </div>
  );
}
