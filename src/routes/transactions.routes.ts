import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepo = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepo.find();
  const balance = await transactionRepo.getBalance();

  return response.json({transactions, balance})
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category} = request.body;

  const createTransactionService = new CreateTransactionService();

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category
  });

  delete transaction.category_id;
  delete transaction.created_at;
  delete transaction.updated_at;

  transaction.category = category;

  return response.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
