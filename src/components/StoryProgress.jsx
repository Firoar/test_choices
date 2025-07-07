// components/StoryProgress.jsx
import React from "react";

const StoryProgress = ({ currentStep, totalSteps }) => {
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-500">
          {currentStep} of {totalSteps} chapters
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div
              key={stepNum}
              className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }
              `}
            >
              {isCompleted ? "✓" : stepNum}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoryProgress;
