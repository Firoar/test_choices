// components/StoryCompletion.jsx
import React from "react";

const StoryCompletion = ({
  sessionId,
  storyHistory,
  onRestart,
  onBackToQuiz,
}) => {
  const reflections = storyHistory
    .filter((entry) => entry.reflection)
    .map((entry) => entry.reflection);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎭</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Journey Complete!
          </h2>
          <p className="text-gray-600 text-lg">
            You've navigated through {storyHistory.length} chapters of
            perspective-challenging scenarios
          </p>
        </div>

        {/* Reflection Summary */}
        {reflections.length > 0 && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              🤔 Perspectives Explored
            </h3>
            <div className="space-y-3">
              {reflections.map((reflection, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <p className="text-blue-800">{reflection}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Story Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {storyHistory.length}
            </div>
            <div className="text-gray-600">Chapters Completed</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {storyHistory.filter((entry) => entry.selectedChoice).length}
            </div>
            <div className="text-gray-600">Decisions Made</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {reflections.length}
            </div>
            <div className="text-gray-600">Beliefs Challenged</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🔄 Experience Another Story
          </button>
          <button
            onClick={onBackToQuiz}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            📋 Back to Quiz
          </button>
        </div>

        {/* Final Message */}
        <div className="mt-8 p-6 bg-green-50 rounded-lg text-center">
          <h4 className="text-lg font-semibold text-green-900 mb-2">
            Thank You for Your Participation! 🙏
          </h4>
          <p className="text-green-800">
            Stories have the power to help us see the world through different
            eyes. We hope this journey has offered you new perspectives to
            consider.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryCompletion;
