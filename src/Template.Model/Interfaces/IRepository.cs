using System.Linq.Expressions;

namespace Template.Model.Interfaces;

public interface IRepository<T, TKey> : IQueryable<T>
        where T : IEntity<TKey>
{
    T GetById(TKey id);

    IEnumerable<T> List(Expression<Func<T, bool>> predicate);

    Task<IEnumerable<T>> ListAsync(Expression<Func<T, bool>> predicate);

    Task<T> GetByIdAsync(TKey id);

    T Add(T entity);

    Task<T> AddAsync(T entity);

    void AddMany(IEnumerable<T> entities);

    Task AddManyAsync(IEnumerable<T> entities);

    T Update(T entity);

    Task<T> UpdateAsync(T entity);

    long UpdateMany(IEnumerable<T> entities);

    Task<long> UpdateManyAsync(IEnumerable<T> entities);

    void Delete(TKey id);

    Task DeleteAsync(TKey id);

    void Delete(Expression<Func<T, bool>> predicate);

    Task DeleteAsync(Expression<Func<T, bool>> predicate);

    void DeleteAll();

    Task DeleteAllAsync();

    long CountAll();

    Task<long> CountAllAsync();

    long Count(Expression<Func<T, bool>> predicate);

    Task<long> CountAsync(Expression<Func<T, bool>> predicate);

    bool Exists(Expression<Func<T, bool>> predicate);

    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);

    IDisposable RequestStart();

    void RequestDone();
}