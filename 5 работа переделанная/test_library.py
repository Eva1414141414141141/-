import unittest 
from library import Book, Reader, Library 

class TestLibraryManagementSystem(unittest.TestCase): 

    def setUp(self): 
        self.library = Library() 
        self.book1 = Book("1984", "Джордж Оруэлл") 
        self.book2 = Book("Убить пересмешника", "Харпер Ли") 
        self.reader1 = Reader("человек1") 
        self.reader2 = Reader("человек2") 

    def test_add_book(self): 
        print("добавление книги в библиотеку") 
        self.library.add_book(self.book1) 
        self.assertIn(self.book1, self.library.books) 

    def test_remove_book(self): 
        print("удаление книги из библиотеки") 
        self.library.add_book(self.book1) 
        self.library.remove_book(self.book1) 
        self.assertNotIn(self.book1, self.library.books) 

    def test_register_reader(self): 
        print("регистрация читателя") 
        self.library.register_reader(self.reader1) 
        self.assertIn(self.reader1, self.library.readers) 

    def test_check_out_book(self): 
        print("выдача книги читателю") 
        self.library.add_book(self.book1) 
        self.library.check_out_book(self.reader1, self.book1) 
        self.assertIn(self.book1, self.reader1.checked_out_books) 
        self.assertTrue(self.book1.is_checked_out) 

    def test_return_book(self): 
        print("возврат книги читателем") 
        self.library.add_book(self.book1) 
        self.library.check_out_book(self.reader1, self.book1) 
        self.library.return_book(self.reader1, self.book1) 
        self.assertNotIn(self.book1, self.reader1.checked_out_books) 
        self.assertFalse(self.book1.is_checked_out) 

    def test_check_out_book_not_available(self):
        print("попытка выдачи недоступной книги") 
        self.library.add_book(self.book1) 
        self.library.check_out_book(self.reader1, self.book1) 

        with self.assertRaises(Exception) as context: 
            self.library.check_out_book(self.reader2, self.book1) 

        self.assertEqual(str(context.exception), "книга недоступна или уже выдана.")  

if __name__ == '__main__':  
    unittest.main()
