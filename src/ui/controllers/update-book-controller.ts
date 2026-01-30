import { Request, Response } from 'express';
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from '../../config/constants';
import { BookModelMongoose as Book } from '../../infrastructure/models/book.model';

interface UpdateBookBody {
  title?: string; // El ? significa opcional
  description?: string;
  price?: number;
  author?: string;
}

export const updateBookController = async (request: Request, response: Response) => {
  try {
    const { bookId } = request.params;
    const { title, description, price, author } = request.body;

    // Construir un objeto solo con los campos que vienen en la petición
    // Partial<UpdateBookBody> significa que puede tener algunos o ninguno de los campos
    const updateData: Partial<UpdateBookBody> = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (author) updateData.author = author;

    // Actualizar el libro en la BD y devolver el libro actualizado (new: true)
    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
      new: true,
    });

    if (!updatedBook) {
      response.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.BOOK_NOT_FOUND });
      return;
    }

    response.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.BOOK_UPDATED,
      item: updatedBook,
    });
  } catch (error) {
    response
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  }
};
