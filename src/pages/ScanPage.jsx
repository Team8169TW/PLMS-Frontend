import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
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

let codeReader;
let lastResult;
let timeout;
let lastCheckinId;

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

const exampleStoreInfo = {
  area_code: "H",
  area_name: "3F 動力櫃",
  grid_number: 3,
  grid_name: "變速箱 ",
  box_number: 12,
};

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

export default function ScanPage() {
  const [devices, setDevices] = useState([]);
  const [isMirror, setIsMirror] = useState(false);
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const [scanMode, setScanMode] = useState("STORE_QUERY");
  const [input, setInput] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  /* eslint-disable no-unused-vars */
  const [infoOrg, setInfoOrg] = useState("");
  const [infoRole, setInfoRole] = useState("");
  const [infoName, setInfoName] = useState("");
  const [infoTime, setInfoTime] = useState("");
  const [canNote, setCanNote] = useState(false);
  const [noteVal, setNoteVal] = useState("");
  const [noteVal2, setNoteVal2] = useState("");

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
    setInfoName("");
    setInfoTime("");
    setInfoOrg("");
    setInfoRole("");
    lastResult = undefined;
    lastCheckinId = undefined;
    setCanNote(false);
    setNoteVal("");
    setNoteVal2("");
    setInput("");
  }

  async function onDataSubmit(content) {
    console.log(content);

    const payload = { content };

    await API.post(`/checkin/`, payload)
      .then((res) => {
        switch (res.status) {
          case 201: {
            const {
              id,
              declare: {
                name,
                createdAt,
                EventOrg: { value: org },
                EventRole: { value: role },
              },
              history,
            } = res.data;

            lastCheckinId = id;
            setCanNote(true);

            clearTimeout(timeout);
            timeout = setTimeout(clearLast, 180000);

            setInfoName(name);
            setInfoTime(new Date(createdAt).toLocaleString());
            setInfoOrg(org);
            setInfoRole(role);

            let historyHtml = "<br><br>刷入紀錄<br>";

            for (let i = 0; i < history.length; i += 1) {
              historyHtml += `${new Date(
                history[i].createdAt
              ).toLocaleString()} - ${history[i].id} - ${
                history[i].EventGate.value
              }<br>`;
            }

            Swal.fire({
              title: "刷入成功",
              html: `簽到ID：${id}<br>現在時間：${new Date().toLocaleString()}<br><strong>請依規定輸入資料至備註（若有需要）</strong>${
                history.length ? historyHtml : ""
              }`,
              showConfirmButton: false,
              icon: "success",
              timer: 2500,
            });
            break;
          }
          case 400:
          case 404: {
            Swal.fire({
              title: "格式不符或不存在",
              html: `資料：${content}<br>現在時間：${new Date().toLocaleString()}`,
              showConfirmButton: false,
              icon: "error",
              timer: 2000,
            });
            break;
          }
          default:
            break;
        }
      })
      .catch(() => {});
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
        await API.delete(`/checkin/${lastCheckinId}`)
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
    const modeName = scanMode === "PARTS_IN" ? "入庫" : "出庫";
    return (
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
          placeholder={`若欲批次${modeName}，請輸入數量`}
          value={batchNumber}
          onChange={(e) => {
            setBatchNumber(e.target.value);
          }}
        />
        <InputGroup.Append>
          <Button
            type="submit"
            className="my-0 px-4 btn-rnrs"
            disabled={batchNumber === ""}
            onClick={() => {}}
          >
            批次{modeName}
          </Button>
        </InputGroup.Append>
      </InputGroup>
    );
  }

  return (
    <>
      <Container className="info-container">
        <h2>一般作業</h2>
        <Form.Row>
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
              <InputGroup.Append>
                <Button
                  className="my-0 px-4 btn-rnrs"
                  block
                  onClick={() => onStartOrReset()}
                >
                  {isScanning ? "重設" : "開始"}
                </Button>
              </InputGroup.Append>
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
                  setCanNote(e.target.value !== "");
                }}
              />
              <InputGroup.Append>
                <Button
                  type="submit"
                  className="my-0 px-4 btn-rnrs"
                  disabled={input === ""}
                  onClick={() => {
                    onDataSubmit(`PLMS.${input}`);
                    setInput("");
                  }}
                >
                  送出
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col md>
            <Tabs
              activeKey={scanMode}
              onSelect={(v) => setScanMode(v)}
              className="mb-2"
            >
              <Tab eventKey="PARTS_IN" title="零件入庫">
                <PartsCard partsInfo={examplePartsInfo} />
                <SpaceHalfREM />
                <StoreCard storeInfo={exampleStoreInfo} />
                <SpaceHalfREM />
                <BatchInput />
              </Tab>
              <Tab eventKey="PARTS_OUT" title="零件出庫">
                <PartsCard partsInfo={examplePartsInfo} />
                <SpaceHalfREM />
                <StoreCard storeInfo={exampleStoreInfo} />
                <SpaceHalfREM />
                <BatchInput />
              </Tab>
              <Tab eventKey="PARTS_QUERY" title="零件查詢">
                <PartsCard partsInfo={examplePartsInfo} />
                <SpaceHalfREM />
                <StoreCard storeInfo={exampleStoreInfo} />
                <SpaceHalfREM />
                <HistoryPartsCard histories={exampleHistories} />
              </Tab>
              <Tab eventKey="STORE_QUERY" title="倉儲查詢">
                <StoreCard storeInfo={exampleStoreInfo} />
                <SpaceHalfREM />
              </Tab>
            </Tabs>
          </Col>
        </Form.Row>
      </Container>
    </>
  );
}
