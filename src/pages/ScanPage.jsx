import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ZXing from "@zxing/library";
import Swal from "sweetalert2";
import useConstructor from "../units/useConstructor";
import API from "../API";
import "../css/ScanPage.css";
import PartsCard from "../components/PartsCard";
import StoreCard from "../components/StoreCard";
import SpaceHalfREM from "../components/SpaceHalfREM";
import HistoryPartsCard from "../components/HistoryPartsCard";
import StoreContentCard from "../components/StoreContentCard";

let codeReader;
let lastResult;
let timeout;
let activeTab;

// eslint-disable-next-line no-unused-vars
const examplePartsInfo = {
  id: 12345,
  category: "動力",
  common_name: "14U4 變速箱",
  spec: "變速比 10.71:1",
  quantity: 2,
  unit: "組",
  supplier_name: "Andymark",
  product_name: "AM14U4 - FIRST Kit of Parts Chassis",
  product_code: "am-14U4",
  note: "六輪底盤",
};

// eslint-disable-next-line no-unused-vars
const exampleStoreInfo = {
  area_code: "H",
  area_name: "3F 動力櫃",
  grid_number: 3,
  grid_name: "變速箱 ",
  box_number: 12,
};

// eslint-disable-next-line no-unused-vars
const exampleHistories = [
  {
    id: 125,
    type: "出庫",
    quantity: 2,
    operator_name: "陳思惟",
    note: "測試用...",
    date: new Date().toLocaleDateString(),
  },
  {
    id: 126,
    type: "入庫",
    quantity: 2,
    operator_name: "陳思惟",
    note: "測試用...",
    date: new Date().toLocaleDateString(),
  },
  {
    id: 127,
    type: "出庫",
    quantity: 2,
    operator_name: "陳思惟",
    note: "測試用...",
    date: new Date().toLocaleDateString(),
  },
];

// eslint-disable-next-line no-unused-vars
const exampleStoreBox = [
  {
    number: 12,
    parts: [
      {
        id: 12345,
        common_name: "14U4 變速箱",
        spec: "變速比 10.71:1",
        quantity: 2,
        unit: "組",
      },
      {
        id: 12346,
        common_name: "14U4 變速箱",
        spec: "變速比 10.71:1",
        quantity: 2,
        unit: "組",
      },
      {
        id: 12347,
        common_name: "14U4 變速箱",
        spec: "變速比 10.71:1",
        quantity: 2,
        unit: "組",
      },
    ],
  },
  {
    number: 13,
    parts: [
      {
        id: 12348,
        common_name: "14U4 變速箱",
        spec: "變速比 10.71:1",
        quantity: 2,
        unit: "組",
      },
    ],
  },
  {
    number: 14,
    parts: [
      {
        id: 12349,
        common_name: "14U4 變速箱",
        spec: "變速比 10.71:1",
        quantity: 2,
        unit: "組",
      },
      {
        id: 12350,
        common_name: "14U4 變速箱",
        spec: "變速比 10.71:1",
        quantity: 2,
        unit: "組",
      },
    ],
  },
];

// eslint-disable-next-line no-unused-vars
const exampleStoreGrid = [
  {
    number: 2,
    name: "變速箱",
    boxes: [
      {
        number: 1,
        contents: "14U4 變速箱、CIM 變速箱、紅馬達變速箱",
      },
      {
        number: 2,
        contents:
          "14U4 變速箱、CIM 變速箱、紅馬達變速箱、NEO 變速箱、其他變速箱",
      },
      {
        number: 3,
        contents: "PG 馬達變速箱",
      },
    ],
  },
  {
    number: 3,
    name: "變速箱",
    boxes: [
      {
        number: 1,
        contents: "14U4 變速箱、CIM 變速箱、紅馬達變速箱",
      },
      {
        number: 2,
        contents:
          "14U4 變速箱、CIM 變速箱、紅馬達變速箱、NEO 變速箱、其他變速箱",
      },
      {
        number: 3,
        contents: "PG 馬達變速箱",
      },
    ],
  },
];

/*
const scanModeList = [
  { mode: "PARTS_IN", name: "零件入庫" },
  { mode: "PARTS_OUT", name: "零件出庫" },
  { mode: "PARTS_QUERY", name: "零件查詢" },
  { mode: "STORE_QUERY", name: "倉儲查詢" },
];
*/

/*
Format:
11: QR Code
4: Code 128
*/

const scan = {
  start: (deviceId, successCallback) => {
    codeReader.decodeFromVideoDevice(deviceId, "scanner", (result, err) => {
      if (result && result.text !== lastResult) {
        const { text } = result;
        successCallback(text);
        lastResult = result.text;
      }
      if (err && !(err instanceof ZXing.NotFoundException)) {
        throw err;
      }
    });
  },
  reset: () => {
    codeReader.reset();
    lastResult = undefined;
  },
};

