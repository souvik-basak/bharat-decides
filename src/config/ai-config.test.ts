import { describe, it, expect } from 'vitest';
import { VANI_CONFIG } from './ai-config';

describe('VANI_CONFIG', () => {
  it('should have the correct model', () => {
    expect(VANI_CONFIG.model).toBeDefined();
  });

  it('should generate system instructions in the requested language', () => {
    const language = 'Hindi';
    const instruction = VANI_CONFIG.getSystemInstruction(language);
    expect(instruction).toContain(`Respond strictly in ${language}`);
    expect(instruction).toContain('Vani');
    expect(instruction).toContain('Bharat Decides');
  });

  it('should have a low temperature for predictable responses', () => {
    expect(VANI_CONFIG.generationConfig.temperature).toBeLessThanOrEqual(0.5);
  });
});
