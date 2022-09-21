import express from "express";
import fileUpload from "express-fileupload";
import libre from "libreoffice-convert";
import fs from "fs";
import { fileURLToPath } from "url";
import { writeFileSync } from "fs";
import pdf from "pdf-page-counter";
import path from "path";
import util from "util";
import { fromPath, fromBase64 } from "pdf2pic";
libre.convertAsync = util.promisify(libre.convert);
const fsy = fs.promises;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(fileUpload());

const types = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// const fileconverter = async (filename) => {
//   const ext = ".pdf";
//   const inputPath = path.join(__dirname, `/filessaved/${filename}`);
//   const outputPath = path.join(__dirname, `/filessaved/${filename.substr(0, filename.length - 3)}${ext}`);

//   // Read file
//   const docxBuf = await fsy.readFile(inputPath);

//   // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
//   let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);

//   // Here in done you have pdf file which you can save or transfer in another stream
//   await fsy.writeFile(outputPath, pdfBuf);
// };
const options = {
  density: 100,
  savePath: "./images",
  width: 600,
  height: 600,
};
app.post("/postfile", (req, res) => {
  console.log("here");
  // const { filename } = req.query;
  const options = {
    density: 100,
    saveFilename: "file",
    savePath: "./images",
    format: "png",
    width: 800,
    height: 700,
  };
  const storeAsImage = fromPath(`./filessaved/Chap1.pdf`, options);
  let dataBuffer = fs.readFileSync(`./filessaved/Chap1.pdf`);
  pdf(dataBuffer).then(function (data) {
    for (var pageToConvertAsImage = 1; pageToConvertAsImage <= data.numpages; pageToConvertAsImage++) {
      storeAsImage(pageToConvertAsImage).then((resolve) => {
        return resolve;
      });
    }
    res.send({
      filename: "ok",
    });
  });
});

app.get("/pdfpng", function (req, res, next) {
  console.log("here");
  const { filename } = req.query;
  const options = {
    density: 100,
    saveFilename: "file",
    savePath: "./public/uploads",
    format: "png",
    width: 600,
    height: 600,
  };
  const storeAsImage = fromPath(`./filessaved/${filename}`, options);
  let dataBuffer = fs.readFileSync(`./public/uploads/${filename}`);
  pdf(dataBuffer).then(function (data) {
    for (var pageToConvertAsImage = 1; pageToConvertAsImage <= data.numpages; pageToConvertAsImage++) {
      storeAsImage(pageToConvertAsImage).then((resolve) => {
        return resolve;
      });
    }
    res.send({
      filename: filename,
    });
  });
});
app.listen(8080, () => console.log("listening on port 8080"));
