import Head from "next/head";
import { CircleX, Move, Play, RotateCw, Square, Star, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface SquareType {
  id: number;
  state: boolean;
}

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  currentGridMode: 3 | 4;
  setCurrentGridMode: (mode: 3 | 4) => void;
}

interface GamePageProps {
  currentGridMode: 3 | 4;
  currentMoves: number;
  setMoves: React.Dispatch<React.SetStateAction<number>>;
}

const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  currentGridMode,
  setCurrentGridMode,
}) => {
  return (
    <div className="relative z-10 font-['Inter'] text-white min-h-screen max-h-screen w-full flex flex-col justify-center items-center">
      <div className="flex justify-center items-center space-x-4 mb-4 2xl:mb-10">
        <img
        src="https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/logo-light-puzzle.png"
        alt="Logo Light Puzzle"
        className={`w-16 xl:w-20 2xl:w-24 object-cover`}
        />
        <h1 className="font-['Anta'] text-[2.7rem] md:text-[4rem] 2xl:text-[5rem] font-black">Light Puzzle</h1>
        </div>

        <div className="flex flex-col lg:space-y-3 2xl:space-y-6 mb-6 xl:mb-8 2xl:mb-14">
        
        <p className="text-white mb-3 text-md 2xl:text-xl text-center xl:mb-4">Turn off all the lights in minimal moves!</p>
        
        <div className="py-4 px-6 rounded-lg bg-gray-900/70 w-full md:max-w-[400px]">
        <p className="font-['Anta'] mb-4 text-[1.5rem] font-black text-[#FBBC23]">HOW TO PLAY</p>
        <div className="mb-2 flex items-center w-full space-x-2">
          <Square size={20} />
          <p className="text-[0.8rem]">Click any square to toggle its state</p>
        </div>
        <div className="mb-2 flex items-center w-full space-x-2">
          <Move size={20} />
          <p className="text-[0.8rem]">Adjacent squares will also toggle</p>
        </div>
        <div className="mb-2 flex items-center w-full space-x-2">
          <Trophy size={20} />
          <p className="text-[0.8rem]">Win by turning all lights OFF</p>
        </div>
        </div>

        <p className="text-white my-4 lg:text-md text-center">CHOOSE YOUR GRID SIZE</p>


        <div className="flex justify-between items-center text-[#2E2C34] w-full md:max-w-[400px]">
          <button type="button" onClick={() => setCurrentGridMode(3)} className={`
            bg-[#FBBF24] py-2 px-4 rounded-md flex justify-center items-center space-x-2 w-[45%] max-w-[190px]
            ${currentGridMode === 3 && 'border-4 border-[#FF4470] '}
          `}>
            <p className="font-['Anta'] text-2xl font-black">3</p>
            <CircleX />
            <p className="font-['Anta'] text-2xl font-black">3</p>
          </button>
          <button type="button" onClick={() => setCurrentGridMode(4)} className={`
            bg-[#FBBF24] py-2 px-4 rounded-md flex justify-center items-center space-x-2 w-[45%] max-w-[190px]
            ${currentGridMode === 4 && 'border-4 border-[#FF4470] '}
          `}>
            <p className="font-['Anta'] text-2xl font-black">4</p>
            <CircleX />
            <p className="font-['Anta'] text-2xl font-black">4</p>
          </button>
        </div>

        </div>

        <button 
          onClick={() => setCurrentPage('Game')} 
          className="bg-[#328EFF] px-4 py-3 rounded-md flex justify-center items-center space-x-2 shadow-[rgba(0,0,0,0.2)_0px_3px_5px_5px]">
          <Play size={20} />
          <p className="text-white">Start Playing</p>
        </button>
    </div>
  );
};

