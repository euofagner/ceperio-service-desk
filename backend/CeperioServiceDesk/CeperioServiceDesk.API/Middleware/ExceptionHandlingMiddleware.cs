using Microsoft.AspNetCore.Mvc;

namespace CeperioServiceDesk.API.Middleware;

public class ExceptionHandlingMiddleware(
    RequestDelegate next, 
    ILogger<ExceptionHandlingMiddleware> logger,
    IProblemDetailsService problemDetailsService)
{
    private readonly RequestDelegate _next = next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger = logger;
    private readonly IProblemDetailsService _problemDetailsService = problemDetailsService;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ArgumentException ex)
        {
            context.Response.StatusCode = StatusCodes.Status400BadRequest;

            await _problemDetailsService.WriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = new ProblemDetails
                {
                    Type = "https://httpstatuses.com/400",
                    Title = "Requisição inválida",
                    Status = StatusCodes.Status400BadRequest,
                    Detail = ex.Message
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(
                ex,
                "Erro não tratado durante a requisição {Method} {Path}",
                context.Request.Method,
                context.Request.Path
            );

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            await _problemDetailsService.WriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = new ProblemDetails
                {
                    Type = "https://httpstatuses.com/500",
                    Title = "Erro interno do servidor",
                    Status = StatusCodes.Status500InternalServerError,
                    Detail = "Ocorreu um erro inesperado ao processar a requisição."
                }
            });
        }
    }
}
