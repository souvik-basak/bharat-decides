import { describe, it, expect, beforeEach } from 'vitest';
import { useQuizStore } from './useQuizStore';

describe('useQuizStore', () => {
  beforeEach(() => {
    useQuizStore.getState().resetProgress();
  });

  it('should initialize with empty scores and completed quizzes', () => {
    const state = useQuizStore.getState();
    expect(state.scores).toEqual({});
    expect(state.completedQuizzes).toEqual([]);
  });

  it('should increment score for a quiz', () => {
    const quizId = 'quiz-1';
    useQuizStore.getState().incrementScore(quizId);
    
    expect(useQuizStore.getState().getScore(quizId)).toBe(1);
    
    useQuizStore.getState().incrementScore(quizId);
    expect(useQuizStore.getState().getScore(quizId)).toBe(2);
  });

  it('should mark a quiz as completed only once', () => {
    const quizId = 'quiz-1';
    useQuizStore.getState().markQuizCompleted(quizId);
    expect(useQuizStore.getState().completedQuizzes).toContain(quizId);
    expect(useQuizStore.getState().completedQuizzes.length).toBe(1);

    useQuizStore.getState().markQuizCompleted(quizId);
    expect(useQuizStore.getState().completedQuizzes.length).toBe(1);
  });

  it('should reset progress', () => {
    const quizId = 'quiz-1';
    useQuizStore.getState().incrementScore(quizId);
    useQuizStore.getState().markQuizCompleted(quizId);
    
    useQuizStore.getState().resetProgress();
    
    const state = useQuizStore.getState();
    expect(state.scores).toEqual({});
    expect(state.completedQuizzes).toEqual([]);
  });
});
