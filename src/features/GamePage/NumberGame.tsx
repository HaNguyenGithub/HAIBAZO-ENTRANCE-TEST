import React, { useState, useEffect } from "react";
import './NumberGame.css'; // Import file CSS

interface Element {
  number: number;
  position: { x: number; y: number };
}

export const NumberGame = () => {
  const [numberOfElements, setNumberOfElements] = useState<number>(3);
  const [time, setTime] = useState<number>(0); 
  const [started, setStarted] = useState<boolean>(false);
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElements, setSelectedElements] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("Let's Play"); 

  // Hàm tạo vị trí ngẫu nhiên cho các phần tử
  const generateRandomPositions = (count: number) => {
    const positions = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 250; 
      const y = Math.random() * 250; 
      positions.push({ x, y });
    }
    return positions;
  };

  // Hàm bắt đầu hoặc reset trò chơi
  const startOrResetGame = () => {
    const newElements = Array.from({ length: numberOfElements }, (_, i) => i + 1);
    const randomPositions = generateRandomPositions(numberOfElements); 

    const elementsWithPositions: Element[] = newElements.map((element, index) => ({
      number: element,
      position: randomPositions[index],
    }));

    setElements(elementsWithPositions);
    setSelectedElements([]); 
    setTime(0); 
    setStarted(true); 
    setTitle("Let's Play");
  };

  // useEffect để đếm thời gian khi trò chơi đang chạy
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1); 
      }, 100);
    }
    return () => clearInterval(timer); 
  }, [started]);

  // Hàm xử lý khi người chơi nhấn vào phần tử
  const handleElementClick = (element: number) => {
    if (!started) return;

    const nextElement = selectedElements.length + 1;

    if (element === nextElement) {
      // Người chơi chọn đúng phần tử tiếp theo
      setSelectedElements([...selectedElements, element]);

      // Đổi màu sang đỏ và sau đó biến mất sau 0.35 giây
      setTimeout(() => {
        setElements((prevElements) => prevElements.filter((el) => el.number !== element));
      }, 350);

      // Nếu người chơi chọn đúng tất cả các phần tử
      if (nextElement === numberOfElements) {
        setTitle("ALL CLEARED");
        setStarted(false); // Dừng thời gian khi trò chơi hoàn thành
      }
    } else {
      // Người chơi chọn sai
      setStarted(false); 
      setTitle("GAME OVER");
    }
  };

  return (
    <div className="game-container">
      <div className="game-frame">
        <div className="input-container">
          <div>
            <h3 className={`game-title ${title === "ALL CLEARED" ? "green" : title === "GAME OVER" ? "red" : ""}`}>
              {title}
            </h3>
          </div>
          <div className="point">
            <span>Point: </span>
            <input
              value={numberOfElements}
              onChange={(e) => setNumberOfElements(Number(e.target.value))}
            />
          </div>
          <br />
          <div className="game-time">
            <span>Time: </span> 
            <span>{time.toFixed(1)}s</span>
          </div>
          <button className="button-play" onClick={startOrResetGame}>
            {started ? "Restart" : "Play"}
          </button>
        </div>
        <div className="game-area">
          {elements.map(({ number, position }) => (
            <div
              key={number}
              onClick={() => handleElementClick(number)}
              className={`element ${selectedElements.includes(number) ? "red" : "default"}`}
              style={{
                top: position.y,
                left: position.x,
              }}
            >
              {number}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}