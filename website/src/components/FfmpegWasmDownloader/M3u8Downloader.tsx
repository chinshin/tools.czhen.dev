import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

export default function M3u8Downloader() {
  const [videoSrc, setVideoSrc] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isinputValid, setIsinputValid] = useState(true);

  const ffmpeg = createFFmpeg({
    log: true,
  });

  const getAllUrlList = (baseUrl = "", data = "") => {
    const httpsReg = /https?:\/\/.*\.ts/g;
    const hasBaseUrl = httpsReg.test(data);
    if (hasBaseUrl) {
      const urlList = [...data.matchAll(/https?:\/\/.*\.ts/g)];
      return urlList.map((urlItem) => urlItem[0]);
    }
    const urlList = [...data.matchAll(/\/(.*)\.ts/g)];
    return urlList.map((urlItem) => `${baseUrl}${urlItem[0]}`);
  };
  const replaceAllSegmentpath = (data = "") => {
    const httpsReg = /https?:\/\/.*\.ts/g;
    const hasBaseUrl = httpsReg.test(data);
    if (hasBaseUrl) {
      return data.replaceAll(/https?:\/\/(.*)\.ts/g, (match, p1) => {
        return `${p1.split("/").pop()}.ts`;
      });
    }
    return data.replaceAll(/\/(.*)\.ts/g, (match, p1) => {
      return `${p1.split("/").pop()}.ts`;
    });
  };
  const getBaseUrl = (data) => {
    const a = document.createElement("a");
    a.href = data;
    return `https://${a.hostname}`;
  };
  const doTranscode = async () => {
    setMessage("Loading ffmpeg-core.js");
    await ffmpeg.load();
    setMessage("Start transcoding");
    // ffmpeg.FS("writeFile", "download.m3u8", await fetchFile(inputUrl));
    // const m3u8Content = ffmpeg.FS("readFile", "download.m3u8");
    // const strContent = new TextDecoder().decode(m3u8Content);
    // const baseUrl = getBaseUrl(inputUrl);
    // const urlList = getAllUrlList(baseUrl, strContent);
    // const newM3u8Content = replaceAllSegmentpath(strContent);
    // console.log(newM3u8Content);
    // for (let i = 0; i < urlList.length; i++) {
    //   const tsUrl = urlList[i];
    //   ffmpeg.FS("writeFile", tsUrl.split("/").pop(), await fetchFile(tsUrl));
    // }
    // const unit8ArrayContent = new TextEncoder().encode(newM3u8Content);
    // ffmpeg.FS("writeFile", "test.m3u8", unit8ArrayContent);
    // await ffmpeg.run("-i", `test.m3u8`, "-c", "copy", "test.mp4");
    // setMessage("Complete transcoding");
    // const data = ffmpeg.FS("readFile", "test.mp4");
    // setVideoSrc(
    //   URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
    // );
  };

  const handleInputChange = (event) => {
    setInputUrl(event.target.value);
  };

  React.useEffect(() => {
    if (inputUrl) {
      const result = checkInput(inputUrl);
      setIsinputValid(result);
      result && setMessage("Click Start to transcode");
    }
  }, [inputUrl]);

  const checkInput = (url: string): boolean => {
    return /^https?:\/\/.+\..+\.m3u8.*$/.test(url);
  };

  const reset = () => {
    setVideoSrc("");
    setInputUrl("");
    setMessage("");
    setIsinputValid(true);
  };

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        display: "flex",
        flexDirection: "column",
      }}
      noValidate
      autoComplete="off"
    >
      {videoSrc && (
        <div>
          <video src={videoSrc} controls />
          <Button
            variant="contained"
            sx={{
              margin: "8px",
            }}
            onClick={() => {
              reset();
            }}
          >
            Reset
          </Button>
        </div>
      )}
      <div>
        <TextField
          required
          error={!isinputValid}
          helperText={isinputValid ? "" : "Please check your input!"}
          id="outlined-required"
          label=".m3u8 playlist URL"
          defaultValue=""
          placeholder="https://...m3u8"
          onChange={handleInputChange}
        />
      </div>
      {message && <Alert severity="info">{message}</Alert>}
      <div>
        <Button
          variant="contained"
          sx={{
            margin: "8px",
          }}
          disabled={!isinputValid || inputUrl.length === 0}
          onClick={doTranscode}
        >
          Download
        </Button>
      </div>
    </Box>
  );
}
