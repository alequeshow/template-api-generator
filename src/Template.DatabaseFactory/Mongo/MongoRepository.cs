using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using System.Collections;
using System.Linq.Expressions;
using Template.Model;
using Template.Model.Interfaces;

namespace Template.DatabaseFactory.Mongo;

public class MongoRepository<T>(IMongoDatabase database, string collectionName) : IRepository<T, string>
    where T : EntityModel
{
    private readonly IMongoCollection<T> _collection = database.GetCollection<T>(collectionName);

    public Type ElementType => _collection.AsQueryable<T>().ElementType;

    public Expression Expression => _collection.AsQueryable<T>().Expression;

    public IQueryProvider Provider => _collection.AsQueryable<T>().Provider;

    public T Add(T entity)
    {
        _collection.InsertOne(entity);

        return entity;
    }

    public async Task<T> AddAsync(T entity)
    {
        await _collection.InsertOneAsync(entity).ConfigureAwait(false);

        return entity;
    }

    public void AddMany(IEnumerable<T> entities)
    {
        _collection.InsertMany(entities);
    }

    public async Task AddManyAsync(IEnumerable<T> entities)
    {
        await _collection.InsertManyAsync(entities).ConfigureAwait(false);
    }

    public long Count(Expression<Func<T, bool>> predicate)
    {
        return _collection.CountDocuments(predicate);
    }

    public long CountAll()
    {
        return _collection.CountDocuments(null);
    }

    public async Task<long> CountAllAsync()
    {
        return await _collection.CountDocumentsAsync(null).ConfigureAwait(false);
    }

    public async Task<long> CountAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.CountDocumentsAsync(predicate).ConfigureAwait(false);
    }

    public void Delete(string id)
    {
        _collection.DeleteOne(e => e.Id == id);
    }

    public void Delete(Expression<Func<T, bool>> predicate)
    {
        _collection.DeleteMany(predicate);
    }

    public void DeleteAll()
    {
        _collection.DeleteMany(_ => true);
    }

    public async Task DeleteAllAsync()
    {
        await _collection.DeleteManyAsync(_ => true);
    }

    public async Task DeleteAsync(string id)
    {
        await _collection.DeleteOneAsync(e => e.Id == id);
    }

    public async Task DeleteAsync(Expression<Func<T, bool>> predicate)
    {
        await _collection.DeleteManyAsync(predicate);
    }

    public bool Exists(Expression<Func<T, bool>> predicate)
    {
        return _collection.AsQueryable().Any(predicate);
    }

    public async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.AsQueryable().AnyAsync(predicate);
    }

    public T GetById(string id)
    {
        return _collection.AsQueryable().FirstOrDefault(e => e.Id == id)!;
    }

    public async Task<T> GetByIdAsync(string id)
    {
        return await _collection.AsQueryable().FirstOrDefaultAsync(e => e.Id == id)!;
    }

    public IEnumerator<T> GetEnumerator()
    {
        return _collection.AsQueryable<T>().GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return _collection.AsQueryable<T>().GetEnumerator();
    }

    public IEnumerable<T> List(Expression<Func<T, bool>> predicate)
    {
        return [.. _collection.AsQueryable().Where(predicate)];
    }

    public async Task<IEnumerable<T>> ListAsync(Expression<Func<T, bool>> predicate)
    {
        return await _collection.AsQueryable().Where(predicate).ToListAsync().ConfigureAwait(false);
    }

    void IRepository<T, string>.RequestDone()
    {
        throw new NotImplementedException();
    }

    IDisposable IRepository<T, string>.RequestStart()
    {
        throw new NotImplementedException();
    }

    public T Update(T entity)
    {
        _collection.ReplaceOne(Builders<T>.Filter.Eq("_id", new ObjectId(entity.Id as string)), entity);

        return entity;
    }

    public async Task<T> UpdateAsync(T entity)
    {
        await _collection.ReplaceOneAsync(Builders<T>.Filter.Eq("_id", new ObjectId(entity.Id as string)), entity).ConfigureAwait(false);

        return entity;
    }

    public long UpdateMany(IEnumerable<T> entities)
    {
        foreach (var item in entities)
        {
            Update(item);
        }

        return entities.Count();
    }

    public async Task<long> UpdateManyAsync(IEnumerable<T> entities)
    {
        var tasks = entities.Select(UpdateAsync);

        await Task.WhenAll(tasks).ConfigureAwait(false);
        
        return entities.Count();
    }
}