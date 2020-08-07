import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import CreateOrGetCategoryService from '../services/CreateOrGetCategoryService';

interface Request {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}
class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    //Validate value and type
    if (isNaN(value)) {
      throw new AppError('Value must be a number', 400);
    }

    if (!["income", "outcome"].includes(type)) {
      throw new AppError('Type not valid', 400);
    }

    // Validate Category
    const createOrGetCategoryService = new CreateOrGetCategoryService();
    const new_category = await createOrGetCategoryService.execute({
      category
    });


    // Validate Balance
    const transactionRepository = getCustomRepository(TransactionRepository);

    if (type == "outcome") {
      const { total } = await transactionRepository.getBalance();

      if (value > total) {
        throw new AppError('Value do not be higher than total value', 400);
      }
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: new_category
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
