import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { gameApi } from "../api/gameApi.js";
import { calculateScore } from "@brain-trainer-game/utils";
import { useAuthStore } from "../../../store/useAuthStore.js";
import { useNavigate } from "react-router-dom";

export const GameScreen: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const { data: sequence, isLoading } = useQuery({
    queryKey: ["sequence"],
    queryFn: gameApi.getSequence,
  });

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
      alert(`Game OVer! Score: ${data.score}. ${data.feedback}`);
      globalThis.location.reload();
    },
  });

  useEffect(() => {
    if (sequence) setStartTime(Date.now());
  }, [sequence]);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!sequence) return;

    // simple split by comma or space for MVP
    const words = userInput.split(/[\s,]+/).filter((w) => w.length > 0);
    submitMutation.mutate(words);
    setIsSubmitted(true);
  };

  const handleLogout = () => {
    if (globalThis.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

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
        </div>

        {/* Word Display */}
        <div className="bg-blue-50 p-8 rounded-lg mb-8 border border-blue-100 text-center">
          <p className="text-2xl font-mono text-blue-900 tracking-wide leading-relaxed">
            {sequence.words.join(" ")}
          </p>
          <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
            Difficulty: {sequence.difficulty}
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
            placeholder="Start typing..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            autoFocus
          />

          <button
            type="submit"
            disabled={submitMutation.isPending || !userInput.trim()||isSubmitted}
            className="w-full mt-4 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {submitMutation.isPending ? "Checking..." : isSubmitted? "Submitted": "Submit Answer"}
          </button>
        </form>

        {/* Live Score Preview */}
        <div className="mt-8 text-center border-t pt-4">
          {isSubmitted && (
            <p className="text-sm text-gray-500">
              Current Estimated Score:{" "}
              <span className="ml-2 font-bold text-gray-800 text-lg">
                {calculateScore(
                  true,
                  sequence.difficulty,
                  Date.now() - startTime,
                )}
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
};
