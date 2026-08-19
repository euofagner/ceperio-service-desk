using Microsoft.AspNetCore.Mvc;
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
        var problemDetails = new ProblemDetails
        {
            Type = "https://httpstatuses.com/500",
            Title = "Erro interno do servidor",
            Status = StatusCodes.Status500InternalServerError,
            Detail = "Ocorreu um erro inesperado ao processar a requisição."
        };

        context.Response.StatusCode = problemDetails.Status.Value;
        context.Response.ContentType = "application/problem+json";

        await context.Response.WriteAsJsonAsync(problemDetails);
    }
}