function formatError(content, correctFormat = "") {
  Swal.fire({
    title: "格式不符",
    html: `資料：${content}${
      correctFormat !== ""
        ? `<br>請掃描零件 QR Code<br>正確格式：<code>${correctFormat}`
        : ""
    }</code>`,
    showConfirmButton: false,
    icon: "error",
    timer: 1000,
  });
}

export default function ScanPage() {
  const [devices, setDevices] = useState([]);
  const [isMirror, setIsMirror] = useState(false);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const [scanMode, setScanMode] = useState("PARTS_QUERY");
  const [input, setInput] = useState("");
  const [partInfo, setPartInfo] = useState({ id: 0 });
  const [storeInfo, setStoreInfo] = useState({ area_code: "NULL" });
  const [histories, setHistories] = useState([]);
  const [storeContents, setStoreContents] = useState([]);

  useConstructor(() => {
    codeReader = new ZXing.BrowserMultiFormatReader();
    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        const dd = [];
        videoInputDevices.forEach((item) => {
          dd.push({
            deviceId: item.deviceId,
            lable: item.label,
            mirror: false,
          });
          dd.push({
            deviceId: item.deviceId,
            lable: `(鏡像) ${item.label}`,
            mirror: true,
          });
        });
        setDevices(dd);
      })
      .catch(() => {});
  });

  useEffect(() => {
    return () => {
      codeReader.reset();
      lastResult = undefined;
    };
  }, []);

  function clearLast() {
    lastResult = undefined;
    setInput("");
    // setBatchNumber("");
    setPartInfo({ id: 0 });
    setStoreInfo({ area_code: "NULL" });
    setHistories([]);
    setStoreContents([]);
  }

  useEffect(() => {
    clearLast();
    activeTab = scanMode;
  }, [scanMode]);

  async function onResp(res, content) {
    switch (res.status) {
      case 200: {
        // TODO
        clearTimeout(timeout);
        timeout = setTimeout(clearLast, 30000);

        const { part, store, history, storeContent } = res.data;
        if (part) setPartInfo(part);
        if (store) setStoreInfo(store);
        if (history) setHistories(history);
        if (storeContent) setStoreContents(storeContent);

        Swal.fire({
          title: "刷入成功",
          html: `資料：${content}`,
          showConfirmButton: false,
          icon: "success",
          timer: 1000,
        });
        break;
      }
      case 400:
        formatError(content, "S.x-x-x");
        break;
      case 404: {
        Swal.fire({
          title: "資料不存在",
          html: `資料：${content}`,
          showConfirmButton: false,
          icon: "error",
          timer: 1000,
        });
        break;
      }
      default:
        break;
    }
  }

  async function onDataSubmit(content, mode = activeTab) {
    const [PLMS, prefix, code] = content.split(".");
    console.log([PLMS, prefix, code, activeTab, mode]);
    if (PLMS !== "PLMS" || code === "") {
      formatError(content);
    } else if (
      (mode === "PARTS_IN" || mode === "PARTS_OUT") &&
      prefix !== "P"
    ) {
      formatError(content, "P.xxxxx");
    } else if (mode === "PARTS_QUERY" && prefix !== "P" && prefix !== "S") {
      formatError(content, "P.xxxxx");
    } else if (mode === "STORE_QUERY" && prefix !== "S" && prefix !== "P") {
      formatError(content, "S.x-x-x");
    } else if (mode === "PARTS_QUERY" && prefix === "S") {
      setScanMode("STORE_QUERY");
      onDataSubmit(content, "STORE_QUERY");
    } else if (mode === "STORE_QUERY" && prefix === "P") {
      setScanMode("PARTS_QUERY");
      onDataSubmit(content, "PARTS_QUERY");
    } else {
      switch (mode) {
        case "PARTS_IN":
          break;
        case "PARTS_OUT":
          break;
        case "PARTS_QUERY":
          await API.get(`/part/${code}`).then((res) => onResp(res, content));
          break;
        case "STORE_QUERY":
          await API.get(`/store/${code}`).then((res) => onResp(res, content));
          break;
        default:
          break;
      }
    }
  }

  function onStartOrReset() {
    if (isScanning) {
      scan.reset();
      setIsScanning(false);
      clearLast();
    } else {
      setIsMirror(devices[deviceIndex].mirror);
      scan.start(devices[deviceIndex].deviceId, onDataSubmit);
      setIsScanning(true);
    }
  }

  // eslint-disable-next-line no-unused-vars
  async function onReject() {
    Swal.fire({
      title: "確定駁回？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "駁回紀錄",
      cancelButtonText: "取消",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await API.delete(`/checkin/${lastResult}`)
          .then((res) => {
            switch (res.status) {
              case 204: {
                Swal.fire({
                  title: "駁回成功",
                  showConfirmButton: false,
                  icon: "success",
                  timer: 1000,
                });
                clearLast();
                break;
              }
              case 404: {
                break;
              }
              default:
                break;
            }
          })
          .catch(() => {});
      }
    });
  }

  function BatchInput() {
    const [batchNumber, setBatchNumber] = useState("");
    return (
      <Form>
        <InputGroup className="mb-2">
          <InputGroup.Text>
            <Form.Label
              htmlFor="form-checkin-note"
              className="my-0"
              style={{ color: "#212529" }}
            >
              <FontAwesomeIcon icon="angle-double-right" /> 批次處理
            </Form.Label>
          </InputGroup.Text>
          <Form.Control
            type="number"
            id="form-checkin-note"
            placeholder={`若欲批次${
              scanMode === "PARTS_IN" ? "入庫" : "出庫"
            }，請輸入數量`}
            value={batchNumber}
            onChange={(e) => {
              setBatchNumber(e.target.value);
            }}
          />
          <Button
            type="submit"
            className="my-0 px-4 btn-rnrs"
            disabled={batchNumber === ""}
            onClick={() => {}}
          >
            批次{scanMode === "PARTS_IN" ? "入庫" : "出庫"}
          </Button>
        </InputGroup>
      </Form>
    );
  }

  return (
    <>
      <Container className="info-container">
        <h2>一般作業</h2>
        <Row>
          <Col md>
            <InputGroup>
              <InputGroup.Text>
                <Form.Label
                  htmlFor="form-checkin-note"
                  className="my-0"
                  style={{ color: "#212529" }}
                >
                  <FontAwesomeIcon icon="video" /> 鏡頭
                </Form.Label>
              </InputGroup.Text>
              <Form.Control
                as="select"
                id="form-scan-event"
                defaultValue="0"
                onChange={(e) => {
                  setDeviceIndex(e.target.value);
                }}
                disabled={isScanning}
              >
                <option value="" disabled>
                  請選擇鏡頭
                </option>
                {devices.map((item, index) => (
                  <option value={index} key={item.lable}>
                    {item.lable}
                  </option>
                ))}
              </Form.Control>
              <Button
                className="my-0 px-4 btn-rnrs"
                block="true"
                onClick={() => onStartOrReset()}
              >
                {isScanning ? "重設" : "開始"}
              </Button>
            </InputGroup>
            <Card className="my-2" style={{ backgroundColor: "#E9ECEF" }}>
              <Card.Body className="p-3 scanner">
                {!isScanning ? (
                  <Card.Title className="m-0">
                    <FontAwesomeIcon icon="camera" /> Scanner
                  </Card.Title>
                ) : (
                  <video
                    id="scanner"
                    style={{
                      transform: isMirror ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                    width="100%"
                    muted
                  />
                )}
              </Card.Body>
            </Card>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onDataSubmit(`PLMS.${input.toUpperCase()}`);
                setInput("");
              }}
            >
              <InputGroup className="mb-2">
                <InputGroup.Text>
                  <Form.Label
                    htmlFor="form-checkin-note"
                    className="my-0"
                    style={{ color: "#212529" }}
                  >
                    <FontAwesomeIcon icon="book" /> 手動輸入
                  </Form.Label>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  id="form-checkin-note"
                  placeholder={`請輸入${
                    scanMode !== "STORE_QUERY"
                      ? "零件序號（P.xxxxx）"
                      : "倉儲編號（S.x-x-x）"
                  }`}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                  }}
                />
                <Button
                  type="submit"
                  className="my-0 px-4 btn-rnrs"
                  block="true"
                  disabled={input === ""}
                >
                  送出
                </Button>
              </InputGroup>
            </Form>
          </Col>
          <Col md>
            <Tabs
              activeKey={scanMode}
              onSelect={(v) => setScanMode(v)}
              transition={false}
            >
              <Tab eventKey="PARTS_IN" title="零件入庫">
                <PartsCard partsInfo={partInfo} />
                <SpaceHalfREM />
                <StoreCard storeInfo={storeInfo} />
                <SpaceHalfREM />
                <BatchInput />
              </Tab>
              <Tab eventKey="PARTS_OUT" title="零件出庫">
                <PartsCard partsInfo={partInfo} />
                <SpaceHalfREM />
                <StoreCard storeInfo={storeInfo} />
                <SpaceHalfREM />
                <BatchInput />
              </Tab>
              <Tab eventKey="PARTS_QUERY" title="零件查詢">
                <PartsCard partsInfo={partInfo} />
                <SpaceHalfREM />
                <StoreCard storeInfo={storeInfo} />
                <SpaceHalfREM />
                <HistoryPartsCard histories={histories} />
              </Tab>
              <Tab eventKey="STORE_QUERY" title="倉儲查詢">
                <StoreCard storeInfo={storeInfo} />
                <SpaceHalfREM />
                <StoreContentCard storeContents={storeContents} />
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Container>
    </>
  );
}
