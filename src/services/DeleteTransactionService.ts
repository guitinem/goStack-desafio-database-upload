import { isUuid } from 'uuidv4';
import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';

import TransactionRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}
class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // Validate id
    if(!isUuid(id)){
      throw new AppError('Id not valid', 400);
    }

    const transactionRepository = getCustomRepository(TransactionRepository);

    const transactionToDelete = await transactionRepository.findOne({
      id
    });

    if(!transactionToDelete) {
      throw new AppError('Transaction not found', 404);
    }

    await transactionRepository.remove(transactionToDelete);
  }
}

export default DeleteTransactionService;
