using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace HelloWorld.Controllers
{
    [Route("api/Account")]
    public class AccountController : ApiController
    {
        [AllowAnonymous]
        [Route("Register")]
        public async Task<IHttpActionResult> Register()
        {
            //if (!ModelState.IsValid)
            //{
            //    return BadRequest(ModelState);
            //}

            //IdentityResult result = await _repo.RegisterUser(userModel);

            //IHttpActionResult errorResult = GetErrorResult(result);

            //if (errorResult != null)
            //{
            //    return errorResult;
            //}

            return Ok();
        }
 
    }
}
