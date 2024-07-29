using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Counselors_Connect.Migrations
{
    /// <inheritdoc />
    public partial class initialmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Counselors",
                columns: table => new
                {
                    CounselorID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Counselors", x => x.CounselorID);
                });

            migrationBuilder.CreateTable(
                name: "Students",
                columns: table => new
                {
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Grade = table.Column<int>(type: "int", nullable: false),
                    AdvisorName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Students", x => x.StudentID);
                });

            migrationBuilder.CreateTable(
                name: "Topics",
                columns: table => new
                {
                    TopicID = table.Column<int>(type: "int", nullable: false),
                    TopicName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Topics", x => x.TopicID);
                });

            migrationBuilder.CreateTable(
                name: "Visits",
                columns: table => new
                {
                    VisitID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StudentID = table.Column<int>(type: "int", nullable: false),
                    CounselorID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    File = table.Column<bool>(type: "bit", nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ParentsCalled = table.Column<bool>(type: "bit", nullable: false),
                    Length = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visits", x => x.VisitID);
                    table.ForeignKey(
                        name: "FK_Visits_Counselors_CounselorID",
                        column: x => x.CounselorID,
                        principalTable: "Counselors",
                        principalColumn: "CounselorID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Visits_Students_StudentID",
                        column: x => x.StudentID,
                        principalTable: "Students",
                        principalColumn: "StudentID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VisitTopics",
                columns: table => new
                {
                    VisitID = table.Column<int>(type: "int", nullable: false),
                    TopicID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VisitTopics", x => new { x.VisitID, x.TopicID });
                    table.ForeignKey(
                        name: "FK_VisitTopics_Topics_TopicID",
                        column: x => x.TopicID,
                        principalTable: "Topics",
                        principalColumn: "TopicID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VisitTopics_Visits_VisitID",
                        column: x => x.VisitID,
                        principalTable: "Visits",
                        principalColumn: "VisitID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Counselors",
                columns: new[] { "CounselorID", "Name", "Password", "Username" },
                values: new object[,]
                {
                    { 1, "John Doe", "password", "johndoe" },
                    { 2, "Brody Van Eperen", "BrodyV1", "bvaneperen" }
                });

            migrationBuilder.InsertData(
                table: "Students",
                columns: new[] { "StudentID", "AdvisorName", "FirstName", "Grade", "LastName" },
                values: new object[,]
                {
                    { 1, "Mr. Brown", "Alice", 10, "Smith" },
                    { 2, "Mrs. Green", "Bob", 11, "Johnson" },
                    { 3, "Mr. White", "Charlie", 12, "Brown" }
                });

            migrationBuilder.InsertData(
                table: "Topics",
                columns: new[] { "TopicID", "TopicName" },
                values: new object[,]
                {
                    { 1, "Academic" },
                    { 2, "Career" },
                    { 3, "Personal" }
                });

            migrationBuilder.InsertData(
                table: "Visits",
                columns: new[] { "VisitID", "CounselorID", "Date", "Description", "File", "FilePath", "Length", "ParentsCalled", "StudentID" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2024, 7, 19, 0, 0, 0, 0, DateTimeKind.Unspecified), "Initial counseling session", false, "http://example.com/files/1", 30, true, 1 },
                    { 2, 1, new DateTime(2024, 7, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), "Follow-up session", true, "http://example.com/files/2", 45, false, 2 },
                    { 3, 2, new DateTime(2024, 7, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), "Career guidance", true, "http://example.com/files/3", 60, true, 3 }
                });

            migrationBuilder.InsertData(
                table: "VisitTopics",
                columns: new[] { "TopicID", "VisitID" },
                values: new object[,]
                {
                    { 1, 1 },
                    { 2, 1 },
                    { 3, 2 },
                    { 1, 3 },
                    { 3, 3 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Visits_CounselorID",
                table: "Visits",
                column: "CounselorID");

            migrationBuilder.CreateIndex(
                name: "IX_Visits_StudentID",
                table: "Visits",
                column: "StudentID");

            migrationBuilder.CreateIndex(
                name: "IX_VisitTopics_TopicID",
                table: "VisitTopics",
                column: "TopicID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VisitTopics");

            migrationBuilder.DropTable(
                name: "Topics");

            migrationBuilder.DropTable(
                name: "Visits");

            migrationBuilder.DropTable(
                name: "Counselors");

            migrationBuilder.DropTable(
                name: "Students");
        }
    }
}
