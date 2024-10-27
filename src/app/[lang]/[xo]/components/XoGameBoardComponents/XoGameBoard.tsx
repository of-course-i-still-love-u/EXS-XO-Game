/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import XoCell from "../XoCellComponents/XoCell";

type Player = "X" | "O";
type BoardState = Array<Player | null>;
type GameMode = "EZ" | "MONSTER";

const XoGameBoard: React.FC = () => {
  const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winnerCount, setWinnerCount] = useState(0);
  const [score, setScore] = useState(0);
  const [specialScore, setSpecialScore] = useState(0);
  const [gameMode, setGaveMode] = useState<GameMode>("EZ");
  const [activeMode, setActiveMode] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (newBoard: BoardState) => {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        return newBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScore((prev) => prev + 1);
      setWinnerCount((prev) => prev + 1);
    } else {
      setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
      if (currentPlayer === "X") botMove(newBoard);
    }
  };

  const smartMove = (
    availableMoves: number[],
    newBoard: BoardState,
    selectedBox: { winBox: number[]; playersBox: (Player | null)[] }
  ) => {
    const getIndexPlayerBoxNull = selectedBox.playersBox.findIndex(
      (pBox) => pBox === null
    );
    const mapIndexToAvailableMoves = availableMoves.findIndex(
      (move) => move === selectedBox.winBox[getIndexPlayerBoxNull]
    );
    const moveTo = availableMoves[mapIndexToAvailableMoves] as number;

    newBoard[moveTo] = "O";
    setBoard(newBoard);
  };

  const randomMove = (availableMoves: number[], newBoard: BoardState) => {
    const moveTo = availableMoves[
      Math.floor(Math.random() * availableMoves.length)
    ] as number;
    newBoard[moveTo] = "O";
    setBoard(newBoard);
  };

  const logicalMove = (availableMoves: number[], newBoard: BoardState) => {
    if (availableMoves.length === 0) return;
    let botRound = false;
    let countLoop = 0;

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;
      const selectedBox = {
        winBox: [...combination],
        playersBox: [newBoard[a], newBoard[b], newBoard[c]],
      };

      const nullPlayer = selectedBox.playersBox.filter(
        (player) => player === null
      );

      if (nullPlayer.length) {
        if (!botRound) {
          const getOplayer = selectedBox.playersBox.filter(
            (item) => item === "O"
          );
          const getXplayer = selectedBox.playersBox.filter(
            (item) => item === "X"
          );
          switch (getOplayer.length) {
            case 2:
              smartMove(availableMoves, newBoard, selectedBox);
              botRound = !botRound;
              break;
            default:
              switch (getXplayer.length) {
                case 2:
                  smartMove(availableMoves, newBoard, selectedBox);
                  botRound = !botRound;
                  break;
                default:
                  countLoop = countLoop += 1;
                  if (countLoop === winningCombinations.length) {
                    randomMove(availableMoves, newBoard);
                    botRound = !botRound;
                  }
                  break;
              }
          }
        }
      } else {
        countLoop = countLoop += 1;
        if (countLoop === winningCombinations.length) {
          if (!botRound) {
            randomMove(availableMoves, newBoard);
            botRound = !botRound;
            countLoop = 0;
          }
        }
      }
    }
  };

  const botMove = (newBoard: BoardState) => {
    const availableMoves = newBoard
      .map((cell, idx) => (cell === null ? idx : null))
      .filter((cell) => cell !== null);

    if (gameMode === "EZ") {
      randomMove(availableMoves, newBoard);
    } else {
      logicalMove(availableMoves, newBoard);
    }

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScore((prev) => (prev > 0 ? prev - 1 : 0));
      setWinnerCount(0);
    } else {
      setCurrentPlayer("X");
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer("X");
    setWinner(null);
    // setScore(0);
  };

  const botFirst = () => {
    const newBoard = [...board];
    newBoard[Math.floor(Math.random() * board.length - 1)] = "O";
    setBoard(newBoard);
  };

  const handleGameMode = (index: number) => {
    setActiveMode(index);
    if (index === 0) {
      setGaveMode("EZ");
    } else {
      setGaveMode("MONSTER");
    }
  };

  useEffect(() => {
    if (
      board.filter((n) => n === null).length - 1 === 8 &&
      gameMode === "MONSTER"
    ) {
      if (currentPlayer === "X") botFirst();
    }
  }, [board, gameMode]);

  useEffect(() => {
    if (winnerCount === 3) {
      setSpecialScore((prev) => prev + 1);
      setWinnerCount(0);
    }
  }, [winnerCount]);

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [session]);

  return session ? (
    <div className=" mt-4 flex flex-col justify-center items-center space-y-4">
      <h1 className="mt-4 text-base">XO Game Player vs Bot </h1>

      <div className="mt-4 h-[5vh] ">
        {winner && (
          <h2 className="text-xl">Winner: {winner === "X" ? "You" : "Bot"}</h2>
        )}
      </div>

      <div className=" grid grid-cols-3 md:w-[50vw]  gap-4  justify-items-center ">
        {board.map((value, index) => (
          <XoCell
            key={index}
            value={value}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>

      <div className="mt-4 text-base">
        <span>Your score: {score}</span>
      </div>
      <div className="mt-4 text-base">
        <span>Your specialScore: {specialScore}</span>
      </div>

      <button
        className="mt-4 text-base rounded-lg px-4 py-2 bg-orange-200 text-black"
        onClick={resetGame}
      >
        Reset Game
      </button>
      <div className="flex  space-x-4 ">
        {["Easy Mode", "Crazy Mode"].map((item, index) => {
          return (
            <button
              key={index}
              className={` text-base px-4 py-2 ${
                activeMode === index
                  ? "bg-red-700 "
                  : "border-white border-2 text-white"
              }  rounded-lg`}
              onClick={() => handleGameMode(index)}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  ) : null;
};

export default XoGameBoard;
