using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoticaDelAlma.API.Migrations
{
    /// <inheritdoc />
    public partial class AddImportFieldsToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Products",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CostPrice",
                table: "Products",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinStock",
                table: "Products",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProductType",
                table: "Products",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Provider",
                table: "Products",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Stone",
                table: "Products",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Products_Code",
                table: "Products",
                column: "Code",
                unique: true,
                filter: "\"Code\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_Code",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CostPrice",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinStock",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ProductType",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Provider",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Stone",
                table: "Products");
        }
    }
}
