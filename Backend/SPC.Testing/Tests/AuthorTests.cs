using Microsoft.VisualStudio.TestTools.UnitTesting;
using SPC.Business.Services;
using SPC.Data.Models;
namespace SPC.Tests;

[TestClass]
public class AuthorTests
{
    private readonly Author _correctAuthor;

    public AuthorTests()
    {
        _correctAuthor = new Author()
        {
            Id = 1
        };
    }

    [TestMethod]
    public async Task ValidateAuthorCreation()
    {
        // Arrange
        var service = new AuthorService(null);
        var author = new Author()
        {
            Name = "John",
            Surname = "Doe",
            About = "An aspiring writer of fiction.",
            IsAlive = true,
            Deleted = false,
            Id = 1
        };

        // Act
        var response = await service.TestAuthorCreation(author);

        // Assert
        Assert.AreEqual(response, String.Empty);
    }

    [TestMethod]
    public async Task ValidateAuthorCreation_nameisempty()
    {
        // Arrange
        var service = new AuthorService(null);
        var author = new Author
        {
            Name = "",
            Surname = "Doe",
            About = "An aspiring writer of fiction.",
            IsAlive = true,
            Deleted = false,
            Id = 1
        };

        // Act
        var response = await service.TestAuthorCreation(author);

        //Assert
        Assert.IsTrue(response.Contains("El nombre es requerido"));

    }

}
