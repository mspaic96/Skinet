using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Infrastructure.Data;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using API.Dtos;
using System.Linq;
using AutoMapper;
using API.Errors;
using Microsoft.AspNetCore.Http;
using API.Helpers;

namespace API.Controllers
{
    
    public class ProductsController : BaseApiController
    {

        private readonly IGenericRepository<Product> productsRepo;
        private readonly IGenericRepository<ProductBrand> productBrandsRepo;
        private readonly IGenericRepository<ProductType> productTypesRepo;
        private readonly IMapper mapper;

        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductBrand> productBrandsRepo,
        IGenericRepository<ProductType> productTypesRepo, IMapper mapper)
        {
            this.mapper = mapper;
            this.productTypesRepo = productTypesRepo;
            this.productBrandsRepo = productBrandsRepo;
            this.productsRepo = productsRepo;



        }
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {

            return Ok(await productBrandsRepo.ListAllSync());

        }
        
       

        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductType()
        {

            var types = await productTypesRepo.ListAllSync();
            return Ok(types);
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductToReturnDto>>> GetProducts(
         [FromQuery] ProductSpecParams productParams)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);

            var countSpec = new ProductWithFiltersForCountSpecification(productParams);

            var totalItems =await productsRepo.CountAsync(countSpec);

            var products = await productsRepo.ListAll(spec);
             var data = mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductToReturnDto>>(products);

             return Ok(new Pagination<ProductToReturnDto>(productParams.PageIndex,productParams.PageSize,totalItems,data));

        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse),StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductToReturnDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);


            var product = await productsRepo.GetEntityWithSpec(spec);

            if(product == null)  return NotFound(new ApiResponse(404));

            return mapper.Map<Product,ProductToReturnDto>(product);


        }


    }
}