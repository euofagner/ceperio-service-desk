using Microsoft.EntityFrameworkCore;

namespace CeperioServiceDesk.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{ 
}
