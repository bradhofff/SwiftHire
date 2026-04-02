namespace SwiftHireApi.Services.Interfaces;

public interface IResumeStorageService
{
    /// <summary>
    /// Saves the uploaded PDF to wwwroot/uploads/resumes/{userId}.pdf,
    /// extracts its text content, and returns the extracted text.
    /// </summary>
    Task<(string filePath, string extractedText)> SaveAndExtractAsync(int userId, Stream pdfStream, string fileName);

    /// <summary>
    /// Deletes the stored resume file for the given user, if it exists.
    /// </summary>
    Task DeleteAsync(int userId);
}
