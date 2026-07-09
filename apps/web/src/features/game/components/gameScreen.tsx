import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gameApi } from "../api/gameApi.js";
import { calculateScore } from "@brain-trainer-game/utils";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { checkAnswer } from "../helper/checkAnswer.js";
import { useConfirm } from "@brain-trainer-game/utils/src/hooks/useConfirm.js";
import { ConfirmModel } from "@brain-trainer-game/utils/src/components/confirmModel.js";

const COUNT_DOWN ={
  easy: 10000,
  medium: 15000,
  hard: 20000,
} as const;

type  Difficulty = keyof typeof COUNT_DOWN;

export const GameScreen: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  //count down states
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [gamePhase, setGamePhase] = useState<"memorize" | "input" | "result">(
    "memorize",
  );
  const [gameResult, setGameResult] = useState<{isCorrect: boolean; score: number; correctWords: string[]} |null >(null);

  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const {confirm, isOpen, message, handleConfirm, handleCancel} = useConfirm();

  const { data: sequence, isLoading } = useQuery({
    queryKey: ["sequence"],
    queryFn: gameApi.getSequence,
  });

  useEffect(() => {
    if (sequence) {
      setStartTime(Date.now());
      const difficultyKey = sequence.difficulty as Difficulty
      const duration = COUNT_DOWN[difficultyKey];
      setTimeLeft(duration);
      setShowSequence(true);
      setGamePhase("memorize");
      setIsSubmitted(false);
      setUserInput("");
    }
  }, [sequence]);

  // count-down time
  useEffect(() => {
    if (gamePhase !== "memorize" || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setShowSequence(false);
          setGamePhase("input");
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gamePhase, timeLeft]);

  //submit result
  const submitMutation = useMutation({
    mutationFn: (input: string[]) => {
      if (!sequence) throw new Error("No sequence Loaded!");
      return gameApi.submitResult({
        sequenceId: sequence.id,
        userInput: input,
        duratonMs: Date.now() - startTime,
      });
    },
    onSuccess: (data) => {
      alert(`Game Over! Score: ${data.score}. ${data.feedback}`);
      globalThis.location.reload();
    },
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!sequence || gamePhase ==='result') return;

    // simple split by comma or space for MVP
    const words = userInput.split(/[\s,]+/).filter((w) => w.length > 0);
    const isCorrect  = checkAnswer(userInput, sequence.words);
    const score = calculateScore(isCorrect, sequence.difficulty, Date.now()-startTime);
    setGameResult({isCorrect, score, correctWords: sequence.words});

    setIsSubmitted(true);
    setGamePhase('result');
    submitMutation.mutate(words);
  };

  const handleLogout = async () => {
    const confirmed = await confirm("Logout session?");
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };
  
  //formatting millisecond into second 
  const formatTime = (ms: number) => Math.ceil(ms/1000);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl text-gray-600 animate-pulse">
          Loading Challenge...
        </div>
      </div>
    );
  }

  if (!sequence) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-500">
          Failed to load sequence. Please refresh.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Brain Trainer
          </h2>

          <button
            onClick={handleLogout}
            className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
          >
            Logout
          </button>
          <ConfirmModel isOpen = {isOpen} message={message} onConfirm={handleConfirm} onCancel={handleCancel} />
        </div>

        {/* Word Display */}
        <div className="bg-blue-50 p-8 rounded-lg mb-8 border border-blue-100 text-center">
          <div className="p-8 rounded-lg mb-8 border text-center transition-all duration-500 ">
            {showSequence ? (
              <p data-testid= "sequence" className="text-2xl font-mono text-blue-900 tracking-wide leading-relaxed">
                {sequence.words.join(" ")}
              </p>
            ) : (
              <p className="text-gray-500 text-lg font-medium">
                🧠 Words hidden! Type from memory
              </p>
            )}
          </div>

          <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Difficulty: {sequence.difficulty}{" "}
          </div>
          <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
            {gamePhase === "memorize" ? ` ⏱️: ${formatTime(timeLeft)}` : "⏱️"}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="handle Submit"
            className="block text-gray-700 text-sm font-bold mb-2 ml-1"
          >
            Type the words exactly as shown:
          </label>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow font-mono text-lg"
            rows={3}
            placeholder={gamePhase ==='memorize' ? 'Memorize the words above!': "Start typing..."}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)} disabled ={gamePhase!=='input'}
            autoFocus = {gamePhase ==='input'}
          />

          <button
            type="submit"
            disabled={
              submitMutation.isPending || !userInput.trim() || isSubmitted
            }
            className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {submitMutation.isPending
              ? "Checking..."
              : isSubmitted
                ? "Submitted"
                : "Submit Answer"}
          </button>
        </form>

        {/* Live Score Preview */}
        <div className="mt-8 text-center border-t pt-4">
          {isSubmitted && gameResult  &&(
            <p className="text-sm text-gray-500">
              {gameResult.isCorrect? (
                <span className="text-green-600"> Correct | </span>
              ):(
                <span className="text-red-600">Incorrect | </span>
              )}
              Your Score:{gameResult.score}
              <span className="ml-2 font-bold text-gray-800 text-lg">
              </span>
            </p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Score decreases as time passes.
          </p>
        </div>
      </div>
    </div>
  );
};;
