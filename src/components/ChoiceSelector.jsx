// components/ChoiceSelector.jsx
import React, { useState } from "react";

const ChoiceSelector = ({ choices, onChoiceSelect, disabled }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChoiceClick = async (choice) => {
    if (disabled || isSubmitting) return;

    setSelectedChoice(choice.id);
    setIsSubmitting(true);

    try {
      await onChoiceSelect(choice.id, choice.text);
    } finally {
      setSelectedChoice(null);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 border-t">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        What do you choose to do?
      </h3>

      <div className="space-y-4 max-w-3xl mx-auto">
        {choices.map((choice, index) => (
          <button
            key={choice.id}
            onClick={() => handleChoiceClick(choice)}
            disabled={disabled || isSubmitting}
            className={`
              w-full p-6 text-left rounded-xl border-2 transition-all duration-200
              ${
                selectedChoice === choice.id
                  ? "border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
              }
              ${
                disabled || isSubmitting
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-md"
              }
            `}
          >
            <div className="flex items-start space-x-4">
              <div
                className={`
                flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm
                ${
                  selectedChoice === choice.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }
              `}
              >
                {choice.id}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">{choice.text}</p>
              </div>
              {isSubmitting && selectedChoice === choice.id && (
                <div className="flex-shrink-0">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Click on your choice to continue the story
      </div>
    </div>
  );
};

export default ChoiceSelector;
