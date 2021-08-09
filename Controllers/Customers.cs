using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using ELinkx.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ELinkx.Customer
{
    [ApiController]
    [Route("[controller]")]
    public class Customers : Controller
    {
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Model.Customer[]))]
        public IActionResult Get()
        {
            var customers = Model.Customers.Load().Customer;
            /*
            if (id != null)
            {
                var r = customers.Where(i => i.ID == id);
                if (!r.Any())
                {
                    return NotFound();
                }

                return Ok(r.First());
            }
*/
            return Ok(customers);
        }


        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Model.Customer[]))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Route("{id:int}")]
        public IActionResult GetOne(int id)
        {
            var customers = Model.Customers.Load().Customer;

            var r = customers.Where(i => i.ID == id);
            if (!r.Any())
            {
                return NotFound();
            }

            return Ok(r.First());
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Model.Customer))]
        [ProducesResponseType(StatusCodes.Status409Conflict, Type=typeof(GlobalError))]
        public IActionResult Create([FromBody] Model.Customer customer)
        {
            var customers = Model.Customers.Load();
            try
            {
                using var mutex = Model.Customers.Mutex;
                mutex.WaitOne(10000);
                customers.Add(customer);
                customers.Save();
                return Ok(customer);
            }
            catch( Exception ex)
            {
                Response.StatusCode = StatusCodes.Status409Conflict;
                return new JsonResult(new GlobalError(ex.Message));
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Model.Customer))]
        [ProducesResponseType(StatusCodes.Status404NotFound, Type=typeof(Model.GlobalError))]
        public IActionResult Update([FromBody] Model.Customer customer)
        {
            var customers = Model.Customers.Load();
            try
            {
                using var mutex = Model.Customers.Mutex;
                mutex.WaitOne(10000);
                customers.Update(customer);
                customers.Save();
                return Ok(customer);
            }
            catch( Exception ex)
            {
                Response.StatusCode = StatusCodes.Status404NotFound;
                return new JsonResult(new GlobalError(ex.Message));

            }
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Model.Customer[]))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Route("{id:int}")]
        public IActionResult Delete(int id)
        {
            var customers = Model.Customers.Load();
            try
            {
                using var mutex = Model.Customers.Mutex;
                mutex.WaitOne(10000);
                customers.Remove(id);
                customers.Save();

                return Ok(customers.Customer);
            }
            catch( Exception ex)
            {
                Response.StatusCode = StatusCodes.Status400BadRequest;
                return new JsonResult(new GlobalError(ex.Message));
                
            }
        }
    }
}