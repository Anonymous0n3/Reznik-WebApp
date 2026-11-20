using Microsoft.EntityFrameworkCore;
using Reznik_WebApp.Server.Models;

namespace Reznik_WebApp.Server
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Dog> Dogs { get; set; }
        public DbSet<Litter> Litters { get; set; }
        public DbSet<Reservation> Reservations { get; set; }
        public DbSet<AdminUser> AdminUsers { get; set; }
        public DbSet<GalleryImage> GalleryImages { get; set; }
        public DbSet<Puppy> Puppies { get; set; }
        public DbSet<DogImage> DogImages { get; set; }
        public DbSet<PuppyImage> PuppyImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Litter>()
                .HasOne(l => l.Sire)
                .WithMany()
                .HasForeignKey(l => l.SireId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Litter>()
                .HasOne(l => l.Dam)
                .WithMany()
                .HasForeignKey(l => l.DamId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}