import Head from "next/head";
import { Bell, ChevronDown, CircleX, LoaderCircle, LogOut, Move, Play, Search, Square, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

type ApiResponse = {
};

const mockData: ApiResponse = {
};

function useFetchData() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data' + err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}

export default function SquarePuzzleGame() {
  const { data, loading } = useFetchData();
  const [ currentPage, setCurrentPage ] = useState<string>('Home');
  const [ gridMode, setGridMode ] = useState<3|4>(3);

  const HomePage = () => {
    return(
      <div className="relative z-10 font-['Inter'] text-white min-h-screen w-full flex flex-col justify-center items-center">
        <div className="flex justify-center items-center space-x-4 mb-10">
          <img
            src="https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/logo-light-puzzle.png"
            alt="Logo Light Puzzle"
            className={`w-24 object-cover`}
          />
          <h1 className="font-['Anta'] text-[5rem] font-black">Light Puzzle</h1>
        </div>
  
        <div className="flex flex-col space-y-6 mb-14">
          
          <p className="text-white text-xl text-center">Turn off all the lights in minimal moves!</p>
          
          <div className="py-4 px-6 rounded-lg bg-gray-900/70 w-[400px]">
            <p className="font-['Anta'] mb-4 text-[1.5rem] font-bold text-[#FBBC23]">HOW TO PLAY</p>
            <div className="mb-2 flex items-center w-full space-x-2">
              <Square />
              <p className="text-[0.8rem]">Click any square to toggle its state</p>
            </div>
            <div className="mb-2 flex items-center w-full space-x-2">
              <Move />
              <p className="text-[0.8rem]">Adjacent squares will also toggle</p>
            </div>
            <div className="mb-2 flex items-center w-full space-x-2">
              <Trophy />
              <p className="text-[0.8rem]">Win by turning all lights OFF</p>
            </div>
          </div>
  
          <p className="text-white text-md text-center">CHOOSE YOUR GRID SIZE</p>

          <div className="flex justify-center items-center text-[#2E2C34] space-x-4">
            <button onClick={() => setGridMode(3)} className={`
              bg-[#FBBF24] py-2 px-4 rounded-md flex justify-center items-center space-x-2 w-[190px]
              ${gridMode === 3 && 'border-4 border-[#FF4470] '}
            `}>
              <p className="font-['Anta'] text-2xl font-black">3</p>
              <CircleX />
              <p className="font-['Anta'] text-2xl font-black">3</p>
            </button>
            <button onClick={() => setGridMode(4)} className={`
              bg-[#FBBF24] py-2 px-4 rounded-md flex justify-center items-center space-x-2 w-[190px]
              ${gridMode === 4 && 'border-4 border-[#FF4470] '}
            `}>
              <p className="font-['Anta'] text-2xl font-black">4</p>
              <CircleX />
              <p className="font-['Anta'] text-2xl font-black">4</p>
            </button>
          </div>
  
        </div>
  
        <button onClick={() => setCurrentPage('Game')} className="bg-[#328EFF] px-4 py-3 rounded-md flex justify-center items-center space-x-2">
          <Play />
          <p className="text-white">Start Playing</p>
        </button>
  
      </div>
    );
  }

  const GamePage = () => {
    return(
      <div className="relative z-10 text-white min-h-screen w-full flex flex-col justify-center items-center">
        
      </div>
    );
  }

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

      <div className="min-h-screen bg-fixed bg-top bg-cover bg-no-repeat" style={{backgroundImage: "url('https://base-discordia-app.s3.us-east-2.amazonaws.com/revelo-images/bg-wall.jpeg')"}}>

        <div className="absolute inset-0 bg-[#53505B] bg-opacity-90 z-0" />
        
        { currentPage === 'Home' && HomePage() }
        { currentPage === 'Game' && GamePage() }

      </div>

    </>
  );
}
