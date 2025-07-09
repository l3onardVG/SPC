using SPC.Data.Models;
using SPC.Business.Dtos;

namespace SPC.Business.Interfaces;

public interface IBookLogService
{
  Task<BaseMessage<BookLog>> GetList();
  Task<BaseMessage<BookLog>> AddBookLog(BookLog bookLog);
  Task<BaseMessage<BookLog>> FindById(int id);
  Task<BaseMessage<BookLog>> UpdateBookLog(BookLog bookLog);
  Task<BaseMessage<BookLog>> DeleteBookLog(BookLog bookLog);
  Task<BaseMessage<BookLog>> DeleteBookLogId(int id);
  Task<BaseMessage<BookLog>> GetRatingsForBook(int bookId);
  Task UpdateBookRating(int bookId);
  Task<BaseMessage<BookLog>> RateBook(int bookId, string userId, BookRatingDto ratingDto);
}