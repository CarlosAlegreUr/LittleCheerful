using LittleCheerful.Maui.ViewModels;

namespace LittleCheerful.Maui.Views;

public partial class TreePage : ContentPage
{
    public TreePage(TreeViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
