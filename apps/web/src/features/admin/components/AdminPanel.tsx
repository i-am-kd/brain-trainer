import React, {useState} from 'react';
import {useMutation } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi.js';
import { useAuthStore } from '../../../store/useAuthStore.js';
import { useConfirm } from '@brain-trainer-game/utils/src/hooks/useConfirm.js';
import { ConfirmModel } from '@brain-trainer-game/utils/src/components/confirmModel.js';
import { useNavigate } from 'react-router-dom';


export const AdminPanel: React.FC = () =>{
    const [topic, setTopic] = useState("Human Psychology");
    const [count, setCount] = useState(4);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [wordsPerSequence, setWordsPerSequence] = useState(5);

    const {logout} = useAuthStore();
    const {confirm, isOpen, message, handleConfirm, handleCancel} = useConfirm();
    const navigate = useNavigate();

    const generateMutation = useMutation({
        mutationFn: () => adminApi.generateContent({
            topic, count, difficulty, wordsPerSequence,
        }),

        onSuccess: (data) =>{
            alert(`Success: ${data.message}`);
            setCount(1);
        },
        onError: (error) =>{
            alert(`Failed: ${error.message}`);
        }
    });

    const handleSubmit = (e: React.SubmitEvent) =>{
        e.preventDefault();
        if(!topic.trim()) {
            alert('Please enter a topic.');
        }
        generateMutation.mutate();
    };

    const handleLogout = async () =>{
      const confirmed = await confirm("Logout Admin session?")
        if(confirmed){
            logout();
            navigate('/login');
        }
    };

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 px-4">
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-lg border broder-gray-100">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {" "}
              Admin Content Generator
            </h1>
            <div>
                <button
                  type='button'
                    onClick={handleLogout}
                    className="text-sm font-medium  text-red-500 hover: text-blue-700"
                  >
                    Logout
                </button>
                <ConfirmModel isOpen ={isOpen} message={message} onConfirm={handleConfirm} onCancel={handleCancel} />
              </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* topic */}
            <div>
              <label
                htmlFor="topic"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                {" "}
                Topic / Theme
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Space Exploration, Anceint History, Psychology"
                className="w-full p-3 border border-gray-300 rounded-lg focus: outline-none focus: ring-2 focus: ring-blue-500"
                required
              />
            </div>
            {/* grid for numeric/ select inputs */}
            <div className="grid grid-cols-1 md: grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="selectCount"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  {" "}
                  Count (1-10)
                </label>
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={count}
                  onChange={(e) => setCount(Number.parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus: outline-none focus: ring-2 focus: ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="difficulty"
                  className=" block text-gray-700 text-sm font-bold mb-2"
                >
                  {" "}
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as "easy" | "medium" | "hard")
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus: ring-2 focus: ring-blue-500 bg-white"
                >
                  <option value="'easy"> Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="sequence"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  {" "}
                  Words per Sequence
                </label>
                <input
                  type="number"
                  min={5}
                  max={30}
                  value={wordsPerSequence}
                  onChange={(e) =>
                    setWordsPerSequence(Number.parseInt(e.target.value))
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus: outline-none focus: ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* submit button*/}
            <button
              type="submit"
              disabled={generateMutation.isPending || count < 2 || count > 30}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover: bg-green-700 transition-all duration-200 disabled: bg-gray-300  shadow-md"
            >
              {generateMutation.isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating and Storing ...
                </span>
              ) : (
                "Generate Content"
              )}
            </button>
          </form>
          <div className="mt-6 p-4 bg-allow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            <strong> ⚠️ Note: </strong> AI generation may take 5-10 seconds
            depending on count. Generated sequences are automatically will be
            saved to the database and become available to player immediately.
          </div>
        </div>
      </div>
    );
}