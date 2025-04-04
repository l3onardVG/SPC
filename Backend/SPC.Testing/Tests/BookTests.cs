using Microsoft.VisualStudio.TestTools.UnitTesting;
using SPC.Business.Services;
using SPC.Data.Models;
namespace SPC.Tests;

[TestClass]
public class BookTests
{
    private readonly Book _correctBook;

    public BookTests()
    {
        _correctBook = new Book()
        {
            Id = 1
        };
    }

    [TestMethod]
    public async Task ValidateBookCreation()
    {
        // Arrange
        var service = new BookService(null);
        var book = new Book()
        {
            AuthorId = 1,
            Name = "Echoes of the Past",
            ISBN13 = "978-1-23-456789-7",
            Editorial = "HarperCollins",
            YearOfPubliction = 2018,
            Format = 0,
            Genrre = 0,
            Language = "English",
            cover = "cover2jpg",
            Edition = "2nd",
            Summary = "A deep dive into ancient civilizations.",
            Deleted = false,
            Long = 420,
            Id = 1
        };

        // Act
        var response = await service.TestBookCreation(book);

        // Assert
        Assert.AreEqual(response, String.Empty);
    }

    [TestMethod]
    public async Task ValidateBookCreation_nameisempty()
    {
        // Arrange
        var service = new BookService(null);
        var book = new Book()
        {
            AuthorId = 1,
            Name = "",
            ISBN13 = "978-1-23-456789-7",
            Editorial = "HarperCollins",
            YearOfPubliction = 2018,
            Format = 0,
            Genrre = 0,
            Language = "English",
            cover = "cover2jpg",
            Edition = "2nd",
            Summary = "A deep dive into ancient civilizations.",
            Deleted = false,
            Long = 420,
            Id = 1
        };

        // Act
        var response = await service.TestBookCreation(book);

        // Assert
        Assert.IsTrue(response.Contains("El nombre es requerido"));
    }

    [TestMethod]
    public async Task ValidateBookCreation_yearoutofrange()
    {
        // Arrange
        var service = new BookService(null);
        var book = new Book()
        {
            AuthorId = 1,
            Name = "Echoes of the Past",
            ISBN13 = "978-1-23-456789-7",
            Editorial = "HarperCollins",
            YearOfPubliction = 2026,
            Format = 0,
            Genrre = 0,
            Language = "English",
            cover = "cover2jpg",
            Edition = "2nd",
            Summary = "A deep dive into ancient civilizations.",
            Deleted = false,
            Long = 420,
            Id = 1
        };

        // Act
        var response = await service.TestBookCreation(book);

        // Assert
        Assert.IsTrue(response.Contains("El año de publicación debe ser entre 1450 y 2025"));
    }

    [TestMethod]
    public async Task ValidateBookCreation_editorialisempty()
    {
        // Arrange
        var service = new BookService(null);
        var book = new Book()
        {
            AuthorId = 1,
            Name = "Echoes of the Past",
            ISBN13 = "978-1-23-456789-7",
            Editorial = "",
            YearOfPubliction = 2025,
            Format = 0,
            Genrre = 0,
            Language = "English",
            cover = "cover2jpg",
            Edition = "2nd",
            Summary = "A deep dive into ancient civilizations.",
            Deleted = false,
            Long = 420,
            Id = 1
        };

        // Act
        var response = await service.TestBookCreation(book);

        // Assert
        Assert.IsTrue(response.Contains("La editorial es requerida"));
    }

}
