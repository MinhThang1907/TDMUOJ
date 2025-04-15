import React from "react";
import { Modal, message, Avatar, Button, Slider, Input, Space } from "antd";
import AvatarEditor from "react-avatar-editor";
import axios from "axios";

import * as env from "../env.js";

const ChangeAvatar = ({ picture, setPicture, fetchProfile }) => {
  const user = localStorage.getItem("dataUser")
    ? JSON.parse(localStorage.getItem("dataUser"))
    : null;

  const handleCancel = () => {
    setPicture({
      ...picture,
      cropperOpen: false,
    });
  };

  const [messageApi, contextHolder] = message.useMessage();

  var editor = "";
  const setEditorRef = (ed) => {
    editor = ed;
  };

  const handleSave = async (e) => {
    if (setEditorRef) {
      const canvasScaled = editor.getImageScaledToCanvas();
      canvasScaled.toBlob(async (blob) => {
        if (!blob) {
          console.error("Failed to convert canvas to blob");
          return;
        }
        try {
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

          const imageUrl = response.data.secure_url;
          await axios
            .put(env.API_URL + "/update-avatar", {
              id: user._id,
              avatar: imageUrl,
            })
            .then(function (response) {
              axios
                .get(env.API_URL + "/account", {})
                .then(async function (response) {
                  let checkExist = await response.data.dataAccounts.find(
                    (x) => x._id === user._id
                  );
                  if (checkExist) {
                    localStorage.setItem(
                      "dataUser",
                      JSON.stringify(checkExist)
                    );
                    setPicture({
                      ...picture,
                      img: checkExist.avatar,
                      cropperOpen: false,
                      croppedImg: checkExist.avatar,
                    });
                    messageApi.success("Cập nhật ảnh đại diện thành công");
                    fetchProfile();
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            })
            .catch(function (error) {
              console.log(error);
            });
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      });
    }
  };

  const handleSlider = (value) => {
    setPicture({
      ...picture,
      zoom: value,
    });
  };

  const handleFileChange = (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    // console.log(url);
    setPicture({
      ...picture,
      img: url,
      cropperOpen: true,
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Thay đổi ảnh đại diện"
        open={picture.cropperOpen}
        onCancel={handleCancel}
        footer={null}
        className="flex justify-center"
      >
        {picture.cropperOpen && (
          <div display="block">
            <AvatarEditor
              ref={setEditorRef}
              image={picture.img}
              width={200}
              height={200}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              rotate={0}
              scale={picture.zoom}
            />
            <Slider
              aria-label="raceSlider"
              value={picture.zoom}
              min={1}
              max={10}
              step={0.1}
              onChange={handleSlider}
            ></Slider>
            <div className="flex justify-end">
              <Space>
                <Button variant="contained" onClick={handleCancel}>
                  Hủy
                </Button>
                <Button
                  className="bg-sky-500 text-white hover:bg-sky-300"
                  onClick={handleSave}
                >
                  Lưu
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
      <div>
        <Avatar
          src={picture.croppedImg}
          style={{ width: "50%", height: "auto", padding: "5" }}
        />
        <div className="mt-3">
          <Input
            id="file-input"
            type="file"
            value={""}
            accept="image/*"
            onChange={handleFileChange}
            className="mt-3"
          />
        </div>
      </div>
    </>
  );
};
export default ChangeAvatar;
