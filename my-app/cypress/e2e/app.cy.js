describe('TaskFlow App', () => {
  const STORAGE_KEY = 'cypress_todos';

  beforeEach(() => {
    cy.visit('/');
  });

  describe('Initial render', () => {
    it('shows the header and title', () => {
      cy.contains('h1', 'TaskFlow').should('be.visible');
      cy.contains('h2', 'Tasks').should('be.visible');
    });

    it('loads the 3 default tasks', () => {
      cy.get('[data-cy=task-item]').should('have.length', 3);
      cy.get('[data-cy=task-text]').eq(0).should('have.text', 'Learn React State & Hooks');
      cy.get('[data-cy=task-text]').eq(1).should('have.text', 'Write end-to-end Cypress tests');
      cy.get('[data-cy=task-text]').eq(2).should('have.text', 'Build responsive web apps');
    });

    it('shows 2 items remaining', () => {
      cy.get('[data-cy=remaining-count]').should('contain', '2').and('contain', 'items remaining');
    });

    it('has an empty input with a placeholder', () => {
      cy.get('[data-cy=task-input]')
        .should('have.value', '')
        .and('have.attr', 'placeholder', 'What needs to be done?');
    });

    it('renders the footer', () => {
      cy.get('footer').should('contain', 'TaskFlow Application');
    });
  });

  describe('Navigation tabs', () => {
    it('renders both tabs and allows switching', () => {
      cy.contains('nav button', 'To-Do App').should('have.class', 'bg-indigo-600');
      cy.contains('nav button', 'Cypress Test Suite').click().should('have.class', 'bg-emerald-600');
      cy.contains('nav button', 'To-Do App').should('not.have.class', 'bg-indigo-600').click();
      cy.contains('nav button', 'To-Do App').should('have.class', 'bg-indigo-600');
    });
  });

  describe('Adding tasks', () => {
    it('adds a task with the button', () => {
      cy.get('[data-cy=task-input]').type('Automated Test Task');
      cy.get('[data-cy=add-task-btn]').click();

      cy.get('[data-cy=task-item]').should('have.length', 4);
      cy.get('[data-cy=task-text]').last().should('have.text', 'Automated Test Task');
      cy.get('[data-cy=remaining-count]').should('contain', '3');
    });

    it('adds a task by pressing Enter', () => {
      cy.get('[data-cy=task-input]').type('Enter key task{enter}');
      cy.get('[data-cy=task-item]').should('have.length', 4);
      cy.get('[data-cy=task-text]').last().should('have.text', 'Enter key task');
    });

    it('clears the input after adding', () => {
      cy.get('[data-cy=task-input]').type('Temp task');
      cy.get('[data-cy=add-task-btn]').click();
      cy.get('[data-cy=task-input]').should('have.value', '');
    });

    it('trims surrounding whitespace', () => {
      cy.get('[data-cy=task-input]').type('   Padded task   ');
      cy.get('[data-cy=add-task-btn]').click();
      cy.get('[data-cy=task-text]').last().should('have.text', 'Padded task');
    });

    it('does not add an empty task', () => {
      cy.get('[data-cy=add-task-btn]').click();
      cy.get('[data-cy=task-item]').should('have.length', 3);
    });

    it('does not add a whitespace-only task', () => {
      cy.get('[data-cy=task-input]').type('     ');
      cy.get('[data-cy=add-task-btn]').click();
      cy.get('[data-cy=task-item]').should('have.length', 3);
    });
  });

  describe('Toggling tasks', () => {
    it('completes an active task', () => {
      cy.get('[data-cy=task-checkbox]').eq(1).click();
      cy.get('[data-cy=task-text]').eq(1).should('have.class', 'line-through');
      cy.get('[data-cy=remaining-count]').should('contain', '1').and('contain', 'item remaining');
    });

    it('un-completes a completed task', () => {
      cy.get('[data-cy=task-text]').eq(0).should('have.class', 'line-through');
      cy.get('[data-cy=task-checkbox]').eq(0).click();
      cy.get('[data-cy=task-text]').eq(0).should('not.have.class', 'line-through');
      cy.get('[data-cy=remaining-count]').should('contain', '3');
    });

    it('shows 0 items remaining when everything is complete', () => {
      cy.get('[data-cy=task-checkbox]').eq(1).click();
      cy.get('[data-cy=task-checkbox]').eq(2).click();
      cy.get('[data-cy=remaining-count]').should('contain', '0').and('contain', 'items remaining');
    });
  });

  describe('Deleting tasks', () => {
    it('deletes a single task', () => {
      cy.get('[data-cy=delete-task-btn]').eq(1).click();
      cy.get('[data-cy=task-item]').should('have.length', 2);
      cy.contains('[data-cy=task-text]', 'Write end-to-end Cypress tests').should('not.exist');
    });

    it('shows the empty state after deleting all tasks', () => {
      cy.get('[data-cy=delete-task-btn]').each(() => {
        cy.get('[data-cy=delete-task-btn]').first().click();
      });
      cy.get('[data-cy=task-item]').should('not.exist');
      cy.contains('No tasks found.').should('be.visible');
    });
  });

  describe('Filters', () => {
    it('highlights the "All" filter by default', () => {
      cy.get('[data-cy=filter-all]').should('have.class', 'bg-indigo-600');
    });

    it('shows only active tasks', () => {
      cy.get('[data-cy=filter-active]').click().should('have.class', 'bg-indigo-600');
      cy.get('[data-cy=task-item]').should('have.length', 2);
      cy.get('[data-cy=task-text]').should('not.have.class', 'line-through');
    });

    it('shows only completed tasks', () => {
      cy.get('[data-cy=filter-completed]').click().should('have.class', 'bg-indigo-600');
      cy.get('[data-cy=task-item]').should('have.length', 1);
      cy.get('[data-cy=task-text]').should('have.text', 'Learn React State & Hooks');
    });

    it('returns to all tasks', () => {
      cy.get('[data-cy=filter-completed]').click();
      cy.get('[data-cy=filter-all]').click();
      cy.get('[data-cy=task-item]').should('have.length', 3);
    });

    it('shows the empty state when no tasks match the filter', () => {
      cy.get('[data-cy=task-checkbox]').eq(0).click(); // now 0 completed
      cy.get('[data-cy=filter-completed]').click();
      cy.get('[data-cy=task-item]').should('not.exist');
      cy.contains('No tasks found.').should('be.visible');
    });

    it('updates the active list when a task is completed', () => {
      cy.get('[data-cy=filter-active]').click();
      cy.get('[data-cy=task-checkbox]').first().click();
      cy.get('[data-cy=task-item]').should('have.length', 1);
    });
  });

  describe('Clear completed', () => {
    it('is enabled when completed tasks exist', () => {
      cy.get('[data-cy=clear-completed-btn]').should('be.enabled');
    });

    it('removes completed tasks only', () => {
      cy.get('[data-cy=clear-completed-btn]').click();
      cy.get('[data-cy=task-item]').should('have.length', 2);
      cy.contains('[data-cy=task-text]', 'Learn React State & Hooks').should('not.exist');
    });

    it('becomes disabled when no completed tasks remain', () => {
      cy.get('[data-cy=clear-completed-btn]').click();
      cy.get('[data-cy=clear-completed-btn]').should('be.disabled');
    });
  });

  describe('LocalStorage persistence', () => {
    it('saves todos to localStorage', () => {
      cy.get('[data-cy=task-input]').type('Persisted task');
      cy.get('[data-cy=add-task-btn]').click();

      cy.window().then((win) => {
        const saved = JSON.parse(win.localStorage.getItem(STORAGE_KEY));
        expect(saved).to.have.length(4);
        expect(saved[3].text).to.equal('Persisted task');
      });
    });

    it('restores todos after a reload', () => {
      cy.get('[data-cy=task-input]').type('Survives reload');
      cy.get('[data-cy=add-task-btn]').click();
      cy.get('[data-cy=task-checkbox]').eq(1).click();

      cy.reload();

      cy.get('[data-cy=task-item]').should('have.length', 4);
      cy.get('[data-cy=task-text]').last().should('have.text', 'Survives reload');
      cy.get('[data-cy=task-text]').eq(1).should('have.class', 'line-through');
    });

    it('loads seeded todos from localStorage', () => {
      const seeded = [{ id: 100, text: 'Seeded task', completed: false }];
      cy.window().then((win) => {
        win.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      });
      cy.reload();

      cy.get('[data-cy=task-item]').should('have.length', 1);
      cy.get('[data-cy=task-text]').should('have.text', 'Seeded task');
      cy.get('[data-cy=remaining-count]').should('contain', '1').and('contain', 'item remaining');
    });

    it('falls back to defaults when stored data is corrupt', () => {
      cy.window().then((win) => {
        win.localStorage.setItem(STORAGE_KEY, '{not valid json');
      });
      cy.reload();
      cy.get('[data-cy=task-item]').should('have.length', 3);
    });
  });
});
