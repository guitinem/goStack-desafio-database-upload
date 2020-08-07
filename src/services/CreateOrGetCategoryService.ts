import AppError from '../errors/AppError';
import { getRepository, EntityRepository } from 'typeorm';

import Category from '../models/Category';

interface Request {
  category: string;
}

class CreateOrGetCategoryService {
  public async execute({ category }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const foundCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    if (!foundCategory) {
      const new_category = categoryRepository.create({
        title: category
      });

      await categoryRepository.save(new_category);

      return new_category;
    }

    return foundCategory;

  }

}

export default CreateOrGetCategoryService;
