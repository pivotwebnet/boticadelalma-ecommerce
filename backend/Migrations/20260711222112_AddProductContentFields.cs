using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoticaDelAlma.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductContentFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Care",
                table: "Products",
                type: "character varying(800)",
                maxLength: 800,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Products",
                type: "character varying(1500)",
                maxLength: 1500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HowToUse",
                table: "Products",
                type: "character varying(800)",
                maxLength: 800,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Shipping",
                table: "Products",
                type: "character varying(800)",
                maxLength: 800,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Care",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "HowToUse",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Shipping",
                table: "Products");
        }
    }
}
