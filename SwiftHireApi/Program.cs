// SwiftHire API — Entry point for the ASP.NET Core Web API.
// Configures services, middleware, CORS, Swagger, and the request pipeline.

using SwiftHireApi.Services;
using SwiftHireApi.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers ───────────────────────────────────────────────────────────────
builder.Services.AddControllers();

// ── Swagger / OpenAPI ─────────────────────────────────────────────────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "SwiftHire API", Version = "v1" });
});

// ── CORS ──────────────────────────────────────────────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("SwiftHireClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ── Database ──────────────────────────────────────────────────────────────────
// TODO: builder.Services.AddDbContext<SwiftHireDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("SwiftHireDb")));

// ── Hangfire ──────────────────────────────────────────────────────────────────
// TODO: Add Hangfire
// builder.Services.AddHangfire(config => config
//     .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
//     .UseSimpleAssemblyNameTypeSerializer()
//     .UseRecommendedSerializerSettings()
//     .UseSqlServerStorage(builder.Configuration.GetConnectionString("SwiftHireDb")));
// builder.Services.AddHangfireServer();

// ── Application Services ──────────────────────────────────────────────────────
builder.Services.AddScoped<IJobRepository, SqlJobRepository>();
builder.Services.AddScoped<IJobIngestionService, JobIngestionService>();

// ── Authorization ─────────────────────────────────────────────────────────────
builder.Services.AddAuthorization();

var app = builder.Build();

// ── Middleware Pipeline ───────────────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "SwiftHire API v1"));
}

app.UseHttpsRedirection();
app.UseCors("SwiftHireClient");
app.UseAuthorization();
app.MapControllers();

app.Run();
