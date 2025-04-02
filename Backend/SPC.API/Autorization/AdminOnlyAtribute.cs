

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace SPC.API.Controllers;

public class AdminOrReadOnlyAttribute : AuthorizeAttribute, IAuthorizationFilter
{
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;

        // Check if the user is authenticated
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedResult(); // 401 Unauthorized
            return;
        }

        // Get the HTTP method (POST or DELETE require Admin role)
        var httpMethod = context.HttpContext.Request.Method;
        bool isRestrictedMethod = httpMethod == HttpMethods.Post || httpMethod == HttpMethods.Delete;

        bool isAdmin = user.IsInRole("Admin");

        if (isRestrictedMethod && !isAdmin)
        {
            context.Result = new ForbidResult(); // 403 Forbidden
        }
    }
}