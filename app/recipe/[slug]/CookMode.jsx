"use client";

import { useState, useEffect, useCallback } from "react";
import { getIconForItem } from "../../../lib/ingredientIcons";

export default function CookMode({ steps }) {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const totalSteps = steps.length;

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }, [totalSteps]);

  const goPrev = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const open = () => {
    setStepIndex(0);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        close();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goNext, goPrev, close]);

  if (!steps || steps.length === 0) return null;

  const step = steps[stepIndex];

  return (
    <>
      <div className="cook-mode-toggle-wrap">
        <button className="cook-mode-toggle" onClick={open}>
          👨‍🍳 Enter Cook Mode
        </button>
      </div>

      {isOpen && (
        <div className="cook-mode-overlay" onClick={goNext}>
          <button
            className="cook-mode-close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            aria-label="Exit cook mode"
          >
            ✕
          </button>

          <div className="cook-mode-progress">
            Step {stepIndex + 1} of {totalSteps}
          </div>

          <div className="cook-mode-card">
            {step.items && step.items.length > 0 && (
              <div className="cook-mode-items">
                {step.items.map((item, i) => (
                  <span className="cook-mode-item" key={i}>
                    <span className="cook-mode-item-icon">{getIconForItem(item)}</span>
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="cook-mode-text">{step.text}</div>

            {step.image && (
              <img
                src={step.image}
                alt={`Step ${stepIndex + 1}`}
                className="cook-mode-image"
              />
            )}
          </div>

          <div className="cook-mode-nav">
            <button
              className="cook-mode-nav-button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              disabled={stepIndex === 0}
            >
              ‹ Back
            </button>
            <span className="cook-mode-hint">
              click, space, or → for next · ← to go back
            </span>
            <button
              className="cook-mode-nav-button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              disabled={stepIndex === totalSteps - 1}
            >
              Next ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}