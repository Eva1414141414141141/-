describe('Тесты на сайте unsplash', () => {
  it('Cookie', () => {
    
    cy.setCookie('uuid', 'f6e5644f-9b7f-456d-9365-9ba888d61f5c');
    cy.getCookie('uuid').should('have.property', 'value', 'f6e5644f-9b7f-456d-9365-9ba888d61f5c'); 
    
    // Дополнительно, можно проверить, что cookie действительно присутствует
    cy.getCookies().should('have.length', 1).should((cookies) => {
        expect(cookies[0]).to.have.property('name', 'uuid');
        expect(cookies[0]).to.have.property('value', 'f6e5644f-9b7f-456d-9365-9ba888d61f5c');
        expect(cookies[0]).to.have.property('httpOnly', false);
        expect(cookies[0]).to.have.property('secure', false);
    });
});

it('Поиск изображения по ключевому слову', () => {
  cy.visit('https://unsplash.com');
  cy.get('input[data-testid="nav-bar-search-form-input"]')
 .should('be.visible') //виден
 .wait(1000) // явное ожидание 1 секунду 
 .clear()
 .type('mountains', { delay: 100 }) //задержка 100 мс
 .type('{enter}');
  cy.url().should('include', '/s/photos/mountains'); // проыерка что URL изменился
   cy.get('figure').should('exist');
 });

 it('Фильтрация результатов поиска по категориям', () => {
   cy.visit('https://unsplash.com');
   cy.wait(2000); 
   cy.contains('Travel').should('be.visible').click();
   cy.url().should('include', '/t/travel');
   cy.get('figure').should('exist');
 });
 
 it ('Проверка посмотреть изображения', () => {
   cy.visit('https://unsplash.com/s/photos/mountains');
   cy.wait(2000); 
   cy.get('figure').first().click(); //кликаем по первому изображению
   cy.wait(2000); 
   cy.url().should('include', '/photos/'); 
   cy.wait(2000); 
 });

 it('Фильтр', () => {
   cy.visit('https://unsplash.com/s/photos/mountains');

   cy.get('button:contains("Filters")')
       .should('be.visible') 
       .click();
   cy.get('dialog[open]')
       .should('be.visible'); 
   cy.get('h4:contains("Filters")')
       .should('be.visible');
   cy.get('button:contains("Newest")')
       .should('be.visible') 
       .click({ force: true });

   // Apply
   cy.get('button[type="submit"].IF9eQ.kx6eK.x_EXo.R6ToQ.QcIGU.l0vpf.GeorM.ncszm.MCje9')
   .wait(2000) 
   .should('be.visible')
   .wait(2000) 
   .click({force: true}); // пробуем кликнуть игнорируя возможные перекрытия
   cy.get('figure').should('exist');
 });

 it('Изменение языка с английского на 日本語', () => {
   cy.visit('https://unsplash.com');
   cy.wait(2000); 
   cy.get('button[title="View more links"]')
     .should('be.visible')
     .click();
   cy.get('button[title="Select your language"]', { timeout: 10000 }) //10 секунд
     .should('be.visible', { timeout: 10000 })  
     .click({ force: true }); 
   cy.get('button[role="menuitem"]') 
     .contains('日本語') 
     .click(); 

});


});