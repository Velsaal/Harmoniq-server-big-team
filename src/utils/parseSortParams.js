import { SORT_ORDER } from "../constants/index.js";


const parseSortOrder = (sortOrder) => {
  
   
  const order = sortOrder?.trim().toLowerCase();
  const result = order === 'asc' ? 1 : order === 'desc' ? -1 : -1;
  
   return result;
};

export const parseSortParams = (query) => {
 
  const parsedSortOrder = parseSortOrder(query.sortOrder);

  return {
    sortOrder: parsedSortOrder,
    sortBy: 'rate',
  };
};