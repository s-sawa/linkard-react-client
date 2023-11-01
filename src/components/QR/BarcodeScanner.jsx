import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

const BarcodeScanner = ({ onScan }, ref) => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const controlsRef = useRef(null); // controlsRef を追加
  const codeReader = new BrowserQRCodeReader();

  const startScan = () => {
    setIsScanning(true);
    codeReader.decodeFromVideoDevice(
      null,
      videoRef.current,
      (result, err, controls) => {
        if (result) {
          onScan(result.text);
          stopScan(); // QRコードが読み取られたときのみスキャン停止
        }
        if (err && err.name !== "NotFoundException") {
          // console.error(err);
        }
        controlsRef.current = controls; // controlsをcontrolsRefに保存
      }
    );
  };

  const stopScan = () => {
    setIsScanning(false);
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null; // スキャン停止後、controlsRefをnullに設定
    }
  };

  useImperativeHandle(ref, () => ({
    stopScan,
  }));

  useEffect(() => {
    startScan();
    return () => {
      stopScan();
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ width: "100%" }} />
      {/* {isScanning ? <button onClick={stopScan}>Stop Scanning</button> : null} */}
    </div>
  );
};

export default forwardRef(BarcodeScanner);
