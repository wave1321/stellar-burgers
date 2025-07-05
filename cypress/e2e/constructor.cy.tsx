// конастанты
const ingredientItem = '[data-cy="ingredient-item"]';
const constructorItem = '[data-cy="constructor-item"]';
const constructorBunTop = '[data-cy="constructor-bun-top"]';
const constructorBunBottom = '[data-cy="constructor-bun-bottom"]';
const modal = '[data-cy="modal"]';
const modalCloseButton = '[data-cy="modal-close-button"]';
const modalOverlay = '[data-cy="modal-overlay"]';
const orderTotal = '[data-cy="order-total"]';

// кастомные команды
Cypress.Commands.add('addIngredient', (label: string) => {
  cy.get(ingredientItem).contains(label).parent().contains('Добавить').click();
});

describe('Добавление элементов в конструктор', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');

    cy.get(ingredientItem).as('ingredientItem');
  });

  it('Добавление булки', () => {
    cy.addIngredient('Краторная булка N-200i');
    cy.get(constructorBunTop).should('exist');
    cy.get(constructorBunBottom).should('exist');
  });

  it('Добавление ингредиента', () => {
    cy.addIngredient('Филе Люминесцентного');
    cy.get('@ingredientItem').should('exist');
  });
});

describe('Работа модального окна', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('/');

    cy.get(ingredientItem).as('ingredientItem');
  });

  it('Открытие модального окна', () => {
    cy.get('@ingredientItem').first().click();
    cy.get(modal).should('exist');
    cy.get('#modals')
      .should('contain', 'Описание ингредиента')
      .should('contain', 'Краторная булка N-200i')
      .contains('Жиры, г')
      .parent()
      .contains('33');
  });

  it('Закрытие модалки через крестик', () => {
    cy.get('@ingredientItem').first().click();
    cy.get(modalCloseButton).click();
    cy.get(modal).should('not.exist');
  });

  it('Закрытие модалки через оверлей', () => {
    cy.get('@ingredientItem').first().click();
    cy.get(modalOverlay).click({ force: true });
    cy.get(modal).should('not.exist');
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

    cy.get(orderTotal).as('orderTotal');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Непосредственно имитация создания заказа', () => {
    cy.addIngredient('Краторная булка N-200i');

    cy.addIngredient('Филе Люминесцентного');

    cy.get('@orderTotal').contains('Оформить заказ').click();

    cy.wait('@createOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: ['1', '3', '1']
      });

    cy.get(modal).should('be.visible');
    cy.contains('12345').should('exist');

    cy.get(modalCloseButton).click();
    cy.get(modal).should('not.exist');

    cy.get(constructorBunTop).should('not.exist');
    cy.get(constructorItem).should('not.exist');
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
