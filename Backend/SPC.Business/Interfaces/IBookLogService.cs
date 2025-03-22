using SPC.Data.Models;
namespace SPC.Business.Interfaces;

public interface IBookLogService
{
  Task<BaseMessage<BookLog>> GetList();
  Task<BaseMessage<BookLog>> AddBookLog(BookLog bookLog);
  Task<BaseMessage<BookLog>> FindById(int id);
  Task<BaseMessage<BookLog>> UpdateBookLog(BookLog bookLog);
  Task<BaseMessage<BookLog>> DeleteBookLog(BookLog bookLog);
  Task<BaseMessage<BookLog>> DeleteBookLogId(int id);
}