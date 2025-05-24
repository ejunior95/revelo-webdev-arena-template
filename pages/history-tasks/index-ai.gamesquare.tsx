import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Github,
  Trophy,
  Info,
  X,
  Award,
  Star,
  Heart,
  Zap,
  TrendingUp,
  BarChart3,
  Clock,
  Medal,
  Brain,
  Target,
  Lightbulb,
  HelpCircle,
  ChevronRight,
  TrophyIcon,
  Flame,
  Diamond,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const GridSize = 4;
const GridSizeSquared = GridSize * GridSize;

const createInitialGrid = () => {
  const grid = [];
  for (let i = 0; i < GridSizeSquared; i++) {
    grid.push(Math.random() < 0.2);
  }
  return grid;
};

const adjacentIndices = (index: number) => {
  const row = Math.floor(index / GridSize);
  const col = index % GridSize;
  const adjacent = [];

  if (row > 0) adjacent.push(index - GridSize); // Above
  if (row < GridSize - 1) adjacent.push(index + GridSize); // Below
  if (col > 0) adjacent.push(index - 1); // Left
  if (col < GridSize - 1) adjacent.push(index + 1); // Right

  return adjacent;
};

const getBackgroundGradient = (moves: number, isDark: boolean) => {
  if (moves === 0) {
    return isDark
      ? "from-emerald-800 via-cyan-900 to-emerald-800"
      : "from-emerald-100 via-cyan-200 to-emerald-100";
  }

  const intensity = Math.min(moves, 30);
  const saturation = isDark ? 80 - intensity * 0.5 : 70 + intensity * 0.3;
  const hue = isDark ? 200 - intensity * 2 : 200 - intensity * 3;

  return isDark
    ? `from-hsl(${hue}, ${saturation}%, 15%) via-hsl(${hue - 10}, ${
        saturation + 5
      }%, 20%) to-hsl(${hue}, ${saturation}%, 15%)`
    : `from-hsl(${hue}, ${saturation}%, 85%) via-hsl(${hue - 10}, ${
        saturation + 5
      }%, 90%) to-hsl(${hue}, ${saturation}%, 85%)`;
};

const getMovesTheme = (moves: number, isDark: boolean) => {
  if (moves === 0) {
    return {
      bg: isDark ? "bg-emerald-800" : "bg-emerald-100",
      text: isDark ? "text-emerald-200" : "text-emerald-800",
      icon: isDark ? "text-emerald-400" : "text-emerald-600",
    };
  }

  const intensity = Math.min(moves, 30);
  const saturation = isDark ? 80 - intensity * 0.5 : 70 + intensity * 0.3;
  const hue = isDark ? 200 - intensity * 2 : 200 - intensity * 3;

  return {
    bg: isDark
      ? `bg-hsl(${hue}, ${saturation}%, 15%)`
      : `bg-hsl(${hue}, ${saturation}%, 85%)`,
    text: isDark
      ? `text-hsl(${hue}, ${saturation + 20}%, 80%)`
      : `text-hsl(${hue}, ${saturation - 20}%, 20%)`,
    icon: isDark
      ? `text-hsl(${hue}, ${saturation + 30}%, 70%)`
      : `text-hsl(${hue}, ${saturation - 10}%, 40%)`,
  };
};

const getMovesMessage = (moves: number) => {
  if (moves === 0) return { text: "Perfect!", icon: <TrophyIcon /> };
  if (moves <= 6) return { text: "Brilliant!", icon: <Diamond /> };
  if (moves <= 8) return { text: "Great!", icon: <Crown /> };
  if (moves <= 10) return { text: "Good!", icon: <Star /> };
  return { text: "Keep trying!", icon: <Zap /> };
};

const getWinMessage = (moves: number) => {
  if (moves === 0) return "Perfect! You solved it with no moves!";
  if (moves <= 5) return "Incredible! Minimal moves!";
  if (moves <= 8) return "Excellent! Well done!";
  if (moves <= 10) return "Great job! Solved!";
  return "Puzzle solved!";
};

const getBestMovesText = (bestMoves: number | null) => {
  if (bestMoves === null) return "Best: -";
  if (bestMoves === 0) return "Perfect!";
  return `Best: ${bestMoves}`;
};

const getGridTheme = (isDark: boolean) => {
  return {
    true: {
      cell: isDark ? "bg-emerald-600" : "bg-emerald-400",
      glow: isDark ? "bg-emerald-400/30" : "bg-emerald-400/50",
    },
    false: {
      cell: isDark ? "bg-gray-800" : "bg-gray-200",
      glow: isDark ? "bg-gray-400/20" : "bg-gray-400/30",
    },
  };
};

const generateGameId = () => {
  return Math.random().toString(36).substring(2, 11);
};

const LightbulbIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 14c.2-1 .7-1.5 1.5-2.2 1-.8 1.5-1.8 1.5-3.3a6 6 0 0 0-12 0c0 1.4.6 2.5 1.5 3.2.7.7 1 1.2 1.2 2" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export default function Page() {
  const [grid, setGrid] = useState(createInitialGrid);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const [bestMoves, setBestMoves] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [animateWin, setAnimateWin] = useState(false);
  const [currentGameId, setCurrentGameId] = useState(generateGameId);
  const [stats, setStats] = useState({
    totalGames: 0,
    gamesWon: 0,
    bestMoves: Infinity,
    winRate: 0,
    averageMoves: 0,
    totalMoves: 0,
    perfectGames: 0,
  });
  const [showStats, setShowStats] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winMessage, setWinMessage] = useState("");
  const [movesMessage, setMovesMessage] = useState({
    text: "Perfect!",
    icon: <TrophyIcon />,
  });
  const [activeTab, setActiveTab] = useState("game");
  const [gameStarted, setGameStarted] = useState(false);
  const [initialGrid, setInitialGrid] = useState(createInitialGrid());
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    const savedBestMoves = localStorage.getItem("bestMoves");
    if (savedBestMoves) {
      setBestMoves(parseInt(savedBestMoves, 10));
    }

    const savedStats = localStorage.getItem("lightLogicStats");
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      setStats({
        totalGames: parsedStats.totalGames || 0,
        gamesWon: parsedStats.gamesWon || 0,
        bestMoves: parsedStats.bestMoves || Infinity,
        winRate: parsedStats.winRate || 0,
        averageMoves: parsedStats.averageMoves || 0,
        totalMoves: parsedStats.totalMoves || 0,
        perfectGames: parsedStats.perfectGames || 0,
      });
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    localStorage.setItem("darkMode", String(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (bestMoves !== null) {
      localStorage.setItem("bestMoves", String(bestMoves));
    }
  }, [bestMoves, isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (gameWon) {
      const newStats = {
        totalGames: stats.totalGames + 1,
        gamesWon: stats.gamesWon + 1,
        bestMoves: Math.min(stats.bestMoves, moves),
        totalMoves: stats.totalMoves + moves,
        perfectGames: moves === 0 ? stats.perfectGames + 1 : stats.perfectGames,
      };
      newStats.averageMoves =
        newStats.totalGames > 0
          ? newStats.totalMoves / newStats.totalGames
          : 0;
      newStats.winRate =
        newStats.totalGames > 0
          ? (newStats.gamesWon / newStats.totalGames) * 100
          : 0;

      setStats(newStats);
      localStorage.setItem("lightLogicStats", JSON.stringify(newStats));
    } else if (gameOver) {
      const newStats = {
        ...stats,
        totalGames: stats.totalGames + 1,
      };
      newStats.winRate =
        newStats.totalGames > 0
          ? (newStats.gamesWon / newStats.totalGames) * 100
          : 0;

      setStats(newStats);
      localStorage.setItem("lightLogicStats", JSON.stringify(newStats));
    }
  }, [gameWon, gameOver, isClient]);

  useEffect(() => {
    if (gameWon) {
      setAnimateWin(true);
      setShowWinModal(true);
      setWinMessage(getWinMessage(moves));
      setMovesMessage(getMovesMessage(moves));

      if (moves === 0) {
        toast({
          title: "Perfect Game!",
          description: "You solved it with no moves!",
          duration: 3000,
        });
      } else if (moves <= 6) {
        toast({
          title: "Incredible!",
          description: `Solved in only ${moves} moves!`,
          duration: 3000,
        });
      }
    }
  }, [gameWon, moves]);

  useEffect(() => {
    if (gameWon) {
      if (bestMoves === null || moves < bestMoves) {
        setBestMoves(moves);
      }
    }
  }, [gameWon, moves, bestMoves]);

  useEffect(() => {
    if (gameOver && !gameWon) {
      toast({
        title: "Game Over",
        description: "You lost! Try again?",
        variant: "destructive",
        duration: 3000,
      });
    }
  }, [gameOver, gameWon]);

  const handleCellClick = (index: number) => {
    if (gameOver || gameWon) return;

    setGameStarted(true);
    setMoves(moves + 1);
    const newGrid = [...grid];
    newGrid[index] = !newGrid[index];
    const adjacent = adjacentIndices(index);
    for (const adjIndex of adjacent) {
      newGrid[adjIndex] = !newGrid[adjIndex];
    }
    setGrid(newGrid);

    const allOff = newGrid.every((cell) => !cell);
    if (allOff) {
      setGameWon(true);
    }

    const allOn = newGrid.every((cell) => cell);
    if (allOn) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    const newGrid = createInitialGrid();
    setInitialGrid(newGrid);
    setGrid(newGrid);
    setMoves(0);
    setGameOver(false);
    setGameWon(false);
    setAnimateWin(false);
    setShowWinModal(false);
    setCurrentGameId(generateGameId());
    setGameStarted(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  const gridTheme = getGridTheme(darkMode);
  const movesTheme = getMovesTheme(moves, darkMode);
  const movesData = getMovesMessage(moves);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500/50 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 bg-gradient-to-br ${
        darkMode ? "from-gray-900 via-cyan-950 to-emerald-900" : "from-gray-50 via-cyan-50 to-emerald-50"
      } ${getBackgroundGradient(moves, darkMode)}`}
    >
      <Toaster />
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap");

        html {
          font-family: "Inter", sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Poppins", sans-serif;
        }

        body {
          transition: background-color 0.5s ease, color 0.5s ease;
        }

        .dark {
          color-scheme: dark;
        }

        .win-animation {
          animation: winPulse 2s infinite;
        }

        @keyframes winPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .game-grid {
          grid-template-columns: repeat(${GridSize}, 1fr);
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .game-grid {
            gap: 1rem;
          }
        }

        .cell {
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .cell {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        .cell:hover:not(.game-over) {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .dark .cell:hover:not(.game-over) {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }

        .cell:active:not(.game-over) {
          transform: translateY(2px);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
            0 1px 2px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .cell:active:not(.game-over) {
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3),
            0 1px 2px -1px rgba(0, 0, 0, 0.2);
        }

        .cell.game-over {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .moves-badge {
          min-width: 100px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .best-moves-badge {
          min-width: 80px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .game-over-screen {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .moves-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          animation: fadeIn 0.3s ease-out;
        }

        .game-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .game-grid-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 400px;
          margin: 0 auto;
        }

        .game-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(${GridSize}, 1fr);
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .game-grid {
            gap: 1rem;
          }
        }

        .control-panel {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .stat-card {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1rem;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .dark .stat-card {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .stat-card:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .dark .stat-card:hover {
          background-color: rgba(255, 255, 255, 0.08);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .stat-icon {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          background-color: rgba(16, 185, 129, 0.2);
          color: rgb(16, 185, 129);
        }

        .stat-icon svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .progress-bar {
          height: 0.75rem;
          border-radius: 999px;
          overflow: hidden;
          background-color: rgba(255, 255, 255, 0.1);
          margin-top: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background-color: rgb(16, 185, 129);
          transition: width 0.5s ease;
        }

        .game-title {
          font-size: 1.875rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          margin-bottom: 0.5rem;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          padding: 0.25rem 0;
        }

        @media (min-width: 768px) {
          .game-title {
            font-size: 2.5rem;
          }
        }

        .game-subtitle {
          font-size: 1rem;
          opacity: 0.8;
          margin-bottom: 1.5rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 768px) {
          .game-subtitle {
            font-size: 1.125rem;
          }
        }

        .control-button {
          transition: all 0.2s ease;
          border-radius: 9999px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .control-button {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        .control-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .dark .control-button:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }

        .control-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
            0 1px 2px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .control-button:active {
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3),
            0 1px 2px -1px rgba(0, 0, 0, 0.2);
        }

        .theme-toggle {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 50;
          border-radius: 9999px;
          padding: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .theme-toggle {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        .theme-toggle:hover {
          transform: scale(1.05);
        }

        .theme-toggle:active {
          transform: scale(0.95);
        }

        .instruction-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .instruction-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .instruction-icon {
          flex-shrink: 0;
          width: 1.5rem;
          height: 1.5rem;
          margin-top: 0.25rem;
        }

        .tab-container {
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-button {
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab-button.active {
          font-weight: 600;
        }

        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          border-radius: 2px;
        }

        .tab-content {
          padding: 1rem 0;
        }

        .pattern-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .pattern-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .pattern-card {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pattern-mini-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.25rem;
          aspect-ratio: 1 / 1;
        }

        .pattern-cell {
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .pattern-cell.on {
          background-color: rgb(16, 185, 129);
        }

        .pattern-cell.off {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .dark .pattern-cell.off {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .pattern-label {
          font-size: 0.75rem;
          text-align: center;
          font-weight: 500;
        }

        .win-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.5s ease-out;
        }

        .win-card {
          background-color: rgba(17, 24, 39, 0.9);
          border-radius: 24px;
          padding: 2rem;
          max-width: 90%;
          width: 400px;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: scaleIn 0.5s ease-out;
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .win-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
        }

        .win-icon-container {
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem auto;
          background: linear-gradient(
            to right,
            rgba(16, 185, 129, 0.2),
            rgba(6, 182, 212, 0.2)
          );
          position: relative;
        }

        .win-icon {
          width: 3rem;
          height: 3rem;
          color: rgb(16, 185, 129);
          animation: winPulse 2s infinite;
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear infinite, confetti-shake 0.5s ease-in-out infinite;
        }

        @keyframes confetti-fall {
          0% {
            top: -10px;
          }
          100% {
            top: 100vh;
          }
        }

        @keyframes confetti-shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(100px) rotate(360deg);
          }
        }

        .win-card h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .win-card p {
          opacity: 0.8;
          margin-bottom: 1.5rem;
        }

        .win-stat {
          background-color: rgba(16, 185, 129, 0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .win-stat div:first-child {
          font-size: 0.875rem;
          opacity: 0.7;
          margin-bottom: 0.25rem;
        }

        .win-stat div:last-child {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(16, 185, 129);
        }

        .win-button {
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5),
            0 8px 10px -6px rgba(16, 185, 129, 0.5);
          margin-top: 1rem;
        }

        .win-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6),
            0 12px 14px -6px rgba(16, 185, 129, 0.6);
        }

        .win-button:active {
          transform: translateY(1px);
          box-shadow: 0 5px 15px -3px rgba(16, 185, 129, 0.4),
            0 4px 6px -4px rgba(16, 185, 129, 0.4);
        }

        .game-over-card {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 12px;
          padding: 1.25rem;
          margin: 1.5rem 0;
          backdrop-filter: blur(4px);
        }

        .game-over-title {
          color: rgb(239, 68, 68);
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .game-over-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        .dark .game-over-text {
          color: rgba(255, 255, 255, 0.8);
        }

        .game-won-card {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 12px;
          padding: 1.25rem;
          margin: 1.5rem 0;
          backdrop-filter: blur(4px);
        }

        .game-won-title {
          color: rgb(16, 185, 129);
          font-weight: 700;
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .game-won-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        .dark .game-won-text {
          color: rgba(255, 255, 255, 0.8);
        }

        .restart-button {
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5),
            0 8px 10px -6px rgba(16, 185, 129, 0.5);
          margin-top: 1rem;
        }

        .restart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6),
            0 12px 14px -6px rgba(16, 185, 129, 0.6);
        }

        .restart-button:active {
          transform: translateY(1px);
          box-shadow: 0 5px 15px -3px rgba(16, 185, 129, 0.4),
            0 4px 6px -4px rgba(16, 185, 129, 0.4);
        }

        .game-info {
          margin: 1.5rem 0;
          padding: 1.25rem;
          border-radius: 12px;
          background-color: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .game-info-title {
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .game-info-text {
          font-size: 0.875rem;
          line-height: 1.6;
          opacity: 0.8;
        }

        .dark .game-info-text {
          color: rgba(255, 255, 255, 0.8);
        }

        .pattern-category {
          margin-bottom: 1.5rem;
        }

        .pattern-category-title {
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pattern-description {
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          opacity: 0.7;
          padding-left: 1.5rem;
        }

        .pattern-example {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .example-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .example-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.25rem;
          aspect-ratio: 1 / 1;
          max-width: 150px;
          margin: 0.5rem auto;
        }

        .example-cell {
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .example-cell.on {
          background-color: rgb(16, 185, 129);
        }

        .example-cell.off {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .dark .example-cell.off {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .example-text {
          font-size: 0.75rem;
          opacity: 0.7;
          text-align: center;
          margin-top: 0.25rem;
        }

        .win-stats {
          margin: 1.5rem 0;
        }

        .win-stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .win-stat-item:last-child {
          border-bottom: none;
        }

        .win-stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .win-stat-value {
          font-weight: 600;
          color: rgb(16, 185, 129);
        }

        .win-emoji {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .moves-emoji {
          font-size: 1.5rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.3s ease-out;
        }

        .modal-content {
          background-color: rgba(17, 24, 39, 0.95);
          border-radius: 24px;
          padding: 2rem;
          max-width: 90%;
          width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: scaleIn 0.3s ease-out;
        }

        .dark .modal-content {
          background-color: rgba(17, 24, 39, 0.95);
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: scale(1.1);
        }

        .modal-close:active {
          transform: scale(0.95);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .modal-text {
          font-size: 0.875rem;
          line-height: 1.7;
          opacity: 0.8;
          margin-bottom: 1.25rem;
        }

        .modal-section-title {
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          font-size: 1.125rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pattern-category {
          margin-bottom: 1.5rem;
        }

        .pattern-category-title {
          font-weight: 600;
          margin-bottom: 0.75rem;
          font-size: 1rem;
          opacity: 0.9;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .pattern-description {
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
          opacity: 0.7;
          padding-left: 1.5rem;
        }

        .pattern-example {
          background-color: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          padding: 0.75rem;
          margin-bottom: 0.75rem;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .example-title {
          font-weight: 500;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .example-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.25rem;
          aspect-ratio: 1 / 1;
          max-width: 150px;
          margin: 0.5rem auto;
        }

        .example-cell {
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .example-cell.on {
          background-color: rgb(16, 185, 129);
        }

        .example-cell.off {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .dark .example-cell.off {
          background-color: rgba(255, 255, 255, 0.05);
        }

        .example-text {
          font-size: 0.75rem;
          opacity: 0.7;
          text-align: center;
          margin-top: 0.25rem;
        }

        .win-stats {
          margin: 1.5rem 0;
        }

        .win-stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .win-stat-item:last-child {
          border-bottom: none;
        }

        .win-stat-label {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .win-stat-value {
          font-weight: 600;
          color: rgb(16, 185, 129);
        }

        .win-emoji {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .moves-emoji {
          font-size: 1.5rem;
        }

        .game-controls {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .game-control-btn {
          border-radius: 9999px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .game-control-btn {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        .game-control-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .dark .game-control-btn:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }

        .game-control-btn:active {
          transform: translateY(1px);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
            0 1px 2px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .game-control-btn:active {
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3),
            0 1px 2px -1px rgba(0, 0, 0, 0.2);
        }

        .tab-button {
          padding: 0.75rem 1.25rem;
          font-weight: 500;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 0.5rem 0.5rem 0 0;
          margin-right: 0.25rem;
        }

        .tab-button.active {
          font-weight: 600;
          background-color: rgba(16, 185, 129, 0.1);
          color: rgb(16, 185, 129);
        }

        .dark .tab-button.active {
          background-color: rgba(16, 185, 129, 0.2);
        }

        .tab-button.active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          border-radius: 2px;
        }

        .tab-content {
          padding: 1.5rem;
          background-color: rgba(17, 24, 39, 0.7);
          border-radius: 0 0.5rem 0.5rem 0.5rem;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .dark .tab-content {
          background-color: rgba(17, 24, 39, 0.8);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-right: 0.5rem;
          margin-bottom: 0.5rem;
          transition: all 0.2s ease;
        }

        .badge:hover {
          transform: translateY(-1px);
        }

        .stats-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: rgba(16, 185, 129, 0.1);
          color: rgb(16, 185, 129);
        }

        .stats-badge:hover {
          background-color: rgba(16, 185, 129, 0.2);
        }

        .moves-badge {
          min-width: 100px;
          text-align: center;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .dark .moves-badge {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .best-moves-badge {
          min-width: 80px;
          text-align: center;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .dark .best-moves-badge {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        }

        .status-message {
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          animation: fadeIn 0.3s ease-out;
        }

        .status-message.success {
          background-color: rgba(16, 185, 129, 0.1);
          color: rgb(16, 185, 129);
        }

        .status-message.failure {
          background-color: rgba(239, 68, 68, 0.1);
          color: rgb(239, 68, 68);
        }

        .control-panel {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .control-button {
          transition: all 0.2s ease;
          border-radius: 9999px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .control-button {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        .control-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .dark .control-button:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }

        .control-button:active {
          transform: translateY(1px);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
            0 1px 2px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .control-button:active {
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3),
            0 1px 2px -1px rgba(0, 0, 0, 0.2);
        }

        .restart-button {
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5),
            0 8px 10px -6px rgba(16, 185, 129, 0.5);
          margin-top: 1rem;
        }

        .restart-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6),
            0 12px 14px -6px rgba(16, 185, 129, 0.6);
        }

        .restart-button:active {
          transform: translateY(1px);
          box-shadow: 0 5px 15px -3px rgba(16, 185, 129, 0.4),
            0 4px 6px -4px rgba(16, 185, 129, 0.4);
        }

        .game-over-screen {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          animation: fadeIn 0.5s ease-out;
        }

        .game-over-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(
            to right,
            rgb(239, 68, 68),
            rgb(244, 114, 182)
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .game-over-text {
          opacity: 0.8;
          margin-bottom: 1.5rem;
          max-width: 300px;
        }

        .game-won-screen {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          animation: fadeIn 0.5s ease-out;
        }

        .game-won-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .game-won-text {
          opacity: 0.8;
          margin-bottom: 1.5rem;
          max-width: 300px;
        }

        .game-won-subtext {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .game-won-moves {
          font-size: 2rem;
          font-weight: 700;
          color: rgb(16, 185, 129);
          margin-bottom: 1rem;
        }

        .win-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          backdrop-filter: blur(8px);
          animation: fadeIn 0.5s ease-out;
        }

        .win-card {
          background-color: rgba(17, 24, 39, 0.9);
          border-radius: 24px;
          padding: 2rem;
          max-width: 90%;
          width: 400px;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: scaleIn 0.5s ease-out;
        }

        .win-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 8px;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
        }

        .win-icon-container {
          width: 6rem;
          height: 6rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem auto;
          background: linear-gradient(
            to right,
            rgba(16, 185, 129, 0.2),
            rgba(6, 182, 212, 0.2)
          );
          position: relative;
        }

        .win-icon {
          width: 3rem;
          height: 3rem;
          color: rgb(16, 185, 129);
          animation: winPulse 2s infinite;
        }

        @keyframes winPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 3s linear infinite,
            confetti-shake 0.5s ease-in-out infinite;
        }

        @keyframes confetti-fall {
          0% {
            top: -10px;
          }
          100% {
            top: 100vh;
          }
        }

        @keyframes confetti-shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(100px) rotate(360deg);
          }
        }

        .win-card h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .win-card p {
          opacity: 0.8;
          margin-bottom: 1.5rem;
        }

        .win-stat {
          background-color: rgba(16, 185, 129, 0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .win-stat div:first-child {
          font-size: 0.875rem;
          opacity: 0.7;
          margin-bottom: 0.25rem;
        }

        .win-stat div:last-child {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgb(16, 185, 129);
        }

        .win-button {
          background: linear-gradient(
            to right,
            rgb(16, 185, 129),
            rgb(6, 182, 212)
          );
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.5),
            0 8px 10px -6px rgba(16, 185, 129, 0.5);
          margin-top: 1rem;
        }

        .win-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6),
            0 12px 14px -6px rgba(16, 185, 129, 0.6);
        }

        .win-button:active {
          transform: translateY(1px);
          box-shadow: 0 5px 15px -3px rgba(16, 185, 129, 0.4),
            0 4px 6px -4px rgba(16, 185, 129, 0.4);
        }

        .game-container {
          position: relative;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }

        .game-grid-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 400px;
          margin: 0 auto;
        }

        .game-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(${GridSize}, 1fr);
          gap: 0.75rem;
        }

        @media (min-width: 768px) {
          .game-grid {
            gap: 1rem;
          }
        }

        .cell {
          aspect-ratio: 1 / 1;
          border-radius: 12px;
          transition: all 0.2s ease;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .cell {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3),
            0 2px 4px -1px rgba(0, 0, 0, 0.2);
        }

        .cell:hover:not(.game-over) {
          transform: translateY(-4px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .dark .cell:hover:not(.game-over) {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
            0 4px 6px -2px rgba(0, 0, 0, 0.2);
        }

        .cell:active:not(.game-over) {
          transform: translateY(2px);
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1),
            0 1px 2px -1px rgba(0, 0, 0, 0.06);
        }

        .dark .cell:active:not(.game-over) {
          box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.3),
            0 1px 2px -1px rgba(0, 0, 0, 0.2);
        }

        .cell.game-over {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .cell {
          position: relative;
          overflow: hidden;
        }

        .cell-inner {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .cell-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 60%;
          border-radius: 50%;
          filter: blur(15px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cell.on .cell-glow {
          opacity: 1;
        }

        .cell-glow-light {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 70%;
          height: 70%;
          border-radius: 50%;
          filter: blur(20px);
          opacity: 0;
          animation: pulse 2s infinite;
        }

        .cell.on .cell-glow-light {
          opacity: 0.3;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        .cell-icon {
          position: relative;
          z-index: 10;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cell.on .cell-icon {
          filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.8));
        }

        .cell.off .cell-icon {
          opacity: 0.5;
        }

        .dark .cell.off .cell-icon {
          opacity: 0.3;
        }

        .cell:hover:not(.game-over) .cell-icon {
          transform: scale(1.1);
        }

        .cell.on .cell-inner {
          animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
          }
          100% {
            box-shadow: 0 0 20px rgba(16, 185, 129, 0.8);
          }
        }
      `}</style>

      <TooltipProvider>
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="game-title"
              >
                Light Logic
              </motion.h1>
              <Badge className="ml-2 sm:ml-3 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors">
                4x4
              </Badge>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="theme-toggle"
                    onClick={toggleDarkMode}
                    aria-label={
                      darkMode ? "Switch to light mode" : "Switch to dark mode"
                    }
                  >
                    {darkMode ? (
                      <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{darkMode ? "Light Mode" : "Dark Mode"}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="theme-toggle"
                    onClick={toggleStats}
                    aria-label="View statistics"
                  >
                    <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Statistics</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="theme-toggle"
                    onClick={toggleInstructions}
                    aria-label="Show instructions"
                  >
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How to Play</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="theme-toggle"
                    onClick={toggleAbout}
                    aria-label="About the game"
                  >
                    <Info className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>About</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <AnimatePresence mode="wait">
                {!gameStarted &&
                !gameWon &&
                !gameOver &&
                stats.totalGames === 0 ? (
                  <motion.div
                    key="welcome"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-20 h-20 mx-auto mb-4"
                    >
                      <LightbulbIcon className="w-full h-full text-emerald-500" />
                    </motion.div>
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent"
                    >
                      Welcome to Light Logic
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="mb-6 text-sm sm:text-base"
                    >
                      Turn all lights off in the fewest moves possible.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        className="restart-button"
                        onClick={() => setGameStarted(true)}
                      >
                        Start Game
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="game"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-2"
                      >
                        <Button
                          className="restart-button"
                          onClick={resetGame}
                        >
                          <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                          </motion.div>
                          New Game
                        </Button>
                      </motion.div>

                      <div className="flex items-center gap-2">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Badge
                            className={`best-moves-badge ${
                              bestMoves === 0
                                ? "bg-gradient-to-r from-emerald-600 to-cyan-600 text-white"
                                : darkMode
                                ? "bg-gray-800 text-emerald-300 border border-emerald-800/30"
                                : "bg-gray-100 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            <Trophy className="w-3 h-3 mr-1" />
                            {getBestMovesText(bestMoves)}
                          </Badge>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex items-center"
                        >
                          <Badge
                            className={`moves-badge ${movesTheme.bg} ${movesTheme.text}`}
                          >
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Clock className="w-3 h-3 mr-1" />
                            </motion.div>
                            {moves} moves
                          </Badge>
                        </motion.div>
                      </div>
                    </div>

                    <div className="game-container">
                      <motion.div
                        key={currentGameId}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="game-grid-container"
                      >
                        <div className="game-grid">
                          {grid.map((cell, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: 0.05 * index,
                                type: "spring",
                              }}
                              whileHover={{
                                scale: gameOver || gameWon ? 1 : 1.05,
                                y: gameOver || gameWon ? 0 : -5,
                              }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleCellClick(index)}
                              className={`cell ${
                                cell ? "on" : "off"
                              } ${gridTheme[cell ? "true" : "false"][
                                darkMode ? "cell" : "cell"
                              ]} ${
                                gameOver || gameWon ? "game-over" : ""
                              } cursor-pointer transition-all duration-300`}
                            >
                              <div className="cell-inner">
                                <div
                                  className={`cell-glow ${
                                    gridTheme[cell ? "true" : "false"][
                                      darkMode ? "glow" : "glow"
                                    ]
                                  }`}
                                ></div>
                                <div className="cell-glow-light"></div>
                                <div className="cell-icon">
                                  {cell ? (
                                    <Sun className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-400" />
                                  ) : (
                                    <Moon className="w-5 h-5 sm:w-7 sm:h-7 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {gameWon && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, type: "spring" }}
                            className="game-won-screen"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 300,
                              }}
                              className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4"
                            >
                              <Trophy className="w-10 h-10 text-white" />
                            </motion.div>
                            <motion.h2
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="game-won-title"
                            >
                              {winMessage}
                            </motion.h2>
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="game-won-text"
                            >
                              You solved it in {moves} moves!
                            </motion.p>
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={resetGame}
                              className="restart-button"
                            >
                              Play Again
                            </motion.button>
                          </motion.div>
                        )}

                        {gameOver && !gameWon && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, type: "spring" }}
                            className="game-over-screen"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 300,
                              }}
                              className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-4"
                            >
                              <X className="w-10 h-10 text-white" />
                            </motion.div>
                            <motion.h2
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="game-over-title"
                            >
                              Game Over
                            </motion.h2>
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="game-over-text"
                            >
                              All lights are on! Try again?
                            </motion.p>
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={resetGame}
                              className="restart-button"
                            >
                              Restart
                            </motion.button>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="control-panel"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="control-button"
                            onClick={toggleInstructions}
                          >
                            <HelpCircle className="w-4 h-4 mr-2" />
                            Help
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Show instructions</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            className="control-button"
                            onClick={toggleStats}
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Statistics
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View your stats</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="control-button"
                            onClick={resetGame}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            New Game
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Start a new game</p>
                        </TooltipContent>
                      </Tooltip>
                    </motion.div>

                    <AnimatePresence>
                      {gameWon && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="win-modal"
                        >
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="win-card"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 300,
                              }}
                              className="win-icon-container"
                            >
                              <Trophy className="win-icon" />
                            </motion.div>
                            <motion.h2
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="mb-2"
                            >
                              {winMessage}
                            </motion.h2>
                            <motion.p
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                              className="mb-6"
                            >
                              You solved the puzzle in {moves} moves!
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                              className="win-stats"
                            >
                              <div className="win-stat">
                                <div>Your Moves</div>
                                <div>{moves}</div>
                              </div>
                              <div className="win-stat">
                                <div>Best Moves</div>
                                <div>{bestMoves || "N/A"}</div>
                              </div>
                            </motion.div>
                            <motion.button
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.6 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={resetGame}
                              className="win-button"
                            >
                              Play Again
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </TooltipProvider>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-overlay"
            onClick={() => setShowInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="modal-close"
                onClick={() => setShowInstructions(false)}
              >
                <X className="w-4 h-4" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="modal-title"
              >
                How to Play
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="modal-text"
              >
                Click on a light to toggle it and its adjacent neighbors. Your
                goal is to turn all lights OFF.
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="modal-section-title"
              >
                <Target className="w-4 h-4 mr-2" />
                Objective
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="modal-text"
              >
                The game ends when all lights are OFF (you win!) or when all
                lights are ON (game over).
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="modal-section-title"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Strategy
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="modal-text"
              >
                Plan your moves carefully. Each move affects multiple lights,
                so think about the ripple effects of each click.
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="modal-section-title"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Challenge
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="modal-text"
              >
                Try to solve the puzzle with as few moves as possible. The
                fewer moves, the better!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-overlay"
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="modal-close"
                onClick={() => setShowAbout(false)}
              >
                <X className="w-4 h-4" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="modal-title"
              >
                About Light Logic
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="modal-text"
              >
                Light Logic is a challenging puzzle game based on the classic
                Lights Out game. It tests your logic and problem-solving skills
                as you try to turn all the lights off with the fewest moves
                possible.
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="modal-section-title"
              >
                <Brain className="w-4 h-4 mr-2" />
                How It Works
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="modal-text"
              >
                When you click a light, it toggles not only itself but also its
                immediate neighbors (up, down, left, right). The challenge is to
                find the optimal sequence of clicks to turn all lights off.
              </motion.p>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="modal-section-title"
              >
                <Heart className="w-4 h-4 mr-2" />
                Features
              </motion.h3>
              <motion.ul
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="list-disc pl-5 space-y-2 mb-4"
              >
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm"
                >
                  4x4 grid challenge
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  className="text-sm"
                >
                  Randomly generated puzzles
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm"
                >
                  Track your best score
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.85 }}
                  className="text-sm"
                >
                  Light/dark mode toggle
                </motion.li>
              </motion.ul>

              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="modal-section-title"
              >
                <Github className="w-4 h-4 mr-2" />
                Open Source
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="modal-text"
              >
                Light Logic is open source. Check out the{" "}
                <a
                  href="https://github.com/yourusername/light-logic"
                  target="_blank"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  GitHub repository
                </a>{" "}
                to view the source code or contribute to the project.
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="modal-overlay"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="modal-close"
                onClick={() => setShowStats(false)}
              >
                <X className="w-4 h-4" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="modal-title"
              >
                Statistics
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="stats-grid"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="stat-card"
                >
                  <div className="stat-icon">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium">Games Won</div>
                  <div className="text-xl font-bold">
                    {stats.gamesWon}
                  </div>
                  <div className="text-xs opacity-70">
                    {stats.totalGames > 0
                      ? `${Math.round(
                          (stats.gamesWon / stats.totalGames) * 100
                        )}% win rate`
                      : "No games played"}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="stat-card"
                >
                  <div className="stat-icon">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium">Best Moves</div>
                  <div className="text-xl font-bold">
                    {stats.bestMoves === Infinity ? "-" : stats.bestMoves}
                  </div>
                  <div className="text-xs opacity-70">Your personal best</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="stat-card"
                >
                  <div className="stat-icon">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium">Avg. Moves</div>
                  <div className="text-xl font-bold">
                    {stats.averageMoves
                      ? stats.averageMoves.toFixed(1)
                      : "-"}
                  </div>
                  <div className="text-xs opacity-70">
                    {stats.totalGames > 0
                      ? `Over ${stats.totalGames} games`
                      : "No games played"}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="stat-card"
                >
                  <div className="stat-icon">
                    <Star className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium">Perfect Games</div>
                  <div className="text-xl font-bold">
                    {stats.perfectGames}
                  </div>
                  <div className="text-xs opacity-70">
                    {stats.totalGames > 0
                      ? `${Math.round(
                          (stats.perfectGames / stats.totalGames) * 100
                        )}% of games`
                      : "No games played"}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="stat-card"
                >
                  <div className="stat-icon">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium">Win Rate</div>
                  <div className="text-xl font-bold">
                    {stats.winRate.toFixed(1)}%
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${stats.winRate}%`,
                      }}
                    ></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="stat-card"
                >
                  <div className="stat-icon">
                    <Medal className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-medium">Total Games</div>
                  <div className="text-xl font-bold">
                    {stats.totalGames}
                  </div>
                  <div className="text-xs opacity-70">
                    {stats.totalGames === 1 ? "game played" : "games played"}
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-6 text-center"
              >
                <Button
                  onClick={() => {
                    setStats({
                      totalGames: 0,
                      gamesWon: 0,
                      bestMoves: Infinity,
                      winRate: 0,
                      averageMoves: 0,
                      totalMoves: 0,
                      perfectGames: 0,
                    });
                    localStorage.removeItem("lightLogicStats");
                  }}
                  className="restart-button"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Statistics
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// Zod Schema
export const Schema = {
    "commentary": "",
    "template": "nextjs-developer",
    "title": "",
    "description": "",
    "additional_dependencies": [
        "framer-motion"
    ],
    "has_additional_dependencies": true,
    "install_dependencies_command": "npm install framer-motion",
    "port": 3000,
    "file_path": "pages/index.tsx",
    "code": "<see code above>"
}