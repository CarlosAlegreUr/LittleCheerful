using LittleCheerful.Maui.Views;

namespace LittleCheerful.Maui;

public partial class AppShell : Shell
{
    public AppShell()
    {
        InitializeComponent();

        // Register routes for pages not in the TabBar
        Routing.RegisterRoute("onboarding", typeof(OnboardingPage));
        Routing.RegisterRoute("goalcreation", typeof(GoalCreationPage));
        Routing.RegisterRoute("session", typeof(SessionPage));
        Routing.RegisterRoute("surprise", typeof(SurpriseKeenanPage));
    }
}
