import { useState } from "react";

const Finished = ({ answers, questionsData, onReset }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      console.log(answers);
      alert("Quiz submitted successfully!");
    } catch (error) {
      alert("Error submitting quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-6">Your Answers</h2>

      {/* Single-column list of answers */}
      <div className="space-y-4">
        {Object.entries(answers).map(([qid, selectedValue], index) => {
          const question = questionsData.find((q) => q.id === +qid);
          const selectedOption = question.options.find(
            (opt) => opt.value === selectedValue
          );

          return (
            <p
              key={qid}
              className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 text-gray-800"
            >
              {index + 1}. {selectedOption.text}
            </p>
          );
        })}
      </div>

      <div className="mt-2 flex justify-center space-x-4">
        <button
          onClick={submit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={onReset}
          className="px-6  bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retake
        </button>
      </div>
    </div>
  );
};

export default Finished;
