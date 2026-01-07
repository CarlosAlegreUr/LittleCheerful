using CommunityToolkit.Maui;
using LittleCheerful.Maui.Services;
using LittleCheerful.Maui.ViewModels;
using LittleCheerful.Maui.Views;
using Microsoft.Extensions.Logging;

namespace LittleCheerful.Maui;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .UseMauiCommunityToolkit()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
            });

        // Register Services
        builder.Services.AddSingleton(new ApiClient("https://localhost:5001"));
        builder.Services.AddSingleton<INavigationService, NavigationService>();

        // Register ViewModels
        builder.Services.AddTransient<HomeViewModel>();
        builder.Services.AddTransient<OnboardingViewModel>();
        builder.Services.AddTransient<GoalCreationViewModel>();
        builder.Services.AddTransient<TreeViewModel>();
        builder.Services.AddTransient<SessionViewModel>();
        builder.Services.AddTransient<MaterialsViewModel>();
        builder.Services.AddTransient<SettingsViewModel>();

        // Register Views
        builder.Services.AddTransient<HomePage>();
        builder.Services.AddTransient<OnboardingPage>();
        builder.Services.AddTransient<GoalCreationPage>();
        builder.Services.AddTransient<TreePage>();
        builder.Services.AddTransient<SessionPage>();
        builder.Services.AddTransient<MaterialsPage>();
        builder.Services.AddTransient<SettingsPage>();
        builder.Services.AddTransient<SurpriseKeenanPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif

        return builder.Build();
    }
}
