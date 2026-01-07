using LittleCheerful.Maui.ViewModels;

namespace LittleCheerful.Maui.Views;

public partial class HomePage : ContentPage
{
    public HomePage(HomeViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
