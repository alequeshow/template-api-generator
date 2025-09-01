using MongoDB.Driver;
using System.Collections;
using System.Linq.Expressions;

namespace Template.DatabaseFactory.Mongo
{
    public class MongoRepository<T>(IMongoDatabase database, string collectionName) : IRepository<T, string>
        where T : IEntity<string>
    {
        private readonly IMongoCollection<T> _collection = database.GetCollection<T>(collectionName);

        Type IQueryable.ElementType => throw new NotImplementedException();

        Expression IQueryable.Expression => throw new NotImplementedException();

        IQueryProvider IQueryable.Provider => throw new NotImplementedException();

        T IRepository<T, string>.Add(T entity)
        {
            throw new NotImplementedException();
        }

        Task<T> IRepository<T, string>.AddAsync(T entity)
        {
            throw new NotImplementedException();
        }

        void IRepository<T, string>.AddMany(IEnumerable<T> entities)
        {
            throw new NotImplementedException();
        }

        Task IRepository<T, string>.AddManyAsync(IEnumerable<T> entities)
        {
            throw new NotImplementedException();
        }

        long IRepository<T, string>.Count(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        long IRepository<T, string>.CountAll()
        {
            throw new NotImplementedException();
        }

        Task<long> IRepository<T, string>.CountAllAsync()
        {
            throw new NotImplementedException();
        }

        Task<long> IRepository<T, string>.CountAsync(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        void IRepository<T, string>.Delete(string id)
        {
            throw new NotImplementedException();
        }

        void IRepository<T, string>.Delete(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        void IRepository<T, string>.DeleteAll()
        {
            throw new NotImplementedException();
        }

        Task IRepository<T, string>.DeleteAllAsync()
        {
            throw new NotImplementedException();
        }

        Task IRepository<T, string>.DeleteAsync(string id)
        {
            throw new NotImplementedException();
        }

        Task IRepository<T, string>.DeleteAsync(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        bool IRepository<T, string>.Exists(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        Task<bool> IRepository<T, string>.ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        T IRepository<T, string>.GetById(string id)
        {
            throw new NotImplementedException();
        }

        Task<T> IRepository<T, string>.GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        IEnumerator<T> IEnumerable<T>.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            throw new NotImplementedException();
        }

        IEnumerable<T> IRepository<T, string>.List(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<T>> IRepository<T, string>.ListAsync(Expression<Func<T, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        void IRepository<T, string>.RequestDone()
        {
            throw new NotImplementedException();
        }

        IDisposable IRepository<T, string>.RequestStart()
        {
            throw new NotImplementedException();
        }

        T IRepository<T, string>.Update(T entity)
        {
            throw new NotImplementedException();
        }

        Task<T> IRepository<T, string>.UpdateAsync(T entity)
        {
            throw new NotImplementedException();
        }

        long IRepository<T, string>.UpdateMany(IEnumerable<T> entities)
        {
            throw new NotImplementedException();
        }

        Task<long> IRepository<T, string>.UpdateManyAsync(IEnumerable<T> entities)
        {
            throw new NotImplementedException();
        }
    }
}