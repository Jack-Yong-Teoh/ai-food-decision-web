"use client";
import React from "react";

import { logIn } from "@/services/api/auth";
const Login = () => {
  const params = {
    username: "xxxxxxx", // use your username
    password: "xxxxxxxx", // use your password
  };

  const onSubmitLogin = async () => {
    await logIn(params)
      .then((res) => {
        console.log("res from login ", res);
      })
      .catch((error) => {
        console.error("error ", error);
      });
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={() => {
          onSubmitLogin();
        }}
      >
        Login
      </button>
    </div>
  );
};

export default Login;
