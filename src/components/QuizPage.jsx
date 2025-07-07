// components/QuizPage.jsx - Updated to integrate with story system
import React, { useState } from "react";
import { questionsData } from "./QuestionData.js";

const QuizPage = ({ onQuizComplete }) => {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sel, setSel] = useState("");
  const [done, setDone] = useState(false);

  const curr = questionsData[idx];
  const progress = ((idx + 1) / questionsData.length) * 100;

  const next = () => {
    if (!sel) return;
    const newAnswers = { ...answers, [curr.id]: sel };
    setAnswers(newAnswers);

    if (idx < questionsData.length - 1) {
      setIdx(idx + 1);
      setSel(answers[questionsData[idx + 1]?.id] || "");
    } else {
      setDone(true);
      // Call the completion handler with answers
      setTimeout(() => {
        onQuizComplete(newAnswers);
      }, 1000);
    }
  };

  const prev = () => {
    if (idx === 0) return;
    setIdx(idx - 1);
    setSel(answers[questionsData[idx - 1]?.id] || "");
  };

  const resetQuiz = () => {
    setIdx(0);
    setAnswers({});
    setSel("");
    setDone(false);
  };

  // Show completion message
  if (done) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Quiz Completed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for sharing your perspectives. Your personalized story is
            being prepared...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Political Ideology Quiz
      </h2>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-gray-600 mb-6 text-sm">
        Question {idx + 1} of {questionsData.length}
      </p>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <h3 className="text-lg font-medium text-blue-600 mb-2">
            🔹 {curr.category}
          </h3>
          <p className="text-gray-800">{curr.question}</p>
        </div>

        <div className="space-y-3">
          {curr.options.map((o) => (
            <label
              key={o.id}
              className="flex items-center p-3 bg-white border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <input
                type="radio"
                name={`q${curr.id}`}
                value={o.value}
                checked={sel === o.value}
                onChange={() => setSel(o.value)}
                className="w-4 h-4 mr-3 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-700">{o.text}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={prev}
            disabled={idx === 0}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={next}
            disabled={!sel}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {idx === questionsData.length - 1 ? "Complete Quiz" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizPage;
