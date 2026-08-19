using System.Net;
using System.Text.Json;

namespace CeperioServiceDesk.API.Middleware;

public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger = logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro não tratado durante a requisição {Method} {Path}",
                context.Request.Method, context.Request.Path);

            await HandleExceptionAsync(context);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context)
    {
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        context.Response.ContentType = "application/problem+json";

        var problemDetails = new
        {
            type = "https://httpstatuses.com/500",
            title = "Erro interno do servidor",
            status = 500,
            detail = "Ocorreu um erro inesperado ao processar a requisição."
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }
}
