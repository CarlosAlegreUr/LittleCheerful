using LittleCheerful.Maui.ViewModels;

namespace LittleCheerful.Maui.Views;

public partial class GoalCreationPage : ContentPage
{
    public GoalCreationPage(GoalCreationViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
