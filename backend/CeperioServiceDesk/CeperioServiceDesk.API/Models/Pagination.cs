namespace CeperioServiceDesk.API.Models;

public class Pagination<T>
{
    private const int MaxPageSize = 50;

    public IEnumerable<T> Items { get; set; } = [];
    public int TotalCount { get; set; }
    public int Page {  get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;

    public static int ValidatePageSize(int pageSize)
    {
        if (pageSize < 1) return 10;
        if (pageSize > MaxPageSize) return MaxPageSize;
        return pageSize;
    }

    public static int ValidatePage(int page)
    {
        return page < 1 ? 1 : page;
    }
}
