using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;

#nullable disable

namespace API.Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.ProductType, o => o.MapFrom(p => p.ProductType.Name))
                .ForMember(d => d.ProductBrand, o => o.MapFrom(o => o.ProductBrand.Name))
                .ForMember(d => d.PictureUrl, o => o.MapFrom<ProductUrlResolver>());

            CreateMap<Address, AddressDto>().ReverseMap();

            CreateMap<CustomerBasketDto, CustomerBasket>();
            CreateMap<BasketItemDto, BasketItem>();
        }
    }
}