const GamePage: React.FC<GamePageProps> = ({
  currentGridMode,
  currentMoves,
  setMoves,
}) => {
  const [squares, setSquares] = useState<SquareType[]>([]);
  const [isWin, setIsWin] = useState(false);

  const initializeGrid = (size: 3 | 4) => {
    const totalSquares = size * size;
    const ids = Array.from({ length: totalSquares }, (_, i) => i);

    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    const newGrid = ids.map((id) => ({ id, state: Math.random() < 0.5 }));
    return newGrid;
  };

  const resetGame = () => {
    setSquares(initializeGrid(currentGridMode));
    setMoves(0);
    setIsWin(false);
  };

  useEffect(() => {
    const allOff = squares.every(square => !square.state);
    if (allOff && squares.length > 0) {
      setIsWin(true);
    }
  }, [squares]);

  useEffect(() => {
    setSquares(initializeGrid(currentGridMode));
  }, [currentGridMode]);

  const handleSquareClick = (clickedId: number) => {
    if (isWin) return;

    setSquares((prevSquares) =>
      prevSquares.map((square) =>
        square.id === clickedId
          ? { ...square, state: !square.state }
          : square
      )
    );

    setMoves((prevMoves: number) => prevMoves + 1);
  };

  return (
    <div className="relative z-10 font-['Inter'] min-h-screen text-white w-full flex flex-col justify-center items-center">   
      {
        !isWin ? 
          <>
            <div className="flex justify-center items-center space-x-4 2xl:mb-10">
              <img
              src="https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/logo-light-puzzle.png"
              alt="Logo Light Puzzle"
              className={`w-16 2xl:w-24 object-cover`}
              />
              <h1 className="font-['Anta'] text-[2.7rem] md:text-[3.3rem] 2xl:text-[5rem] font-black">Light Puzzle</h1>
            </div>


            <div className="flex flex-col lg:space-y-2 2xl:space-y-6 mb-4 2xl:mb-14 w-full md:max-w-[500px]">
            
              <p className="text-white m-3 text-md 2xl:text-xl text-center">Turn off all the lights in minimal moves!</p>


              <div className="bg-gray-400/80 p-4 flex justify-between items-center mx-3 md:mx-0 rounded-xl">

              <div className="flex justify-center items-center space-x-2">
                <p>Moves:</p>
                <p className="text-xl"><strong>{currentMoves}</strong></p>
              </div>


              <button type="button" onClick={resetGame} className="bg-[#4297fe] py-2 px-6 rounded-md flex justify-center items-center space-x-2 shadow-[rgba(0,0,0,0.2)_0px_3px_5px_5px]">
                <RotateCw size={20} />
                <p className="text-white">Reset</p>
              </button>


              </div>
          
            </div>


            <div className={`
                grid gap-2 sm:gap-4 p-2 sm:p-4 rounded-lg bg-gray-900/70 w-full md:max-w-[300px] 2xl:max-w-[400px] aspect-square
                ${currentGridMode === 3 ? 'grid-cols-3' : 'grid-cols-4'} 
              `}>
              {squares.map((item) => (
                <button
                  type="button"
                  onClick={() => handleSquareClick(item.id)}
                  key={item.id}
                  aria-label={`Square ${item.id + 1} - State: ${item.state ? 'On' : 'Off'}`}
                  className={`
                    rounded-lg transition-colors duration-150 ease-in-out w-full h-full
                    ${item.state ? 'bg-[#FBBF24] hover:bg-yellow-500' : 'bg-[#585561] hover:bg-gray-600'}
                  `}
                />
              ))}
            </div>
          </>
        :
          <>
            <div className="flex flex-col justify-center items-center 2xl:mb-4">
            <Trophy className="text-[#FBBF24]" size={80} />
            <h1 className="text-[2.7rem] md:text-[3.2rem] -mt-4 2xl:text-[5rem] font-semibold">Victory!</h1>
            </div>


            <div className={`px-4 rounded-lg bg-gray-900/70 w-full max-w-[300px] sm:max-w-[400px]`}>
              <div className="flex justify-between items-center border-b border-gray-500">
                <p className="text-white text-xl text-center">Total Moves</p>
                <h1 className="font-['Anta'] text-[5rem] text-[#FBBF24] font-black">{currentMoves}</h1>
              </div>
              <div className="flex flex-col justify-between items-center 2xl:space-y-4 xl:space-y-2 p-2 2xl:p-4">
                <div className="flex justify-center items-center space-x-2 mt-2">
                  <Star size={24} className={`p-2 text-[#FBBF24] bg-[#524F5A] rounded-full w-10 h-10`} />
                  <Star size={24} className={`p-2 text-[#FBBF24] bg-[#524F5A] rounded-full w-10 h-10`} />
                  <Star size={24} className={`p-2 bg-[#524F5A] rounded-full w-10 h-10`} />
                </div>
                <p className="text-white text-md text-center xl:mb-4">GREAT JOB!</p>
              </div>
            </div>

            <button onClick={resetGame} className="bg-[#328EFF] px-4 w-full max-w-[300px] sm:max-w-[400px] py-3 rounded-md flex justify-center items-center space-x-2 mt-8 2xl:mb-10 shadow-[rgba(0,0,0,0.2)_0px_3px_5px_5px]">
              <RotateCw size={20} />
              <p className="text-white">Play Again</p>
            </button>

            <div className="flex justify-center items-center space-x-4 mt-4">
              <img
              src="https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/logo-light-puzzle.png"
              alt="Logo Light Puzzle"
              className={`w-14 object-cover`}
              />
              <h1 className="font-['Anta'] text-[2.7rem] font-black">Light Puzzle</h1>
            </div>

          </>
      }   

    </div>
  );
};

export default function SquarePuzzleGame() {
  const [currentPage, setCurrentPage] = useState<string>("Home");
  const [currentGridMode, setCurrentGridMode] = useState<3 | 4>(3);
  const [currentMoves, setMoves] = useState<number>(0);

  return (
    <>
      <Head>
        <title>Light Puzzle</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
        href="https://fonts.googleapis.com/css2?family=Anta&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"/>
      </Head>

      <div className="min-h-screen bg-fixed bg-top bg-cover bg-no-repeat" style={{ backgroundImage: "url('https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/bg-wall.jpeg')" }}>
        <div className="absolute inset-0 bg-[#53505B] bg-opacity-90 z-0" />

        {currentPage === "Home" && (
          <HomePage
            setCurrentPage={setCurrentPage}
            currentGridMode={currentGridMode}
            setCurrentGridMode={setCurrentGridMode}
          />
        )}

        {currentPage === "Game" && (
          <GamePage
            currentGridMode={currentGridMode}
            currentMoves={currentMoves}
            setMoves={setMoves}
          />
        )}
      </div>
    </>
  );
}