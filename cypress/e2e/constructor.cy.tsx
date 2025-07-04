describe('Добавление элементов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Добавление булки', () => {
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .parent()
      .contains('Добавить')
      .click();
    cy.get('[data-cy="constructor-bun-top"]').should('exist');
    cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
  });

  it('Добавление ингредиента', () => {
    cy.get('[data-cy="ingredient-item"]')
      .contains('Филе Люминесцентного')
      .parent()
      .contains('Добавить')
      .click();
    cy.get('[data-cy="constructor-item"]').should('exist');
  });
});

describe('Работа модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');
  });

  it('Открытие модального окна', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal"]').should('exist');
    cy.get('#modals').should('contain', 'Описание ингредиента');
  });

  it('Закрытие модалки через крестик', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрытие модалки через оверлей', () => {
    cy.get('[data-cy="ingredient-item"]').first().click();
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as(
      'createOrder'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('tet-refreshToken')
    );
    cy.setCookie('accessToken', 'test-refreshToken');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Непосредственно имитация создания заказа', () => {
    cy.get('[data-cy="ingredient-item"]')
      .contains('Краторная булка N-200i')
      .parent()
      .contains('Добавить')
      .click();

    cy.get('[data-cy="ingredient-item"]')
      .contains('Филе Люминесцентного')
      .parent()
      .contains('Добавить')
      .click();

    cy.get('[data-cy="order-total"]').contains('Оформить заказ').click();

    cy.wait('@createOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '3', '1']
      });

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.contains('12345').should('exist');

    cy.get('[data-cy="modal-close-button"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
    cy.get('[data-cy="constructor-item"]').should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
