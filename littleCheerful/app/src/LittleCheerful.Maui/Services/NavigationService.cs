namespace LittleCheerful.Maui.Services;

/// <summary>
/// Shell-based navigation service implementation.
/// </summary>
public sealed class NavigationService : INavigationService
{
    /// <inheritdoc />
    public async Task NavigateToAsync(string route, bool animate = true)
    {
        await Shell.Current.GoToAsync(route, animate);
    }

    /// <inheritdoc />
    public async Task NavigateToAsync(string route, IDictionary<string, object> parameters, bool animate = true)
    {
        await Shell.Current.GoToAsync(route, animate, parameters);
    }

    /// <inheritdoc />
    public async Task GoBackAsync(bool animate = true)
    {
        await Shell.Current.GoToAsync("..", animate);
    }

    /// <inheritdoc />
    public async Task GoToRootAsync(bool animate = true)
    {
        await Shell.Current.GoToAsync("//home", animate);
    }
}
