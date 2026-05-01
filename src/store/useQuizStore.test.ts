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

  it('should increment score for a specific quiz', () => {
    const quizId = 'voter-registration';
    useQuizStore.getState().incrementScore(quizId);
    expect(useQuizStore.getState().getScore(quizId)).toBe(1);
    
    useQuizStore.getState().incrementScore(quizId);
    expect(useQuizStore.getState().getScore(quizId)).toBe(2);
  });

  it('should mark a quiz as completed', () => {
    const quizId = 'voting-process';
    useQuizStore.getState().markQuizCompleted(quizId);
    expect(useQuizStore.getState().completedQuizzes).toContain(quizId);
  });

  it('should not add duplicate quiz IDs to completedQuizzes', () => {
    const quizId = 'voting-process';
    useQuizStore.getState().markQuizCompleted(quizId);
    useQuizStore.getState().markQuizCompleted(quizId);
    expect(useQuizStore.getState().completedQuizzes).toHaveLength(1);
  });

  it('should reset progress correctly', () => {
    useQuizStore.getState().incrementScore('test');
    useQuizStore.getState().markQuizCompleted('test');
    useQuizStore.getState().resetProgress();
    
    const state = useQuizStore.getState();
    expect(state.scores).toEqual({});
    expect(state.completedQuizzes).toEqual([]);
  });
});
