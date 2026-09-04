using CeperioServiceDesk.API.Configuration;
using CeperioServiceDesk.API.Data;
using CeperioServiceDesk.API.Middleware;
using CeperioServiceDesk.API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().
    ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var problemDetails = new ValidationProblemDetails(context.ModelState)
            {
                Type = "https://httpstatuses.com/400",
                Title = "Erro de validação",
                Status = StatusCodes.Status400BadRequest,
                Detail = "Um ou mais campos possuem valores inválidos.",
                Instance = context.HttpContext.Request.Path
            };

            return new BadRequestObjectResult(problemDetails)
            {
                ContentTypes = { "application/problem+json" }
            };
        };
    });

builder.Services.AddOpenApi();

builder.Services.AddProblemDetails(options =>
{
    options.CustomizeProblemDetails = context =>
    {
        context.ProblemDetails.Instance = context.HttpContext.Request.Path;
    };
});

builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));


string sqlServerConnection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(sqlServerConnection));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var dbContext = context.HttpContext.RequestServices
                    .GetRequiredService<AppDbContext>();

                var userIdClaim = context.Principal?.FindFirst(ClaimTypes.NameIdentifier);
                var tokenVersionClaim = context.Principal?.FindFirst("token_version");

                if (userIdClaim is null || tokenVersionClaim is null)
                {
                    context.Fail("Token inválido.");
                    return;
                }

                if (!int.TryParse(userIdClaim.Value, out var userId) ||
                    !int.TryParse(tokenVersionClaim.Value, out var tokenVersion))
                {
                    context.Fail("Token inválido.");
                    return;
                }

                var user = await dbContext.Users
                    .AsNoTracking()
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user is null || !user.IsActive)
                {
                    context.Fail("Usuário inválido.");
                    return;
                }

                if (user.TokenVersion != tokenVersion)
                {
                    context.Fail("Token expirado.");
                }
            }
        };
    });

builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(options => 
{
    options.WithOrigins("http://localhost:5173");
    options.AllowAnyMethod(); 
    options.AllowAnyHeader();
});

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
