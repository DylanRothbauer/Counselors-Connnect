using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Counselors_Connect.Migrations
{
    /// <inheritdoc />
    public partial class SeedAgain : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        }
    }
}
