using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BoticaDelAlma.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // defaultValue "[]": los productos existentes quedan con galería vacía
            // (JSON válido), no con un string vacío que rompería la deserialización.
            migrationBuilder.AddColumn<string>(
                name: "Images",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Images",
                table: "Products");
        }
    }
}
