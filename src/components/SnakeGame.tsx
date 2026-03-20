import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  
  const directionQueueRef = useRef<Point[]>([]);
  const currentDirectionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    currentDirectionRef.current = INITIAL_DIRECTION;
    directionQueueRef.current = [];
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (gameOver) return;
      
      const lastQueuedDirection = directionQueueRef.current.length > 0 
        ? directionQueueRef.current[directionQueueRef.current.length - 1] 
        : currentDirectionRef.current;
      
      const { x, y } = lastQueuedDirection;
      let newDirection: Point | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) newDirection = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) newDirection = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) newDirection = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) newDirection = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }

      if (newDirection) {
        directionQueueRef.current.push(newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      if (directionQueueRef.current.length > 0) {
        currentDirectionRef.current = directionQueueRef.current.shift()!;
        setDirection(currentDirectionRef.current);
      }

      const head = snake[0];
      const newHead = {
        x: head.x + currentDirectionRef.current.x,
        y: head.y + currentDirectionRef.current.y,
      };

      // Check collision with walls
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return;
      }

      // Check collision with self
      if (snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      const newSnake = [newHead, ...snake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setFood(generateFood(newSnake));
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const timeoutId = setTimeout(moveSnake, GAME_SPEED);
    return () => clearTimeout(timeoutId);
  }, [snake, food, gameOver, isPaused, generateFood, score, onScoreChange]);

  return (
    <div className="relative w-full h-full aspect-square bg-black overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'linear-gradient(to right, #00ffff 1px, transparent 1px), linear-gradient(to bottom, #00ffff 1px, transparent 1px)',
          backgroundSize: `${100 / GRID_SIZE}% ${100 / GRID_SIZE}%`
        }}
      />

      {/* Game Area */}
      <div className="absolute inset-0">
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-[#00ffff] shadow-[0_0_10px_#00ffff]' : 'bg-[#00ffff]/70'}`}
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x * 100) / GRID_SIZE}%`,
              top: `${(segment.y * 100) / GRID_SIZE}%`,
            }}
          />
        ))}
        <div
          className="absolute bg-[#ff00ff] shadow-[0_0_15px_#ff00ff] animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x * 100) / GRID_SIZE}%`,
            top: `${(food.y * 100) / GRID_SIZE}%`,
          }}
        />
      </div>

      {/* Overlays */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm z-10">
          <h2 className="text-6xl font-black text-[#ff00ff] mb-4 glitch" data-text="FATAL_ERROR">FATAL_ERROR</h2>
          <p className="text-[#00ffff] mb-6 text-2xl">SYS.SCORE: {score}</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-black border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors uppercase text-xl font-bold shadow-[4px_4px_0_#ff00ff]"
          >
            REBOOT_SYSTEM
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-10">
          <h2 className="text-5xl font-black text-[#00ffff] tracking-widest glitch" data-text="SYSTEM_HALTED">SYSTEM_HALTED</h2>
        </div>
      )}
    </div>
  );
}
