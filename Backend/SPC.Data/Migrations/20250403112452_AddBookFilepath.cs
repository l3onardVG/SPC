using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SPC.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBookFilepath : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "Book",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "Book");
        }
    }
}
