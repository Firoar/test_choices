// components/StoryDisplay.jsx
import React from "react";

const StoryDisplay = ({ scene, isLoading, step }) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Crafting your story...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-semibold mr-4">
          {step}
        </div>
        <div className="text-sm text-gray-500 uppercase tracking-wide">
          Chapter {step}
        </div>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
          {scene}
        </div>
      </div>

      {/* Visual divider */}
      <div className="mt-8 flex justify-center">
        <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded"></div>
      </div>
    </div>
  );
};

export default StoryDisplay;
