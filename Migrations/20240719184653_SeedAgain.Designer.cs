﻿// <auto-generated />
using System;
using Counselors_Connect.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Counselors_Connect.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20240719184653_SeedAgain")]
    partial class SeedAgain
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Counselors_Connect.Models.Counselor", b =>
                {
                    b.Property<int>("CounselorID")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CounselorID");

                    b.ToTable("Counselors", (string)null);

                    b.HasData(
                        new
                        {
                            CounselorID = 1,
                            Name = "John Doe",
                            Password = "password",
                            Username = "johndoe"
                        },
                        new
                        {
                            CounselorID = 2,
                            Name = "Brody Van Eperen",
                            Password = "BrodyV1",
                            Username = "bvaneperen"
                        });
                });

            modelBuilder.Entity("Counselors_Connect.Models.Student", b =>
                {
                    b.Property<int>("StudentID")
                        .HasColumnType("int");

                    b.Property<string>("AdvisorName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Grade")
                        .HasColumnType("int");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("StudentID");

                    b.ToTable("Students", (string)null);
                });

            modelBuilder.Entity("Counselors_Connect.Models.Topic", b =>
                {
                    b.Property<int>("TopicID")
                        .HasColumnType("int");

                    b.Property<string>("TopicName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("VisitID")
                        .HasColumnType("int");

                    b.HasKey("TopicID");

                    b.HasIndex("VisitID");

                    b.ToTable("Topics", (string)null);
                });

            modelBuilder.Entity("Counselors_Connect.Models.Visit", b =>
                {
                    b.Property<int>("VisitID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("VisitID"));

                    b.Property<int>("CounselorID")
                        .HasColumnType("int");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("File")
                        .HasColumnType("bit");

                    b.Property<int>("Length")
                        .HasColumnType("int");

                    b.Property<bool>("ParentsCalled")
                        .HasColumnType("bit");

                    b.Property<int>("StudentID")
                        .HasColumnType("int");

                    b.HasKey("VisitID");

                    b.HasIndex("CounselorID");

                    b.HasIndex("StudentID");

                    b.ToTable("Visits", (string)null);
                });

            modelBuilder.Entity("Counselors_Connect.Models.Topic", b =>
                {
                    b.HasOne("Counselors_Connect.Models.Visit", null)
                        .WithMany("Topics")
                        .HasForeignKey("VisitID");
                });

            modelBuilder.Entity("Counselors_Connect.Models.Visit", b =>
                {
                    b.HasOne("Counselors_Connect.Models.Counselor", null)
                        .WithMany("Visits")
                        .HasForeignKey("CounselorID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Counselors_Connect.Models.Student", null)
                        .WithMany("Visits")
                        .HasForeignKey("StudentID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("Counselors_Connect.Models.Counselor", b =>
                {
                    b.Navigation("Visits");
                });

            modelBuilder.Entity("Counselors_Connect.Models.Student", b =>
                {
                    b.Navigation("Visits");
                });

            modelBuilder.Entity("Counselors_Connect.Models.Visit", b =>
                {
                    b.Navigation("Topics");
                });
#pragma warning restore 612, 618
        }
    }
}
