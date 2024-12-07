class Book: 
    def __init__(self, title, author): 
        self.title = title 
        self.author = author 
        self.is_checked_out = False 
 
class Reader: 
    def __init__(self, name): 
        self.name = name 
        self.checked_out_books = [] 
 
class Library: 
    def __init__(self): 
        self.books = [] 
        self.readers = [] 
 
    def add_book(self, book): 
        self.books.append(book) 
 
    def remove_book(self, book): 
        self.books.remove(book) 
 
    def register_reader(self, reader): 
        self.readers.append(reader) 
 
    def check_out_book(self, reader, book): 
        if book in self.books and not book.is_checked_out: 
            book.is_checked_out = True 
            reader.checked_out_books.append(book) 
        else: 
            raise Exception("книга недоступна или уже выдана.") 
 
    def return_book(self, reader, book): 
        if book in reader.checked_out_books: 
            book.is_checked_out = False 
            reader.checked_out_books.remove(book) 
        else: 
            raise Exception("Эта книга не была выдана этому читателю.")
