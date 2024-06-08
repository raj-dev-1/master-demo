import { pagination } from "../config/variables";
import { Op } from "sequelize";

interface PageQuery {
  page?: string;
  limit?: string;
}

interface PaginationResult {
  skip: number;
  limit: number;
  pageCount: number;
  limitDoc: number;
  maxPage: number;
}

export const getPaginationParams = async (
  model: any,
  whereCondition: any,
  { page, limit }: PageQuery
): Promise<PaginationResult> => {
  const pageCount = parseInt(page, 10) || pagination.pageCount;
  const limitDoc = parseInt(limit, 10) || pagination.limitDoc;

  const totalItems = await model.count({ where: whereCondition });
  const maxPage = totalItems <= limitDoc ? 1 : Math.ceil(totalItems / limitDoc);

  const skip = (pageCount - 1) * limitDoc;

  return { skip, limit: limitDoc, pageCount, limitDoc, maxPage };
};

interface SearchQuery {
  search?: string;
}

export const getSearchResults = async (
  model: any,
  searchFields: string[],
  whereCondition: any,
  { search }: SearchQuery
) => {
  if (search && search.trim()) {
    whereCondition[Op.or] = searchFields.map((field) => ({
      [field]: {
        [Op.like]: `%${search}%`,
      },
    }));
  }

  const searchResults = await model.findAll({
    where: whereCondition,
    attributes: {
      exclude: ["password"],
    },
  });

  return searchResults;
};
