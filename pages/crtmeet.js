import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SidebarCalendar from "../components/SidebarCalendar";
import { database } from "../firebase"; // Firebase 연결 모듈
import { ref, set, push, onValue, update, remove } from "firebase/database";

const Crtmeet = () => {
  const [agenda, setAgenda] = useState([]);
  const [participants, setParticipants] = useState([]); // 참여자 목록 상태
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false); // 참여자 추가 상태
  const [isManagingParticipants, setIsManagingParticipants] = useState(false); // 참여자 관리 상태
  const [currentAgenda, setCurrentAgenda] = useState({ title: "", description: "" });
  const [currentParticipant, setCurrentParticipant] = useState({ name: "", email: "" }); // 참여자 정보 상태
  const [editIndex, setEditIndex] = useState(null);

  // Firebase에서 안건 데이터를 불러오기
  useEffect(() => {
    const agendaRef = ref(database, 'agenda');
    onValue(agendaRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAgenda = [];
      for (let id in data) {
        loadedAgenda.push({ id, ...data[id] });
      }
      setAgenda(loadedAgenda);
    });

    // Firebase에서 참여자 목록 불러오기
    const participantsRef = ref(database, "participants");
    onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedParticipants = [];
      for (let id in data) {
        loadedParticipants.push({ id, ...data[id] });
      }
      setParticipants(loadedParticipants);
    });
  }, []);

  // 새 안건 추가 및 수정 완료 핸들러
  const handleSaveAgenda = () => {
    if (!currentAgenda.title.trim() || !currentAgenda.description.trim()) {
      alert("제목과 설명을 모두 입력하세요!");
      return;
    }

    if (editIndex !== null) {
      // 기존 안건 수정
      const updatedAgenda = agenda.map((item, idx) =>
        idx === editIndex ? currentAgenda : item
      );
      const agendaRef = ref(database, `agenda/${agenda[editIndex].id}`);
      update(agendaRef, currentAgenda);  // Firebase에서 해당 안건을 업데이트
    } else {
      // 새 안건 추가
      const agendaRef = ref(database, 'agenda');
      const newAgendaRef = push(agendaRef);  // 새 안건을 추가
      set(newAgendaRef, currentAgenda);
    }

    // 초기화 및 편집 모드 종료
    setCurrentAgenda({ title: "", description: "" });
    setEditIndex(null);
    setIsEditing(false);
  };

  // 새 참여자 추가 및 수정 완료 핸들러
  const handleSaveParticipant = () => {
    if (!currentParticipant.name.trim() || !currentParticipant.email.trim()) {
      alert("이름과 이메일을 모두 입력하세요!");
      return;
    }
  
    if (currentParticipant.id) {
      // 기존 참여자 수정
      const participantRef = ref(database, `participants/${currentParticipant.id}`);
      update(participantRef, {
        name: currentParticipant.name,
        email: currentParticipant.email
      }).then(() => {
        // 수정 후 초기화
        setCurrentParticipant({ name: "", email: "" });
        setIsAddingParticipant(false);  // 수정 완료 후 화면 돌아가기
      });
    } else {
      // 새 참여자 추가
      const participantRef = ref(database, "participants");
      const newParticipantRef = push(participantRef);
      set(newParticipantRef, currentParticipant);
  
      // 입력 필드 초기화
      setCurrentParticipant({ name: "", email: "" });
      setIsAddingParticipant(false);  // 참여자 추가 후 원래 화면으로 돌아가기
    }
  };

  // 참여자 수정 핸들러
  const handleEditParticipant = (id) => {
    const participant = participants.find((participant) => participant.id === id);
    setCurrentParticipant({ id: participant.id, name: participant.name, email: participant.email });
    setIsAddingParticipant(true);  // 참여자 수정 화면으로 전환
  };
  // 참여자 삭제 핸들러
  const handleDeleteParticipant = (id) => {
    const participantRef = ref(database, `participants/${id}`);
    remove(participantRef); // Firebase에서 해당 참여자 삭제
  };

  // 안건 편집 화면으로 전환
  const handleAddOrEdit = (index = null) => {
    if (index !== null) {
      // 기존 안건 편집
      setCurrentAgenda(agenda[index]);
      setEditIndex(index);
    } else {
      // 새 안건 추가
      setCurrentAgenda({ title: "", description: "" });
      setEditIndex(null);
    }
    setIsEditing(true);
  };

  // 안건 삭제 핸들러
  const handleDeleteAgenda = (id) => {
    const agendaRef = ref(database, `agenda/${id}`);
    remove(agendaRef);  // Firebase에서 해당 안건을 삭제
  };

  return (
    <div className="h-screen flex flex-row justify-start">
      <Sidebar />
      <div className="bg-primary p-4 text-white w-25">Setting Meeting</div>

      <div className="w-[60%] overflow-y-auto scrollbar-hidden flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-md">
            <h2 className="text-xl font-bold mb-4 mt-4">Agenda</h2>
            </div>
            
        {/* 안건 관리 */}
        {isEditing ? (
          
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-md">
            <h2 className="text-xl font-bold mb-4">
              {editIndex !== null ? "안건 수정" : "새 안건 추가"}
            </h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="border p-2 rounded-lg w-full"
                placeholder="안건 제목을 입력하세요"
                value={currentAgenda.title}
                onChange={(e) =>
                  setCurrentAgenda({ ...currentAgenda, title: e.target.value })
                }
              />
              <textarea
                className="border p-2 rounded-lg w-full"
                rows="4"
                placeholder="안건 설명을 입력하세요"
                value={currentAgenda.description}
                onChange={(e) =>
                  setCurrentAgenda({ ...currentAgenda, description: e.target.value })
                }
              ></textarea>
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveAgenda}
                  className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 w-full max-w-screen-xl">
            {agenda.map((item, index) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-lg h-full max-w-[100%]"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">
                    <span className="bg-blue text-white rounded-lg p-1">
                      {`안건 ${index + 1}`}
                    </span>{" "}
                    {item.title}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddOrEdit(index)}
                      className="border-2 border-blue-500 text-blue-500 px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      수정하기
                    </button>
                    <button
                      onClick={() => handleDeleteAgenda(item.id)}
                      className="border-2 border-red-500 text-red-500 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}

            <div className="mb-4 w-full">
              <button
                onClick={() => handleAddOrEdit()}
                className="border-2 border-blue-500 text-blue-500 w-full py-3 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                안건 추가
              </button>
            </div>
          </div>
        )}

        {/* 참여자 추가/관리 화면 */}
        {isAddingParticipant ? (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-md">
            <h2 className="text-xl font-bold mb-4">참여자 추가</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                className="border p-2 rounded-lg w-full"
                placeholder="참여자 이름"
                value={currentParticipant.name}
                onChange={(e) =>
                  setCurrentParticipant({ ...currentParticipant, name: e.target.value })
                }
              />
              <input
                type="email"
                className="border p-2 rounded-lg w-full"
                placeholder="참여자 이메일"
                value={currentParticipant.email}
                onChange={(e) =>
                  setCurrentParticipant({ ...currentParticipant, email: e.target.value })
                }
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveParticipant}
                  className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  저장
                </button>
                <button
                  onClick={() => setIsAddingParticipant(false)}
                  className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )

        : (
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-screen-md">
            <h2 className="text-xl font-bold mb-4">참여자 목록</h2>
            {participants.map((participant, index) => (
  <div key={participant.id} className="flex justify-between items-center p-4 border-b">
    <div>{participant.name} ({participant.email})</div>
    <div className="flex space-x-2">
      {/* 첫 번째 참여자일 경우 수정과 삭제 버튼을 모두 숨김 */}
      {index !== 0 && (
        <>
          <button
            onClick={() => handleEditParticipant(participant.id)}
            className="border-2 border-blue-500 text-blue-500 px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            수정
          </button>
          <button
            onClick={() => handleDeleteParticipant(participant.id)}
            className="border-2 border-red-500 text-red-500 px-3 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
          >
            삭제
          </button>
        </>
      )}
    </div>
  </div>
))}
            
            <div className="flex justify-end mt-4">
    </div>
  </div>
        )}
      </div>

      <div className="bg-gray p-4 w-[25vw] flex flex-col gap-4">
        <h1 className="text-xl font-bold mb-4">Schedule</h1>
        <SidebarCalendar />
        <div className="flex flex-col gap-4"></div>
        <h1 className="text-xl font-bold mb-4 mt-6">Participants</h1>
    
        {/* 참여자 추가 및 관리 버튼 */}
        <button
          onClick={() => setIsAddingParticipant(true)}
          className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          참여자 추가
        </button>
        <button
          onClick={() => setIsManagingParticipants(true)}
          className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
        >
          참여자 관리
        </button>
      </div>
    </div>
  );
};

export default Crtmeet;
