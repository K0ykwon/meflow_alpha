import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { database } from "../firebase";  // Firebase 연결 모듈
import { ref, onValue } from "firebase/database";  // Firebase에서 데이터를 가져오는 함수

const Meeting = () => {
  const [agendas, setAgendas] = useState([]);

  // Firebase에서 agenda 데이터 불러오기
  useEffect(() => {
    const agendaRef = ref(database, 'agenda');  // Firebase DB에서 agenda를 참조
    onValue(agendaRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAgendas = [];
      for (let id in data) {
        loadedAgendas.push({ id, ...data[id] });
      }
      setAgendas(loadedAgendas);  // 불러온 데이터 상태 업데이트
    });
  }, []);

  return (
    <div className="h-screen flex flex-row justify-start">
      <Sidebar />
      <div className="bg-primary p-4 text-white w-25">Meeting progress</div>

      <div className="w-[40%] flex flex-col justify-center items-center p-4 bg-gray-50">
        <div className="grid grid-cols-1 gap-6 w-full max-w-screen-xl">
          <h1 className="p-4 text-xl font-bold mb-4">Agenda</h1>

          {/* Scrollable Agenda List */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-full max-w-[100%] overflow-y-auto" style={{ maxHeight: '500px' }}>
            {agendas.map((agenda, index) => (
              <div key={agenda.id} className="mb-6">
                <h3 className="text-xl font-semibold">
                  <span className="bg-blue text-white rounded-lg p-1">{`안건 ${index + 1}`}</span> {agenda.title}
                </h3>
                <p className="text-gray-600 mt-4">{agenda.description}</p> {/* 설명 추가 */}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 w-[30%] place-items-center mx-auto h-full flex flex-col"> {/* 너비를 30%로 줄임 */}
        {/* AI 리서치 (ChatGPT UI 스타일) */}
        <div className="w-[90%] p-4 mt-2 flex flex-col h-full"> {/* AI 리서치 영역 너비를 90%로 설정 */}
          <h2 className="text-xl font-semibold mb-4">AI Research</h2>
          <div className="bg-white p-6 rounded-lg bg-gray shadow-lg flex-1 flex flex-col justify-between">
            {/* 내용 영역 */}
            <div className="flex-1 mb-4">
              {/* 여기에 필요한 내용을 추가할 수 있습니다. */}
            </div>
            {/* 입력 상자 */}
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg resize-none"
              placeholder="여기에 질문을 입력하세요..."
              rows="3" // 높이를 줄이기 위해 행 수를 3으로 설정
            ></textarea>
            <button className="mt-2 px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-lg hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400">
              AI 리서치 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Meeting;
