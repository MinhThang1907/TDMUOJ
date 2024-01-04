import React, { useState } from "react";
import axios from "axios";

import * as env from "../env.js";

function Test() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const addAccount = () => {
    axios
      .post(env.API_URL + "/account", {
        username: username,
        password: password,
        email: email,
      })
      .then(function (response) {
        console.log("success");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getAllAccount = () => {
    axios
      .get(env.API_URL + "/account", {})
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateAccount = () => {
    let pass = "1";
    let mail = "thangcdnguyen@gmail.com";
    axios
      .put(env.API_URL + "/update-account", {
        id: "6596b251a4395521f0b7f949",
        password: pass,
        email: mail,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteAccount = () => {
    axios
      .put(env.API_URL + "/delete-account", {
        id: "6596b251a4395521f0b7f949",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div>
      <input type="text" onChange={(e) => setUsername(e.target.value)} />
      <input type="text" onChange={(e) => setPassword(e.target.value)} />
      <input type="text" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={addAccount}>click</button>
      <button onClick={getAllAccount}>click</button>
      <button onClick={updateAccount}>click</button>
      <button onClick={deleteAccount}>click</button>
    </div>
  );
}

export default Test;
