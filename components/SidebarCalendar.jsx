import { useState } from "react";

const SidebarCalendar = () => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());

  // 달력 생성 함수
  const generateCalendar = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const firstDay = firstDayOfMonth.getDay(); // 첫 번째 날 (0: Sunday, 1: Monday, ...)
    const daysInMonth = lastDayOfMonth.getDate(); // 해당 월의 마지막 날 (일자)

    const days = [];

    // 첫 번째 주까지 공백 채우기 (월요일~일요일)
    for (let i = 0; i < firstDay; i++) {
      days.push(null); // 빈 공간
    }

    // 날짜 추가 (1일부터 마지막 날짜까지)
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // 이전 월로 이동
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 다음 월로 이동
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 현재 날짜 체크
  const isToday = (day) => {
    const today = new Date();
    return today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  };

  // 일요일인지 확인
  const isSunday = (index) => {
    return index % 7 === 0; // 일요일은 0, 7, 14, ...로 계산
  };

  const days = generateCalendar();

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-lg font-bold text-gray-600">
          {"<"}
        </button>
        <h3 className="text-xl font-semibold">{`${currentYear}년 ${currentMonth + 1}월`}</h3>
        <button onClick={nextMonth} className="text-lg font-bold text-gray-600">
          {">"}
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {/* 요일 헤더 */}
        <div className="font-semibold text-red-500">일</div>
        <div className="font-semibold">월</div>
        <div className="font-semibold">화</div>
        <div className="font-semibold">수</div>
        <div className="font-semibold">목</div>
        <div className="font-semibold">금</div>
        <div className="font-semibold">토</div>

        {/* 날짜들 */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`p-1 rounded-lg cursor-pointer ${
              isToday(day)
                ? "bg-primary text-white"
                : isSunday(index)
                ? "text-red"
                : "text-gray-800"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarCalendar;
