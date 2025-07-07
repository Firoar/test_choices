import { useState } from "react";
import { questionsData } from "./QuestionData.js";
import Finished from "./Finished.jsx";

const Qform = () => {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [sel, setSel] = useState("");
  const [done, setDone] = useState(false);

  const curr = questionsData[idx];
  const progress = ((idx + 1) / questionsData.length) * 100;

  const next = () => {
    if (!sel) return;
    setAnswers({ ...answers, [curr.id]: sel });
    if (idx < questionsData.length - 1) {
      setIdx(idx + 1);
      setSel(answers[questionsData[idx + 1]?.id] || "");
    } else setDone(true);
  };

  const prev = () => {
    setIdx(Math.max(idx - 1, 0));
    setSel(answers[questionsData[idx - 1]?.id] || "");
  };

  // Reset function to pass to Finished component
  const resetQuiz = () => {
    setIdx(0);
    setAnswers({});
    setSel("");
    setDone(false);
  };

  if (done) {
    return (
      <Finished
        answers={answers}
        questionsData={questionsData}
        onReset={resetQuiz}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">Ideology Quiz</h2>

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

      <form className="space-y-6">
        <div>
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
                value={o.value}
                name={`q${curr.id}`}
                checked={sel === o.value}
                onChange={() => setSel(o.value)}
                className="w-4 h-4 mr-3 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
            {idx === questionsData.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Qform;
