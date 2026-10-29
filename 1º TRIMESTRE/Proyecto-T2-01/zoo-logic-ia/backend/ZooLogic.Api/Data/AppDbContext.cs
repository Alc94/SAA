using Microsoft.EntityFrameworkCore;
using ZooLogic.Api.Models;

namespace ZooLogic.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Species> Species => Set<Species>();
    public DbSet<Animal> Animals => Set<Animal>();
    public DbSet<VetRecord> VetRecords => Set<VetRecord>();

    // Los nombres de tablas y columnas siguen el esquema de database/init/01_schema.sql
    // (snake_case mediante UseSnakeCaseNamingConvention).
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Species>(e =>
        {
            e.ToTable("species");
            e.HasIndex(x => x.CommonName).IsUnique();
            e.Property(x => x.CommonName).HasMaxLength(100);
            e.Property(x => x.ScientificName).HasMaxLength(120);
            e.Property(x => x.ConservationStatus).HasMaxLength(2);
            e.Property(x => x.Habitat).HasMaxLength(200);
            e.Property(x => x.Diet).HasMaxLength(200);
            e.Property(x => x.EducationalFact).HasMaxLength(500);
        });

        modelBuilder.Entity<Animal>(e =>
        {
            e.ToTable("animals");
            e.HasIndex(x => x.TagCode).IsUnique();
            e.Property(x => x.Name).HasMaxLength(80);
            e.Property(x => x.TagCode).HasMaxLength(40);
            e.Property(x => x.Sex).HasMaxLength(12);
            e.Property(x => x.Enclosure).HasMaxLength(80);
            e.Property(x => x.HealthStatus).HasMaxLength(20);
            e.Property(x => x.Notes).HasMaxLength(1000);
            e.Property(x => x.WeightKg).HasPrecision(8, 2);
            e.HasOne(x => x.Species)
                .WithMany(s => s.Animals)
                .HasForeignKey(x => x.SpeciesId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<VetRecord>(e =>
        {
            e.ToTable("vet_records");
            e.Property(x => x.RecordType).HasMaxLength(30);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.Property(x => x.Source).HasMaxLength(20);
            e.Property(x => x.Veterinarian).HasMaxLength(80);
            e.Property(x => x.TemperatureC).HasPrecision(4, 1);
            e.Property(x => x.AnomalyScore).HasPrecision(3, 2);
            e.HasOne(x => x.Animal)
                .WithMany(a => a.Records)
                .HasForeignKey(x => x.AnimalId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
