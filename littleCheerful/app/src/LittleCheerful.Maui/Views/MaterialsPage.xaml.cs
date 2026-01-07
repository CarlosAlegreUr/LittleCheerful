using LittleCheerful.Maui.ViewModels;

namespace LittleCheerful.Maui.Views;

public partial class MaterialsPage : ContentPage
{
    public MaterialsPage(MaterialsViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }
}
