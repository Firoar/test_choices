// App.jsx - Main application component integrating quiz and story
import React, { useState } from "react";
import QuizPage from "./components/QuizPage";
import InteractiveStory from "./components/InteractiveStory";
import StoryCompletion from "./components/StoryCompletion";

const App = () => {
  const [currentView, setCurrentView] = useState("quiz"); // 'quiz', 'story', 'completion'
  const [studentId] = useState(
    () => `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [storySession, setStorySession] = useState(null);

  const handleQuizComplete = (answers) => {
    console.log("Quiz completed with answers:", answers);
    setQuizAnswers(answers);
    setCurrentView("story");
  };

  const handleStoryComplete = (sessionId, storyHistory) => {
    console.log("Story completed:", { sessionId, storyHistory });
    setStorySession({ sessionId, storyHistory });
    setCurrentView("completion");
  };

  const handleRestartStory = () => {
    setCurrentView("story");
  };

  const handleBackToQuiz = () => {
    setCurrentView("quiz");
    setQuizAnswers(null);
    setStorySession(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentView === "quiz" && (
        <QuizPage onQuizComplete={handleQuizComplete} />
      )}

      {currentView === "story" && quizAnswers && (
        <InteractiveStory
          studentId={studentId}
          quizAnswers={quizAnswers}
          onStoryComplete={handleStoryComplete}
        />
      )}

      {currentView === "completion" && storySession && (
        <StoryCompletion
          sessionId={storySession.sessionId}
          storyHistory={storySession.storyHistory}
          onRestart={handleRestartStory}
          onBackToQuiz={handleBackToQuiz}
        />
      )}
    </div>
  );
};

export default App;
