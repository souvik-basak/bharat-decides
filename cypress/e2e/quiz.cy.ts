describe('Interactive Quiz', () => {
  beforeEach(() => {
    cy.visit('/');
    // Scroll to timeline to ensure elements are in view
    cy.get('#timeline').scrollIntoView();
  });

  it('should allow taking a quiz and seeing results', () => {
    // Wait for Analysis tab to ensure timeline is ready
    cy.contains('Analysis').should('be.visible');
    
    // Click on the Quiz tab using data-testid
    cy.get('[data-testid="quiz-tab"]').click({ force: true });
    
    // Check if quiz title is visible
    cy.contains('Registration Intelligence').should('be.visible');
    
    // Select an option (Form 6 is the correct one for the first question)
    cy.contains('Form 6').click();
    
    // Check if explanation appears
    cy.contains('Explanation').should('be.visible');
    
    // Click Next
    cy.contains('Next Question').click();
    
    // Answer second question
    cy.contains('Booth Level Officer (BLO)').click();
    
    // Finish quiz
    cy.contains('Finish Quiz').click();
    
    // Check for completion state
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Perfect Score').should('be.visible');
  });
});
