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
  page?: string;
  limit?: string;
}

export const getSearchResults = async (
  model: any,
  searchFields: string[],
  whereCondition: any,
  { search, page, limit }: SearchQuery
) => {
  // Initialize pagination variables
  const currentPage = parseInt(page) || 1;
  const perPage = parseInt(limit) || pagination.limitDoc;
  const offset = (currentPage - 1) * perPage;

  // Initialize search condition
  let searchCondition = {};

  // If search query is provided, construct search condition
  if (search && search.trim()) {
    searchCondition = {
      [Op.or]: searchFields.map((field) => ({
        [field]: {
          [Op.like]: `%${search}%`,
        },
      })),
    };
  }

  // Fetch search results with pagination
  const searchResults = await model.findAndCountAll({
    where: {
      [Op.and]: [whereCondition, searchCondition],
    },
    attributes: {
      exclude: ["password"],
    },
    offset,
    limit: perPage,
  });

  const totalPages = Math.ceil(searchResults.count / perPage);

  return {
    results: searchResults.rows,
    totalCount: searchResults.count,
    totalPages,
    currentPage,
  };
};

