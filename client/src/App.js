import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [file, setFile] = useState();
  const postfile = async () => {
    const formData = new FormData();
    formData.append("selectedFile", file);
    const result = await axios.post("/postfile", formData, { headers: { "Content-Type": "multipart/form-data" } });
    return result.data;
  };
  if (file) {
    console.log(URL.createObjectURL(file));
  }
  return (
    <div className="App">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button disabled={!file} onClick={(e) => postfile()}>
        post pic
      </button>
      {file && (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=https://scholar.harvard.edu/files/torman_personal/files/samplepptx.pptx`}
          width="100%"
          height="600px"
          frameBorder="0"
          title="slides"
        ></iframe>
      )}
    </div>
  );
};

export default App;
