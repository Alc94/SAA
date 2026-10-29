using Microsoft.EntityFrameworkCore;
using ZooLogic.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? throw new InvalidOperationException("Falta la cadena de conexión 'ConnectionStrings:Default'.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options
        .UseNpgsql(connectionString, npgsql => npgsql.EnableRetryOnFailure(5))
        .UseSnakeCaseNamingConvention());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

// En producción el frontend (nginx) hace de proxy inverso en /api, por lo que no hay CORS.
// Esta política solo facilita el desarrollo con "ng serve" en el puerto 4200.
builder.Services.AddCors(options =>
    options.AddPolicy("DevFrontend", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("DevFrontend");
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
