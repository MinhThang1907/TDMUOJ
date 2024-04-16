import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

function Test() {
  const run = async () => {
    const channelId = "UCyPlQUSLH4NzrxruIjEBsug";
    const part = "snippet";
    const key = "AIzaSyBIbycqky8fGBC6JP_cvOB_E19gatIJrPw";
    await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?part=${part}&channelId=${channelId}&key=${key}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("playlist: ", data);
        data.items.forEach(async (element) => {
          await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=${part}&playlistId=${element.id}&key=${key}`
          )
            .then((response) => response.json())
            .then((data) => {
              data.items.forEach(async (element) => {
                console.log("video:", element);
              });
            });
        });
      });
  };
  useEffect(() => {
    run();
  }, []);
  return <div></div>;
}

export default Test;
