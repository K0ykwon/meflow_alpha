import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { database } from "../firebase"; // Firebase 연결 모듈
import { ref, onValue, set } from "firebase/database";

const Documents = () => {
  const [participants, setParticipants] = useState([]); // 참여자 목록 상태
  const [agenda, setAgenda] = useState([]); // 안건 목록 상태
  const [selectedParticipant, setSelectedParticipant] = useState(null); // 선택된 참여자
  const [currentOpinion, setCurrentOpinion] = useState(''); // 작성된 의견 상태
  const [selectedAgenda, setSelectedAgenda] = useState(null); // 선택된 안건
  const [viewing, setViewing] = useState(false); // 열람 모드 여부
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 사이드바 열림 상태
  const [opinions, setOpinions] = useState({}); // 다른 참여자들의 의견을 저장할 상태
  const [comments, setComments] = useState({}); // 댓글을 저장할 상태
  const [currentComment, setCurrentComment] = useState(''); // 현재 작성 중인 댓글

  // Firebase에서 참여자 목록 불러오기
  useEffect(() => {
    const participantsRef = ref(database, 'participants');
    onValue(participantsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedParticipants = [];
      for (let id in data) {
        loadedParticipants.push({ id, ...data[id] });
      }
      setParticipants(loadedParticipants);
    });
  }, []);

  // Firebase에서 안건 목록 불러오기
  useEffect(() => {
    const agendasRef = ref(database, 'agenda');
    onValue(agendasRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAgenda = [];
      for (let id in data) {
        loadedAgenda.push({ id, ...data[id] });
      }
      setAgenda(loadedAgenda);
    });
  }, []);

  // 첫 번째 참여자에 대해 작성 버튼을 눌린 상태로 시작하도록 설정
  useEffect(() => {
    if (participants.length > 0) {
      handleWriteParticipant(participants[0]); // 첫 번째 참여자 선택
    }
  }, [participants]);

  // 의견 저장 함수
  const handleSaveOpinion = (agendaId, opinion) => {
    const opinionRef = ref(database, `opinions/${agendaId}/${selectedParticipant.id}`);
    set(opinionRef, opinion)
      .then(() => {
        setCurrentOpinion(opinion);
        alert('의견이 저장되었습니다.');
      })
      .catch((error) => {
        console.error('의견 저장 실패:', error);
        alert('의견 저장에 실패했습니다.');
      });
  };

  // 댓글 저장 함수
  const handleSaveComment = (agendaId, originalAuthorId, commenterId, comment) => {
    const commentRef = ref(database, `comments/${agendaId}/${originalAuthorId}/${commenterId}`);
    set(commentRef, comment)
      .then(() => {
        setCurrentComment(''); // 댓글 작성 후 입력창 초기화
        alert('댓글이 저장되었습니다.');
      })
      .catch((error) => {
        console.error('댓글 저장 실패:', error);
        alert('댓글 저장에 실패했습니다.');
      });
  };

  // 안건 선택 시 해당 의견을 DB에서 불러와서 수정할 수 있도록 설정
  const handleSelectAgenda = (item) => {
    setSelectedAgenda(item); // 선택된 안건 설정
    const opinionRef = ref(database, `opinions/${item.id}`);
    onValue(opinionRef, (snapshot) => {
      const opinionData = snapshot.val();
      if (opinionData) {
        setCurrentOpinion(opinionData[selectedParticipant.id] || ''); // 해당 참여자의 의견을 불러옴
      } else {
        setCurrentOpinion(''); // DB에 의견이 없으면 비워둠
      }
    });

    // 댓글 데이터도 불러오기
    const commentRef = ref(database, `comments/${item.id}/${selectedParticipant.id}`);
    onValue(commentRef, (snapshot) => {
      const commentData = snapshot.val();
      setComments(commentData || {});
    });
  };

  // 작성 모드로 전환 (참여자 선택)
  const handleWriteParticipant = (participant) => {
    setSelectedParticipant(participant); // 선택된 참여자 설정
    setViewing(false); // 작성 모드
    setSelectedAgenda(null); // 안건 목록을 표시하기 위해 초기화
  };

  // 열람 모드로 전환 (참여자 선택)
  const handleViewParticipant = (participant) => {
    setSelectedParticipant(participant); // 선택된 참여자 설정
    setViewing(true); // 열람 모드로 전환
    setSelectedAgenda(null); // 안건 목록을 표시하기 위해 초기화
  };

  return (
    <div className="h-screen flex flex-row justify-start">
      {/* 왼쪽 사이드바 */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="bg-primary p-4 text-white w-25">Documents</div>

      {/* 메인 콘텐츠 영역 (사이드바 열림 여부에 따라 너비 조정) */}
      <div className={`transition-all ${isSidebarOpen ? 'w-[60%]' : 'w-full'} overflow-y-auto scrollbar-hidden flex flex-col justify-center items-center p-4 bg-gray-50`}>
        {/* 안건 목록 표시 */}
        {selectedParticipant && (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">Agenda</h2>

            {agenda.length > 0 ? (
              agenda.map((item, index) => (
                <div key={item.id} className="mb-4 w-full bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold">
                    <span className="bg-blue text-white rounded-lg p-1">{`안건 ${index + 1}`}</span> {item.title}
                  </h3>
                  <p className="text-gray-600 mt-2">{item.description}</p>

                  {/* 의견 작성 텍스트박스를 첫 번째 참여자만 띄우기 */}
                  {selectedAgenda && selectedAgenda.id === item.id ? (
                    <div className="mt-4">
                      {participants[0].id === selectedParticipant.id ? (
                        <div>
                          <textarea
                            className="border p-2 rounded-lg w-full"
                            placeholder="의견을 작성하세요"
                            value={currentOpinion}
                            onChange={(e) => setCurrentOpinion(e.target.value)}
                          />
                          <button
                            onClick={() => handleSaveOpinion(item.id, currentOpinion)}
                            className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors mt-2"
                          >
                            저장
                          </button>
                        </div>
                      ) : (
                        <div>
                          {opinions[selectedParticipant.id] ? (
                            <div>
                              <strong>{selectedParticipant.name}님의 의견:</strong>
                              <p>{opinions[selectedParticipant.id]}</p>
                            </div>
                          ) : (
                            <p>작성된 의견이 없습니다.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelectAgenda(item)} // 안건을 선택하여 의견 작성 시작
                      className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors mt-4"
                    >
                      {viewing ? '열람' : '의견 작성'}
                    </button>
                  )}

                  {/* 댓글 영역 */}
                  <div className="mt-4">
                    <textarea
                      className="border p-2 rounded-lg w-full h-20"
                      placeholder="댓글을 작성하세요"
                      value={currentComment}
                      onChange={(e) => setCurrentComment(e.target.value)}
                    />
                    <button
                      onClick={() => handleSaveComment(item.id, selectedParticipant.id, selectedParticipant.id, currentComment)}
                      className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors mt-2"
                    >
                      댓글 작성
                    </button>

                    {/* 댓글 표시 (스크롤 형식) */}
                    <div className="mt-4 max-h-32 overflow-y-auto">
                      {Object.entries(comments).map(([commenterId, comment]) => (
                        <div key={commenterId} className="mt-2">
                          <strong>{participants.find(p => p.id === commenterId)?.name}님의 댓글:</strong>
                          <p>{comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>안건이 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 우측 사이드바 영역 (참여자 목록 및 버튼 포함) */}
      <div className={`bg-gray p-4 ${isSidebarOpen ? 'w-[25vw]' : 'w-0'} transition-all flex flex-col gap-4`}>
        <h1 className="text-xl font-bold text-black mb-4">Participants</h1>

        {/* 참여자 목록 표시 */}
        <div className="flex flex-col gap-4">
          {participants.map((participant, index) => (
            <div key={participant.id} className="flex justify-between items-center">
              <div>{participant.name}</div>
              <button
                onClick={() => {
                  if (index === 0) {
                    handleWriteParticipant(participant); // 첫 번째 참여자일 경우 작성 버튼 클릭
                  } else {
                    handleViewParticipant(participant); // 나머지 참여자는 열람
                  }
                }}
                className="border-2 border-blue-500 text-blue-500 px-3 py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                {index === 0 ? '작성' : '열람'}
              </button>
            </div>
          ))}
        </div>

        {/* 선택된 참여자 정보 표시 */}
        {selectedParticipant && (
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h3 className="text-xl font-bold">참여자 세부 정보</h3>
            <p><strong>이름:</strong> {selectedParticipant.name}</p>
            <p><strong>이메일:</strong> {selectedParticipant.email}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Documents;
