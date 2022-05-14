using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;


namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUserAsync(UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var user = new AppUser()
                {
                    UserName = "AhmedHAfez",
                    DisplayName = "Ahmed HAfez",
                    Email = "ahmed.abdelghany.hafez@gmail.com",
                    Address = new Address()
                    {
                        FirstName = "Ahmed",
                        LastName = "Hafez",
                        Street = "78 Alo St",
                        City = "Giza",
                        State = "GZ",
                        ZipCode = "843"
                    }
                };

                await userManager.CreateAsync(user, "P@$$w0rd");
            }

        }
    }
}
