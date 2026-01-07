using LittleCheerful.Maui.ViewModels;

namespace LittleCheerful.Maui.Views;

public partial class OnboardingPage : ContentPage
{
    public OnboardingPage(OnboardingViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
