using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SPC.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNewModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "BookLog",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Rating",
                table: "BookLog",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "Book",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "BookLog");

            migrationBuilder.DropColumn(
                name: "Rating",
                table: "BookLog");

            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Book");
        }
    }
}
