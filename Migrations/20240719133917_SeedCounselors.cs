using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Counselors_Connect.Migrations
{
    /// <inheritdoc />
    public partial class SeedCounselors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Counselors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Counselors",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Counselors",
                columns: new[] { "CounselorID", "Name", "Password", "Username" },
                values: new object[,]
                {
                    { 1, "John Doe", "password", "johndoe" },
                    { 2, "Brody Van Eperen", "BrodyV1", "bvaneperen" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Counselors",
                keyColumn: "CounselorID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Counselors",
                keyColumn: "CounselorID",
                keyValue: 2);

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Counselors");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "Counselors");
        }
    }
}
