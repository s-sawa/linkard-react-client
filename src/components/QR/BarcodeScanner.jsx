// import React, { useRef, useState } from "react";
// import { BrowserQRCodeReader } from "@zxing/browser";

// const BarcodeScanner = ({ onScan }) => {
//   const [isScanning, setIsScanning] = useState(false);
//   const videoRef = useRef(null);
//   const codeReader = new BrowserQRCodeReader();

//   const startScan = () => {
//     setIsScanning(true);
//     codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
//       if (result) {
//         onScan(result.text);
//         stopScan();
//       }
//       if (err && err.name !== "NotFoundException") {
//         console.error(err);
//         stopScan();
//       }
//     });
//   };

//   const stopScan = () => {
//     setIsScanning(false);
//     // Adjust this line if the method to stop the scanner has a different name
//     if (codeReader.stop) {
//       codeReader.stop(); // Assuming `stop` is the correct method. Adjust if needed.
//     }
//   };

//   return (
//     <div>
//       <video ref={videoRef} style={{ width: "100%" }} />
//       {!isScanning ? (
//         <button onClick={startScan}>Start Scanning</button>
//       ) : (
//         <button onClick={stopScan}>Stop Scanning</button>
//       )}
//     </div>
//   );
// };

// export default BarcodeScanner;

import React, { useRef, useState, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

const BarcodeScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const codeReader = new BrowserQRCodeReader();

  const startScan = () => {
    setIsScanning(true);
    codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
      if (result) {
        onScan(result.text);
        stopScan();
      }
      if (err && err.name !== "NotFoundException") {
        console.error(err);
        stopScan();
      }
    });
  };

  const stopScan = () => {
    setIsScanning(false);
    if (codeReader.stop) {
      codeReader.stop();
    }
  };

  // useEffectを使用して、コンポーネントがマウントされたときにスキャンを開始
  useEffect(() => {
    startScan();
    // クリーンアップ関数：コンポーネントがアンマウントされたときにスキャンを停止
    return () => {
      stopScan();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }} />
      {isScanning ? <button onClick={stopScan}>Stop Scanning</button> : null}
    </div>
  );
};

export default BarcodeScanner;

