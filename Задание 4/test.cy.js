describe('Тесты на сайте unsplash', () => {
  it('Поиск изображения по ключевому слову', () => {
   cy.visit('https://unsplash.com');
   cy.get('input[data-testid="nav-bar-search-form-input"]')
  .should('be.visible')
  .wait(1000) // явное ожидание
  .clear()
  .type('mountains', { delay: 100 })
  .type('{enter}');
   cy.url().should('include', '/s/photos/mountains');
    cy.get('figure').should('exist');
  });
  it('Фильтрация результатов поиска по категориям', () => {
    cy.visit('https://unsplash.com');
    cy.wait(2000); // Явное ожидание
    cy.contains('Animals').should('be.visible').click();
    cy.url().should('include', '/t/animals');
    cy.get('figure').should('exist');
  });
  

  //it('Скачивание изображения', () => {
  //  cy.visit('https://unsplash.com');
  //  cy.wait(2000); // Явное ожидание
  //  cy.get('figure').first().click(); // Кликаем по первому изображению
  //  cy.wait(2000); // Явное ожидание
  //  cy.get('button[title="Download free"]', { timeout: 10000 }) // Находим кнопку скачивания
  //    .should('be.visible')
  //    .click(); // Нажимаем на кнопку скачивания
    
    // Можно добавить проверку, что скачивание действительно началось, хотя это может быть сложно сделать в автоматизированных тестах.
  //  cy.url().should('include', '/photos/'); // Проверка URL
  //});

  

  it ('Проверка посмотреть изображения', () => {
    cy.visit('https://unsplash.com/s/photos/mountains');
    cy.wait(2000); // Явное ожидание
    cy.get('figure').first().click(); //Кликаем по первому изображению
    cy.wait(2000); // Явное ожидание
    cy.url().should('include', '/photos/'); // Проверяем, что URL изменился
    cy.wait(2000); // Явное ожидание
  });

  it('Фильтр', () => {
    cy.visit('https://unsplash.com/s/photos/mountains');

    // Нажимаем на кнопку "Filters"
    cy.get('button:contains("Filters")')
        .should('be.visible') 
        .click();

    // Проверяем, что диалог "Filters" открыт
    cy.get('dialog[open]')
        .should('be.visible'); // Проверяем, что диалог виден

    // Проверка наличия заголовка "Filters"
    cy.get('h4:contains("Filters")').should('be.visible');

    // Выбор фильтра "Newest"
    cy.get('button:contains("Newest")')
        .should('be.visible') 
        .click();

    // Дополнительно можно проверить, что фильтр изменился на "Newest"
    cy.get('button[disabled]')
        .contains("Relevance") // Проверяем, что предыдущий фильтр "Relevance" теперь неактивен
        .should('exist'); // Проверяем, что он действительно существует
    cy.get('button:contains("Newest")')
        .should('exist'); // Убедитесь, что он действительно выбран

        // Нажимаем на кнопку "Apply"
    cy.get('button[type="submit"]')
    .should('be.visible') // Проверяем, что кнопка "Apply" видима
    .click(); 
});

 
  it('Изменение языка с английского на русский', () => {
    cy.visit('https://unsplash.com');
    cy.wait(2000); //Явное ожидание

    cy.get('button[title="View more links"]')
      .should('be.visible')
      .click();

    cy.get('button[title="Select your language"]', { timeout: 10000 })
      .should('be.visible', { timeout: 10000 })  // Ждем видимость кнопки
      .click({ force: true }); // Пробуем кликнуть, игнорируя возможные перекрытия
    
    cy.get('button[role="menuitem"]') // Находим кнопки языков
      .contains('日本語') // Ищем кнопку
      .click(); // Нажимаем на кнопку

});


});