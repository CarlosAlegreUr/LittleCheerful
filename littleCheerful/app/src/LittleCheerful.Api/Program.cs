using LittleCheerful.Api.Configuration;
using LittleCheerful.Api.Hubs;
using LittleCheerful.Api.Services;
using LittleCheerful.Contracts.Contracts;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Services.Configure<LittleCheerfulOptions>(
    builder.Configuration.GetSection(LittleCheerfulOptions.SectionName));

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();

// Register internal services (singleton for stateful CLI access)
builder.Services.AddSingleton<IClaudeCliService, ClaudeCliService>();
builder.Services.AddSingleton<IFileStateService, FileStateService>();

// Register client services (scoped for request lifetime)
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<ITreeService, TreeService>();
builder.Services.AddScoped<IProfileService, ProfileService>();
builder.Services.AddScoped<IStudyMaterialsService, StudyMaterialsService>();

// Register background service
builder.Services.AddHostedService<BackgroundJobService>();

// CORS for MAUI client
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

app.Run();
