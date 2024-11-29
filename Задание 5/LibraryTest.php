<?php
use PHPUnit\Framework\TestCase;
require_once 'models/book.php';
require_once 'models/reader.php';
require_once 'models/library.php';

class LibraryTest extends TestCase
{
    private $library;

    protected function setUp(): void
    {
        $connect = new mysqli('localhost', 'root', '', 'library');
        $connect->set_charset("utf8"); // кодировка для работы с русскими символами
        $this->library = new Library($connect);

        // чистим базу перед каждым тестом
        $connect->query("DELETE FROM books");
        $connect->query("DELETE FROM readers");
        $connect->query("DELETE FROM borrowings");
    }

    public function testAddingBookToLibrary()
    {
        // Сценарий: добавление книги
        $book = new Book("Преступление и наказание", "Фёдор Достоевский");
        $this->library->addBook($book);

        // Проверка: книга успешно добавлена
        $books = $this->library->getBooks();
        $this->assertCount(1, $books, "Ожидалось 1 книга, но получено: " . count($books));
        $this->assertEquals("Преступление и наказание", $books[0]->getTitle());
        
    }

    public function testRemovingBookFromLibrary()
    {
        // Добавляем книгу
        $book = new Book("Анна Каренина", "Лев Толстой");
        $this->library->addBook($book);

        // Удаляем книгу
        $this->library->removeBook($book->getId());

        // Проверка: книги больше нет
        $this->assertEmpty($this->library->getBooks());
    }

    public function testRegisteringReader()
    {
        // Сценарий: регистрация читателя
        $reader = new Reader("Иван Иванов");
        $this->library->registerReader($reader);

        // Проверка: читатель успешно зарегистрирован
        $readers = $this->library->getReaders();
        $this->assertCount(1, $readers);
        $this->assertEquals("Иван Иванов", $readers[0]->getName());
    }

    public function testBorrowingBookByReader()
    {
        $book = new Book("Война и мир", "Лев Толстой");
        $reader = new Reader("Екатерина Петрова");

        $this->library->addBook($book);
        $this->library->registerReader($reader);
        
        $bookId = $this->library->getBooks()[0]->getId();
        $readerId = $this->library->getReaders()[0]->getId();

        // Выдача книги
        $this->library->borrowBook($bookId, $readerId);

        // Проверяем, что запись появилась в borrowings
        $result = $this->library->connection->query("SELECT * FROM borrowings WHERE book_id = $bookId AND reader_id = $readerId");
        $this->assertNotEmpty($result->fetch_all());
        
        // Получаем обновленный объект книги
        $books = $this->library->getBooks();
        $this->assertTrue($books[0]->isBorrowed());
    }
    
    public function testReturningBookToLibrary()

    {
        $book = new Book("Мастер и Маргарита", "Михаил Булгаков");
        $reader = new Reader("Алексей Смирнов");

        $this->library->addBook($book);
        $this->library->registerReader($reader);

        $bookId = $this->library->getBooks()[0]->getId();
        $readerId = $this->library->getReaders()[0]->getId();

        $this->library->borrowBook($bookId, $readerId);

        // Возврат книги
        $this->library->returnBook($bookId);

        // Проверка: книга помечена как доступная
        $books = $this->library->getBooks();
        $this->assertFalse($books[0]->isBorrowed());

        // Проверяем, что запись в borrowings обновилась
        $result = $this->library->connection->query("SELECT * FROM borrowings WHERE book_id = $bookId AND returned_at IS NOT NULL");
        $this->assertNotEmpty($result->fetch_all());
    }
    
    
}
