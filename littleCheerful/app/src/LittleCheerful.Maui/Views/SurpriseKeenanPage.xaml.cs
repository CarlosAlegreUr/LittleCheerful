namespace LittleCheerful.Maui.Views;

public partial class SurpriseKeenanPage : ContentPage
{
    public SurpriseKeenanPage()
    {
        InitializeComponent();
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();

        // Wait 3 seconds then navigate to onboarding
        await Task.Delay(3000);
        await Shell.Current.GoToAsync("onboarding");
    }
}
