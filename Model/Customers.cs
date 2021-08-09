using System;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Xml;
using System.Xml.Serialization;
using Microsoft.AspNetCore.Builder;

namespace ELinkx.Model
{
    public class Customers
    {
        public int LastId
        {
            get
            {
                return this.id;
            }
            set
            {
                this.id = value;
            }
        }

        protected Customer[] _customers = new Customer[]
        {
            
        };

        protected int id = 0;

        public Customer[] Customer
        {
            get
            {
                return this._customers;
            }
            set
            {
                this._customers = value;
            }
        }

        public int Increment()
        {
            return ++this.LastId;
        }

        public void Add(Customer customer)
        {
            customer.ID = Increment();
            if (Customer.Any(id=>id.ICO == customer.ICO))
            {
                throw new Exception("ico duplicated");
            }
            Customer = Customer.Select(i => i).Append(customer).ToArray();
        }

        public void Update(Customer customer)
        {
            var replaced = false;
            
            if (Customer.Any(id=>id.ICO == customer.ICO && id.ID != customer.ID))
            {
                throw new Exception("ICO duplicated");
            }
            
            Customer = Customer.Select(i =>
            {
                if (i.ID == customer.ID)
                {
                    replaced = true;
                    return customer;
                }

                return i;
            }).ToArray();
            if (!replaced)
            {
                throw new Exception("not replaced");
            }
        }

        public void Remove(int id)
        {
            var newCustomer = Customer.Where(i => id != i.ID).ToArray();
            if (newCustomer.Count() == Customer.Length)
            {
                throw new Exception();
            }

            Customer = newCustomer;
        }

        public void Save()
        {
            var serializer = new XmlSerializer(typeof(Customers));
            
            var path = "data/customers.xml";
            if (Directory.Exists("/data"))
            {
                path = "/" + path;
            }
            using var writer = new FileStream(path, FileMode.Truncate);
            serializer.Serialize(writer, this);
            
        }

        [XmlIgnoreAttribute] public static Mutex Mutex
        {
            get { return new Mutex(false, "Global\\Klicek"); }
        }

        public static Customers Load()
        {
            var serializer = new XmlSerializer(typeof(Customers));
            var path = "data/customers.xml";
            if (Directory.Exists("/data"))
            {
                path = "/" + path;
            }
            
            using var reader = new FileStream(path, FileMode.OpenOrCreate);

            try
            {
                return (Customers)serializer.Deserialize(reader);
            }
            catch
            {
                return new Customers();
            }
        }
    }
}

