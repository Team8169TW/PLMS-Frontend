import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as ZXing from "@zxing/library";
import Swal from "sweetalert2";
import useConstructor from "../units/useConstructor";
import API from "../API";

let codeReader;
let lastResult;
let timeout;
let lastCheckinId;

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
  const [eventList, setEventList] = useState([{ id: 0, value: "Loading..." }]);
  const [gateList, setGateList] = useState([]);
  const [eventVal, setEventVal] = useState(0);
  const [gateVal, setGateVal] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  /* eslint-disable no-unused-vars */
  const [infoOrg, setInfoOrg] = useState("");
  const [infoRole, setInfoRole] = useState("");
  const [infoName, setInfoName] = useState("");
  const [infoTime, setInfoTime] = useState("");
  const [canNote, setCanNote] = useState(false);
  const [noteVal, setNoteVal] = useState("");
  const [noteVal2, setNoteVal2] = useState("");
  const [input, setInput] = useState("");

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

  useEffect(() => {
    API.get("/event/organize").then((res) => {
      if (res.status === 200) setEventList(res.data);
    });
  }, [true]);

  function getGates(value) {
    API.get(`/event/${value.split("-")[1]}`).then((res) => {
      if (res.status === 200) {
        setGateList(res.data.gates);
      }
    });
  }

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

  async function onScanSuccess(text, manual = false) {
    const eventId = eventVal.split("-")[0];
    let hash = text;
    if (manual === true) {
      hash = `RNRSv3-${eventId}-${text}-phone`;
    }
    const payload = { hash, gateId: gateVal };

    await API.post(`/checkin/${eventId}`, payload)
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
              html: `資料：${text}<br>現在時間：${new Date().toLocaleString()}`,
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
      scan.start(devices[deviceIndex].deviceId, onScanSuccess);
      setIsScanning(true);
    }
  }

  async function onSubmitNote(hasAlert = true) {
    let content = noteVal;
    if (noteVal2 !== "") {
      content += ` - ${noteVal2}`;
    }
    const payload = { content };

    await API.post(`/checkin/note/${lastCheckinId}`, payload)
      .then((res) => {
        switch (res.status) {
          case 201: {
            clearTimeout(timeout);
            timeout = setTimeout(clearLast, 3000);
            if (hasAlert) {
              Swal.fire({
                title: "備註成功",
                showConfirmButton: false,
                icon: "success",
                timer: 1000,
              });
            }
            setCanNote(false);
            break;
          }
          case 404: {
            break;
          }
          default:
            break;
        }
        setNoteVal("");
        setNoteVal2("");
      })
      .catch(() => {});
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

  function isNoteSubmitDisable() {
    const eventCode = eventVal.split("-")[1];
    switch (eventCode) {
      case "fsshlib1f":
        return !noteVal || !noteVal2;
      case "fsshlib1f2":
        return !noteVal2;
      case "fsshlib3fk":
        return !noteVal || !noteVal2;
      default:
        return false;
    }
  }

  return (
    <>
      <Container className="info-container">
        <h2>刷入 QR Code</h2>
        <Form.Row>
          <Col md>
            <Form.Group>
              <Form.Label htmlFor="form-scan-event">
                <FontAwesomeIcon icon="calendar-day" /> 活動
              </Form.Label>
              <Form.Control
                as="select"
                id="form-scan-event"
                value={eventVal}
                onChange={(e) => {
                  setEventVal(e.target.value);
                  setGateVal(0);
                  getGates(e.target.value);
                }}
              >
                <option value="0" disabled>
                  請選擇活動
                </option>
                {eventList.map((item) => (
                  <option value={`${item.id}-${item.code}`} key={item.id}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group>
              <Form.Label htmlFor="form-scan-event">
                <FontAwesomeIcon icon="door-open" /> 入口
              </Form.Label>
              <Form.Control
                as="select"
                id="form-scan-event"
                value={gateVal}
                onChange={(e) => {
                  setGateVal(e.target.value);
                }}
                disabled={eventVal === 0}
              >
                <option value="0" disabled>
                  請選擇入口
                </option>
                {gateList.map((item) => (
                  <option value={item.id} key={item.id}>
                    {item.value}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md>
            <Form.Group>
              <Form.Label htmlFor="form-scan-event">
                <FontAwesomeIcon icon="video" /> 鏡頭
              </Form.Label>
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
            </Form.Group>
          </Col>
          <Col md={2} lg={1}>
            <Form.Group>
              <Form.Label htmlFor="form-scan-event" />
              <Button
                className="btn-rnrs"
                block
                onClick={() => onStartOrReset()}
                disabled={gateVal === 0}
              >
                {isScanning ? "重設" : "開始"}
              </Button>
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col md className="mb-2">
            <Card style={{ backgroundColor: "#E9ECEF" }}>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon="camera" /> Scanner
                </Card.Title>
                <video
                  id="scanner"
                  style={{
                    transform: isMirror ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                  width="100%"
                  muted
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md>
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
                placeholder="請輸入學號或指定識別資料"
                value={input}
                disabled={!isScanning}
                onChange={(e) => {
                  setInput(e.target.value);
                  setCanNote(e.target.value !== "");
                }}
              />
              <InputGroup.Append>
                <Button
                  type="submit"
                  className="my-0 px-4 btn-rnrs"
                  disabled={
                    input === "" ||
                    !isScanning ||
                    noteVal !== "" ||
                    noteVal2 !== ""
                  }
                  onClick={() => {
                    onScanSuccess(input, true);
                    setInput("");
                    setCanNote(true);
                  }}
                >
                  送出
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <Card style={{ backgroundColor: "#E9ECEF" }}>
              <Card.Body>
                <Card.Title>
                  <FontAwesomeIcon icon="address-card" /> 來賓資訊
                </Card.Title>
                <Form.Row>
                  <Col md>
                    <Form.Group>
                      <Form.Label htmlFor="form-register-location">
                        <FontAwesomeIcon icon="school" /> 單位
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="form-register-location"
                        placeholder="系統自動填入"
                        disabled
                        value={infoOrg}
                      />
                    </Form.Group>
                  </Col>
                  <Col md>
                    <Form.Group>
                      <Form.Label htmlFor="form-register-location">
                        <FontAwesomeIcon icon="user" /> 姓名
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="form-register-location"
                        placeholder="系統自動填入"
                        disabled
                        value={infoName}
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <Form.Row>
                  <Col md>
                    <Form.Group>
                      <Form.Label htmlFor="form-register-location">
                        <FontAwesomeIcon icon="user-tie" /> 身分
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="form-register-location"
                        placeholder="系統自動填入"
                        disabled
                        value={infoRole}
                      />
                    </Form.Group>
                  </Col>
                  <Col md>
                    <Form.Group>
                      <Form.Label htmlFor="form-register-location">
                        <FontAwesomeIcon icon="clock" /> 填報時間
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="form-register-location"
                        placeholder="系統自動填入"
                        disabled
                        value={infoTime}
                      />
                    </Form.Group>
                  </Col>
                </Form.Row>
                <InputGroup className="mb-2">
                  <InputGroup.Text>
                    <Form.Label
                      htmlFor="form-checkin-note"
                      className="my-0"
                      style={{ color: "#212529" }}
                    >
                      <FontAwesomeIcon icon="book" /> 備註 1 (體溫)
                    </Form.Label>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    id="form-checkin-note"
                    placeholder="請依規定輸入"
                    value={noteVal}
                    onChange={(e) => {
                      setNoteVal(e.target.value);
                    }}
                    disabled={!canNote}
                  />
                </InputGroup>
                <InputGroup className="mb-2">
                  <InputGroup.Text>
                    <Form.Label
                      htmlFor="form-checkin-note"
                      className="my-0"
                      style={{ color: "#212529" }}
                    >
                      <FontAwesomeIcon icon="book" /> 備註 2 (座位編號)
                    </Form.Label>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    id="form-checkin-note"
                    placeholder="請依規定輸入"
                    value={noteVal2}
                    onChange={(e) => {
                      setNoteVal2(e.target.value);
                    }}
                    disabled={!canNote}
                  />
                </InputGroup>
                <Form.Row>
                  <Col md className="mb-2">
                    <Button
                      block
                      variant="danger"
                      disabled={!lastCheckinId}
                      onClick={() => onReject()}
                    >
                      駁回簽到
                    </Button>
                  </Col>
                  <Col md>
                    <Button
                      type="submit"
                      className="my-0 btn-rnrs"
                      disabled={
                        !canNote ||
                        (noteVal === "" && noteVal2 === "") ||
                        isNoteSubmitDisable()
                      }
                      onClick={() => {
                        if (input === "" && !!lastCheckinId) {
                          onSubmitNote();
                        } else {
                          onScanSuccess(input, true).then(() => {
                            onSubmitNote(false);
                          });
                          setInput("");
                        }
                      }}
                    >
                      {!lastCheckinId ? "送出並備註" : "送出備註"}
                    </Button>
                  </Col>
                </Form.Row>
              </Card.Body>
            </Card>
          </Col>
        </Form.Row>
      </Container>
    </>
  );
}
