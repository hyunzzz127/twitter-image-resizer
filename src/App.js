import React, { useState } from "react";
import { saveAs } from "file-saver";

const TARGET_RATIOS = {1:16/9,2:7/8,3:7/8,4:2/1};

function App() {
  const [imgElem, setImgElem] = useState(null);
  const [previewURL, setPreviewURL] = useState("");
  const [count, setCount] = useState(1);
  const [bg, setBg] = useState("#ffffff");

  const onUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewURL(url);
    const img = new Image();
    img.src = url;
    img.onload = () => setImgElem(img);
  };

  const onResize = () => {
    if (!imgElem) return;
    const ratio = TARGET_RATIOS[count] || (16/9);
    const w = imgElem.width, h = imgElem.height, cr = w/h;
    let nw, nh;
    if (cr > ratio) { nw = w; nh = Math.round(w/ratio); }
    else { nh = h; nw = Math.round(h*ratio); }

    const c = document.createElement("canvas");
    c.width = nw; c.height = nh;
    const ctx = c.getContext("2d");
    ctx.fillStyle = bg; ctx.fillRect(0,0,nw,nh);
    ctx.drawImage(imgElem, (nw-w)/2,(nh-h)/2,w,h);

    c.toBlob(b => b && saveAs(b, "twitter_resized.png"));
  };

  return (
    <div style={{padding:20, maxWidth:400, margin:"auto"}}>
      <h1>트위터 이미지 리사이저</h1>
      <input type="file" accept="image/*" onChange={onUpload} />
      <div>
        이미지 수:
        <select value={count} onChange={e=>setCount(+e.target.value)}>
          {[1,2,3,4].map(n=><option key={n} value={n}>{n}장</option>)}
        </select>
      </div>
      <div>
        배경색:
        <input type="color" value={bg} onChange={e=>setBg(e.target.value)} />
      </div>
      {previewURL && <img src={previewURL} alt="" style={{maxWidth:"100%", marginTop:10}} />}
      <button onClick={onResize} style={{marginTop:10}}>변환 & 저장</button>
    </div>
  );
}

export default App;