using Microsoft.UI.Xaml;

namespace LittleCheerful.Maui.WinUI;

public partial class App : MauiWinUIApplication
{
    public App()
    {
        this.InitializeComponent();
    }

    protected override MauiApp CreateMauiApp() => LittleCheerful.Maui.MauiProgram.CreateMauiApp();
}
