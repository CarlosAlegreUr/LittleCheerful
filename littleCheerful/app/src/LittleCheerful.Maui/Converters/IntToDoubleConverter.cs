#nullable enable

using System.Globalization;

namespace LittleCheerful.Maui.Converters;

/// <summary>
/// Converts an integer value to a double (0-1 range for progress bars).
/// </summary>
public class IntToDoubleConverter : IValueConverter
{
    public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is int intValue)
        {
            // Convert percentage (0-100) to double (0-1)
            return intValue / 100.0;
        }
        return 0.0;
    }

    public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        if (value is double doubleValue)
        {
            return (int)(doubleValue * 100);
        }
        return 0;
    }
}
