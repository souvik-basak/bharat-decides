import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuizState {
  scores: Record<string, number>;
  completedQuizzes: string[];
  incrementScore: (quizId: string) => void;
  markQuizCompleted: (quizId: string) => void;
  getScore: (quizId: string) => number;
  resetProgress: () => void;
}

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      scores: {},
      completedQuizzes: [],
      incrementScore: (quizId) => set((state) => ({
        scores: {
          ...state.scores,
          [quizId]: (state.scores[quizId] || 0) + 1
        }
      })),
      markQuizCompleted: (quizId) => set((state) => ({
        completedQuizzes: state.completedQuizzes.includes(quizId) 
          ? state.completedQuizzes 
          : [...state.completedQuizzes, quizId]
      })),
      getScore: (quizId) => get().scores[quizId] || 0,
      resetProgress: () => set({ scores: {}, completedQuizzes: [] }),
    }),
    {
      name: 'bharat-decides-progress',
    }
  )
);
