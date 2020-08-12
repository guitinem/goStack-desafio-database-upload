import csvParse from 'csv-parse';
import fs from 'fs';
import { getRepository, In, getCustomRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  path: string
}

interface CsvTransaction {
  title: string;
  type: 'outcome' | 'income';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ path }: Request): Promise<Transaction[]> {
    const categoriesRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const readCSVStream = fs.createReadStream(path);

    const parseStream = csvParse({
      from_line: 2,
    });

    const parseCsv = readCSVStream.pipe(parseStream);

    const categories: string[] = [];
    const transactions: CsvTransaction[] = [];

    parseCsv.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) {
        return;
      }

      categories.push(category);
      transactions.push({
        title,
        type,
        value,
        category
      });
    });

    await new Promise(resolve => parseCsv.on('end', resolve));

    // Check categories
    const existenceCategories = await categoriesRepository.find({
      where: {
        title: In(categories)
      }
    });

    const existenceCategoriesName = existenceCategories.map((category: Category) =>
      category.title,
    );

    // Get Difference
    const addCategories = categories
      .filter(category_name => !existenceCategoriesName.includes(category_name))
      .filter((value, index, self) => self.indexOf(value) == index);

    const newCategories = categoriesRepository.create(
      addCategories.map(title => ({
        title
      })),
    )

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existenceCategories];

    const newTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title == transaction.category,
        ),
      })),
    );

    await transactionRepository.save(newTransactions);

    await fs.promises.unlink(path);

    return newTransactions;
  }
}

export default ImportTransactionsService;
