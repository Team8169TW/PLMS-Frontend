import React, { useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Contact from "../components/Contact";
import DeclareForm from "../components/DeclareForm";
import EventList from "../components/EventList";
import API from "../API";

export default function DeclarePage() {
  const { eventCode } = useParams();
  const history = useHistory();
  const [data, setData] = useState(null);

  useMemo(() => {
    if (data !== null) setData(null);
    if (eventCode === undefined) {
      API.get("/event").then((res) => {
        if (res.status === 200) setData(res.data);
      });
    } else {
      API.get(`/event/${eventCode}`).then((res) => {
        switch (res.status) {
          case 200:
            setData(res.data);
            break;
          case 404:
            history.push("/404");
            break;
          default:
            break;
        }
      });
    }
  }, [eventCode]);

  /* useEffect(() => {
    console.log("E");
    if (eventId === undefined) {
      API.get("/event").then((res) => {
        if (res.status === 200) data = res.data;
      });
    } else {
      API.get(`/event/${eventId}`).then((res) => {
        switch (res.status) {
          case 200:
            data = res.data;
            break;
          case 404:
            history.push("/404");
            break;
          default:
            break;
        }
      });
    }
  }, [eventId, data]); */

  /* const eventMock = {
    stray: {
      eventId: "stray",
      name: "Stray 迷途",
      date: "2021/07/06",
      location: "高師大",
      idcard: true,
      advancedForm: true,
      googleFormSrc:
        "https://docs.google.com/forms/d/e/1FAIpQLScuX6nkwXyRCq_ldYt-DMtBZlhYxHOP2ZD26xEB8bPNUz6D7g/viewform?embedded=true",
      backgroundImage: "stray.jpg",
      orgs: [
        { value: "FSSH", text: "鳳山高中" },
        { value: "SMHS", text: "三民高中" },
        { value: "CJHS", text: "前鎮高中" },
      ],
      roles: [
        { value: "A", text: "社員" },
        { value: "B", text: "學生" },
        { value: "C", text: "特邀" },
        { value: "D", text: "訪客" },
        { value: "E", text: "教師" },
        { value: "F", text: "家長" },
      ],
    },
    vks: {
      eventId: "vks",
      name: "VK'S 弦來五事",
      date: "2021/05/22",
      location: "夢時代1F幸福廣場",
      idcard: false,
      advancedForm: false,
      googleFormSrc: "",
      backgroundImage: "vks2.jpg",
      orgs: [
        { value: "KSKH", text: "高雄中學" },
        { value: "KGSH", text: "高雄女中" },
        { value: "FSSH", text: "鳳山高中" },
        { value: "HCHS", text: "新莊高中" },
        { value: "CSHS", text: "中山高中" },
        { value: "OTHERS", text: "其他" },
      ],
      roles: [
        { value: "A", text: "社員" },
        { value: "B", text: "學生" },
        { value: "C", text: "特邀" },
        { value: "D", text: "訪客" },
      ],
    },
    flysky: {
      eventId: "flysky",
      name: "翔天團慶",
      date: "2021/06/12",
      location: "草屯商工",
      idcard: false,
      advancedForm: false,
      googleFormSrc: "",
      backgroundImage: "aaa.jpg",
      orgs: [
        { value: "A", text: "A高中" },
        { value: "B", text: "B高中" },
        { value: "C", text: "C高中" },
      ],
      roles: [
        { value: "A", text: "社員" },
        { value: "B", text: "學生" },
        { value: "C", text: "特邀" },
        { value: "D", text: "訪客" },
        { value: "E", text: "教師" },
        { value: "F", text: "家長" },
      ],
    },
  };
  const event = eventMock[eventId];
  const events = [
    {
      eventId: "stray",
      name: "Stray 迷途",
      date: "2021/07/06",
      location: "高師大",
    },
    {
      eventId: "vks",
      name: "VK'S 弦來五事",
      date: "2021/05/22",
      location: "夢時代1F幸福廣場",
    },
    {
      eventId: "flysky",
      name: "翔天團慶",
      date: "2021/06/12",
      location: "草屯商工",
    },
  ]; */
  return (
    <>
      {/* eslint-disable-next-line no-nested-ternary */}
      {data === null ? (
        <></>
      ) : eventCode === undefined ? (
        <EventList events={data ?? [{ eventId: "" }]} />
      ) : (
        <DeclareForm event={data} />
      )}
      <Contact />
    </>
  );
}
