import React, { useState, useRef, useEffect } from "react";
import heartLogo from "./heart.svg";
import heartHappyLogo from "./hearthappy.svg"; // New happy heart image
import confetti from "canvas-confetti";

import "./App.css";

function App() {
  const [isSwapped, setIsSwapped] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const [accepted, setAccepted] = useState(false); // Track if "Yes" was clicked
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Check if the user is on a mobile device
  const isMobile = window.innerWidth <= 768;  // You can adjust the width as needed

  useEffect(() => {
    if (noButtonRef.current) {
      const rect = noButtonRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });

      // Set fixed positioning to prevent weird behavior
      // noButtonRef.current.style.position = "fixed";
    }
  }, []);

  const moveNoButtonSmoothly = () => {
    if (noButtonRef.current) {
      const buttonWidth = noButtonRef.current.offsetWidth;
      const buttonHeight = noButtonRef.current.offsetHeight;

      let x, y;
      let maxAttempts = 50;
      let attempts = 0;

      do {
        // Ensure the "No" button moves at least 200px away from its current position
        x = position.x + (Math.random() * 400 - 200); // Move in a range of 400px
        y = position.y + (Math.random() * 400 - 200);

        // Keep the button inside screen bounds
        x = Math.max(50, Math.min(x, window.innerWidth - buttonWidth - 50));
        y = Math.max(50, Math.min(y, window.innerHeight - buttonHeight - 50));

        attempts++;
      } while (
        (x < 0 || x > window.innerWidth - buttonWidth || y < 0 || y > window.innerHeight - buttonHeight) &&
        attempts < maxAttempts
      );

      setPosition({ x, y });

      noButtonRef.current.style.transform = `translate(${x - position.x}px, ${y - position.y}px)`;
    }
  };

  const handleNoHover = () => {
    if (hoverCount < 2) {
      setIsSwapped((prev) => !prev);
      setHoverCount(hoverCount + 1);
    } else {
      requestAnimationFrame(moveNoButtonSmoothly);
    }
  };

  const handleYesClick = () => {
    setAccepted(true);
    // Trigger confetti when "Yes" is clicked
    confetti({
      particleCount: 200,
      spread: 180,
      origin: { x: 0.5, y: 0.5 }
    });
  };

  return (
    <div className="App">
      {isMobile && (
        <div className="mobile-warning">
          <p>This website works best on desktop. Please visit on a desktop for the best experience!</p>
        </div>
      )}
      <header className="App-header">
        {/* Change heart image when "Yes" is clicked, with fade-in effect */}
        <img
          src={accepted ? heartHappyLogo : heartLogo}
          className={`App-logo ${accepted ? "fade-in" : ""}`}
          alt="heart icon"
        />
        {/* Change text when "Yes" is clicked */}
        <span className="Question">{accepted ? "Yay! 🎉" : "Will you be my Valentine? 💖"}</span>
        {!accepted && ( // Hide buttons after clicking "Yes"
          <div className="Button-container">
            <button
              className={isSwapped ? "No-btn" : "Yes-btn"}
              onMouseEnter={isSwapped ? handleNoHover : undefined}
              onClick={handleYesClick} // Handle "Yes" click
            >
              {isSwapped ? "No" : "Yes"}
            </button>
            <button
              ref={noButtonRef}
              className={isSwapped ? "Yes-btn" : "No-btn"}
              onMouseEnter={hoverCount === 1 ? undefined: handleNoHover}
              onClick={isSwapped ? handleYesClick : undefined} 
            >
              {isSwapped ? "Yes" : "No"}
            </button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
