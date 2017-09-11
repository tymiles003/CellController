using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CellController.Web.Startup))]
namespace CellController.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
