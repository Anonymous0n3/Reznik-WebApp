using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Reznik_WebApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class PuppyImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Puppies");

            migrationBuilder.CreateTable(
                name: "PuppyImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Url = table.Column<string>(type: "text", nullable: false),
                    PuppyId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PuppyImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PuppyImages_Puppies_PuppyId",
                        column: x => x.PuppyId,
                        principalTable: "Puppies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PuppyImages_PuppyId",
                table: "PuppyImages",
                column: "PuppyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PuppyImages");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Puppies",
                type: "text",
                nullable: true);
        }
    }
}
