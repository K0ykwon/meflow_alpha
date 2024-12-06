import { useState } from "react";

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const [participants, setParticipants] = useState([]);

  // 이메일 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`입력된 이메일: ${email}`);
  };

  // 참여자 초대 함수
  const inviteParticipant = () => {
    if (email && !participants.includes(email)) {
      setParticipants([...participants, email]);
      setEmail(""); // 이메일 입력 후 초기화
      alert(`참여자 "${email}" 초대됨!`);
    } else {
      alert("이미 초대된 이메일이거나 이메일을 입력해주세요.");
    }
  };

  // 참여자 확인 함수
  const confirmParticipants = () => {
    if (participants.length === 0) {
      alert("초대된 참여자가 없습니다.");
    } else {
      // 이메일 목록을 한 줄로 보여줍니다.
      const participantEmails = participants.join("\n");
      alert(`초대된 참여자:\n${participantEmails}`);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">이메일 입력</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full p-2 rounded-md border border-gray-300 mb-4"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {/* 참여자 초대 버튼 */}
        <div className="flex flex-col gap-4">
        <button
          type="button"
          className="border-2 border-blue-500 text-blue-500 w-full py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
          onClick={inviteParticipant}
        >
          참여자 초대
        </button>

        {/* 참여자 확인 버튼 */}
        <button
          type="button"
          className="border-2 border-blue-500 text-blue-500 w-full py-2 rounded-lg hover:bg-primary hover:text-white transition-colors"
          onClick={confirmParticipants}
        >
          참여자 확인
        </button>
        </div>
      </form>
    </div>
  );
};

export default EmailInput;