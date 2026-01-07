using LittleCheerful.Maui.ViewModels;

namespace LittleCheerful.Maui.Views;

public partial class SessionPage : ContentPage
{
    public SessionPage(SessionViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
