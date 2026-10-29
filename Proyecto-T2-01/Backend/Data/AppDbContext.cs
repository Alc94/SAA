using Microsoft.EntityFrameworkCore;
using ZooLogic.Models;

namespace ZooLogic.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Animal> Animals { get; set; }
    }
}