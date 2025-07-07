// components/InteractiveStory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import StoryDisplay from "./StoryDisplay";
import ChoiceSelector from "./ChoiceSelector";
import StoryProgress from "./StoryProgress";

const API_BASE_URL = "http://localhost:5000/api";

const InteractiveStory = ({ studentId, quizAnswers, onStoryComplete }) => {
  const [sessionId, setSessionId] = useState(null);
  const [currentScene, setCurrentScene] = useState("");
  const [choices, setChoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [storyStep, setStoryStep] = useState(0);
  const [storyHistory, setStoryHistory] = useState([]);

  // Start the story session
  useEffect(() => {
    startStorySession();
  }, []);

  const startStorySession = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/story/start`, {
        studentId,
        quizAnswers,
      });

      const { sessionId, scene, choices, step } = response.data;

      setSessionId(sessionId);
      setCurrentScene(scene);
      setChoices(choices);
      setStoryStep(step);
      setStoryHistory([{ scene, choices, step }]);
    } catch (err) {
      console.error("Failed to start story:", err);
      setError("Failed to start your personalized story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoiceSelection = async (choiceId, choiceText) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/story/continue`, {
        sessionId,
        choiceId,
        choiceText,
      });

      const { scene, choices, step, reflection } = response.data;

      setCurrentScene(scene);
      setChoices(choices);
      setStoryStep(step);

      // Add to history
      const newHistoryEntry = {
        scene,
        choices,
        step,
        selectedChoice: { id: choiceId, text: choiceText },
        reflection,
      };
      setStoryHistory((prev) => [...prev, newHistoryEntry]);

      // check if story should end (you can customize this logic)
      if (step >= 8) {
        // End after 8 steps
        setTimeout(() => {
          onStoryComplete && onStoryComplete(sessionId, storyHistory);
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to continue story:", err);
      setError("Failed to continue the story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetStory = () => {
    setSessionId(null);
    setCurrentScene("");
    setChoices([]);
    setStoryStep(0);
    setStoryHistory([]);
    setError(null);
    startStorySession();
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-xl mb-4">
            ⚠️ Something went wrong
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={resetStory}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Perspective Journey
        </h1>
        <p className="text-gray-600">
          An interactive story tailored to challenge and expand your worldview
        </p>
      </div>

      {/* Progress Indicator */}
      <StoryProgress currentStep={storyStep} totalSteps={8} />

      {/* Story Content */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <StoryDisplay
          scene={currentScene}
          isLoading={isLoading}
          step={storyStep}
        />

        {!isLoading && choices.length > 0 && (
          <ChoiceSelector
            choices={choices}
            onChoiceSelect={handleChoiceSelection}
            disabled={isLoading}
          />
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetStory}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Restart Story
        </button>

        {storyStep >= 8 && (
          <button
            onClick={() =>
              onStoryComplete && onStoryComplete(sessionId, storyHistory)
            }
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Journey
          </button>
        )}
      </div>
    </div>
  );
};

export default InteractiveStory;
