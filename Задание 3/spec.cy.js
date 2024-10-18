describe('Тесты на сайте saucedemo', () => {
  
  // Этот блок выполняется перед каждым тестом, чтобы каждый раз заново не писать код авторизации
  beforeEach(() => {
    // Открываем сайт
    cy.visit('https://www.saucedemo.com')

    // Вводим логин и пароль
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')

    // Нажимаем кнопку "Войти"
    cy.get('[data-test="login-button"]').click()

    // Проверяем, что мы успешно вошли на страницу с товарами
    cy.url().should('include', '/inventory')
  })

  // Первый тест - проверяем, что авторизация работает
  it('Проверка успешного входа в систему', () => {
    // Если авторизация выполнена, тест проходит. Ничего дополнительно проверять не нужно.
    cy.get('.inventory_item').should('be.visible')
  })

  // Второй тест - проверяем сортировку по цене "от дешевых к дорогим"
  it('Сортировка по возрастанию цены', () => {
    // Выбираем сортировку "от дешевых к дорогим"
    cy.get('.product_sort_container').select('lohi')

    // Собираем все цены в массив
    let цены = []
    cy.get('.inventory_item_price').each(($цена) => {
      цены.push(parseFloat($цена.text().replace('$', '')))
    }).then(() => {
      // Проверяем, что цены отсортированы правильно (по возрастанию)
      const отсортированныеЦены = [...цены].sort((a, b) => a - b)
      expect(цены).to.deep.equal(отсортированныеЦены)
    })
  })

  // Третий тест - проверяем сортировку по цене "от дорогих к дешевым"
  it('Сортировка по убыванию цены', () => {
    // Выбираем сортировку "от дорогих к дешевым"
    cy.get('.product_sort_container').select('hilo')

    // Собираем все цены в массив
    let цены = []
    cy.get('.inventory_item_price').each(($цена) => {
      цены.push(parseFloat($цена.text().replace('$', '')))
    }).then(() => {
      // Проверяем, что цены отсортированы правильно (по убыванию)
      const отсортированныеЦены = [...цены].sort((a, b) => b - a)
      expect(цены).to.deep.equal(отсортированныеЦены)
    })
  })

  // Четвертый тест - добавляем товары в корзину и оформляем заказ
  it('Добавление товаров в корзину и оформление заказа', () => {
    // Добавляем два товара в корзину
    cy.get('[data-test="add-to-cart-sauce-labs-backpack"]').click()
    cy.get('[data-test="add-to-cart-sauce-labs-bike-light"]').click()

    // Переходим в корзину
    cy.get('.shopping_cart_link').click()

    // Проверяем, что в корзине два товара
    cy.get('.cart_item').should('have.length', 2)

    // Переходим к оформлению заказа
    cy.get('[data-test="checkout"]').click()

    // Вводим данные покупателя
    cy.get('[data-test="firstName"]').type('Иван')
    cy.get('[data-test="lastName"]').type('Иванов')
    cy.get('[data-test="postalCode"]').type('123456')

    // Нажимаем кнопку "Продолжить"
    cy.get('[data-test="continue"]').click()

    // Подтверждаем заказ
    cy.get('[data-test="finish"]').click()

    // Проверяем, что заказ успешно оформлен
    cy.get('.complete-header').should('contain', 'Thank you for your order!')
  })

})
