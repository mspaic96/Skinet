using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/basket")]
    public class BasketControler 
    {   private readonly IBasketRepository  _basketRepository;
        public BasketControler(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }
      [HttpGet]

        public async Task<ActionResult<CustomerBasket>> GetBasketById(string id)
        {
            var basket = await _basketRepository.GetBasketAsync(id);

            if(basket == null) return new CustomerBasket(id);
            else return basket;
        }
        [HttpPost]

        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            var updatedBasket = await _basketRepository.UpdateBasketAsync(basket);

           return  updatedBasket;

        }
        [HttpDelete]
        public async Task DeleteBasket(string id)
        {
            await _basketRepository.DeleteBasketAsync(id);
        }


    }
}