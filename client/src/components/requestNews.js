import { Button, Divider, Input, message } from "antd";
import React, { useState } from "react";

import * as env from "../env.js";
import axios from "axios";

export default function RequestNews() {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;
  const [messageApi, contextHolder] = message.useMessage();
  const successMessage = ({ content }) => {
    messageApi.open({
      type: "success",
      content: content,
    });
  };
  const errorMessage = ({ content }) => {
    messageApi.open({
      type: "error",
      content: content,
    });
  };

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [uploadImageError, setUploadImageError] = useState(false);

  const imagebase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const data = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });
    return data;
  };
  async function dataURLtoBlob(dataURL) {
    // fetch sẽ tự parse Data URL và trả về Response
    const res = await fetch(dataURL);
    return await res.blob();
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const fileType = file["type"];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (validImageTypes.includes(fileType)) {
      setUploadImageError(false);
      const img = await imagebase64(file);
      setImage(img);
    } else {
      setUploadImageError(true);
    }
  };
  const requestNews = async () => {
    if (title === "" || content === "") {
      errorMessage({ content: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    try {
      let imageUrl = "";
      if (image) {
        const blob = await dataURLtoBlob(image);
        if (!blob) {
          console.error("Failed to convert canvas to blob");
          return;
        }
        const formData = new FormData();
        formData.append("file", blob, "avatar.jpg");

        if (!env.UPLOAD_PRESET || !env.CLOUD_NAME) {
          throw new Error("Missing Cloudinary environment variables");
        }

        formData.append("upload_preset", env.UPLOAD_PRESET);
        formData.append("cloud_name", env.CLOUD_NAME);

        const apiUrl = `https://api.cloudinary.com/v1_1/${env.CLOUD_NAME}/image/upload`;

        const response = await axios.post(apiUrl, formData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        });

        imageUrl = response.data.secure_url;
      }
      await axios
        .post(env.API_URL + "/news", {
          title: title,
          content: content,
          image: imageUrl,
          idUser: user._id,
          pending: false,
        })
        .then(function (response) {
          setTitle("");
          setContent("");
          setImage("");
          successMessage({ content: "Đã yêu cầu đăng tin tức thành công" });
        })
        .catch(function (error) {
          console.log(error);
          errorMessage({ content: "Gửi yêu cầu thất bại" });
        });
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  return (
    <div className="col-span-4 sm:col-span-9">
      {contextHolder}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-8">
          <div className="relative flex items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center">
            <div className="inline-flex rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
              <div className="justify-center w-[500px] flex">
                <div className="w-[500px] max-w-4xl">
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                        Tiêu đề
                      </label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <Divider />
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                        Nội dung
                      </label>
                      <Input.TextArea
                        autoSize
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                  <Divider />
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                      <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
                        Hình ảnh (Nếu có)
                      </label>
                      <Input
                        type="file"
                        onChange={handleUploadImage}
                        value={""}
                      />
                      {image !== "" && (
                        <img src={image} className="mt-5" alt="" />
                      )}
                      {uploadImageError && (
                        <div class="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                          Vui lòng chọn tệp hình ảnh hợp lệ (jpg, jpeg, png)
                        </div>
                      )}
                    </div>
                  </div>
                  <Divider />
                  <div className="flex items-center justify-center">
                    <Button size="large" onClick={requestNews}>
                      Gửi yêu cầu
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
