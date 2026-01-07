namespace LittleCheerful.Maui.Services;

/// <summary>
/// Provides type-safe navigation services for the application.
/// </summary>
public interface INavigationService
{
    /// <summary>
    /// Navigates to the specified route.
    /// </summary>
    /// <param name="route">The route to navigate to.</param>
    /// <param name="animate">Whether to animate the navigation.</param>
    Task NavigateToAsync(string route, bool animate = true);

    /// <summary>
    /// Navigates to the specified route with parameters.
    /// </summary>
    /// <param name="route">The route to navigate to.</param>
    /// <param name="parameters">Navigation parameters.</param>
    /// <param name="animate">Whether to animate the navigation.</param>
    Task NavigateToAsync(string route, IDictionary<string, object> parameters, bool animate = true);

    /// <summary>
    /// Navigates back to the previous page.
    /// </summary>
    /// <param name="animate">Whether to animate the navigation.</param>
    Task GoBackAsync(bool animate = true);

    /// <summary>
    /// Navigates to the root page.
    /// </summary>
    /// <param name="animate">Whether to animate the navigation.</param>
    Task GoToRootAsync(bool animate = true);
}
