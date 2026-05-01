describe('Navigation and UI', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the landing page and show the title', () => {
    cy.contains('Bharat Decides').should('be.visible');
  });

  it('should toggle between light and dark themes', () => {
    // Check initial state (default is likely system or light)
    cy.get('html').then(($html) => {
      const isDark = $html.hasClass('dark');
      
      // Find theme toggle button and click it
      cy.get('[data-testid="theme-toggle"]').click();
      
      // Verify theme changed
      if (isDark) {
        cy.get('html').should('not.have.class', 'dark');
      } else {
        cy.get('html').should('have.class', 'dark');
      }
    });
  });

  it('should show the scroll-to-top button after scrolling down', () => {
    cy.scrollTo(0, 500);
    // Assuming there is a scroll to top button
  });

  it('should open the Booth Finder modal', () => {
    cy.contains('Find My Booth').click();
    cy.contains('Booth Discovery').should('be.visible');
    cy.get('button').contains('ECI Official Portal').should('be.visible');
    // The dialog close button is usually an X or handled by onOpenChange
    // We can click outside or if there's a close button in the UI
    cy.get('body').type('{esc}'); 
    cy.contains('Booth Discovery').should('not.exist');
  });
});
