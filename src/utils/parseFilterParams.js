
const parseOwner = (ownerId) => {
  const isString = typeof ownerId === 'string';
  if (!isString) return;
 

  return ownerId;
};



export const parseFilterParams = (query) => {
  const { ownerId } = query;

  const parsedOwner = parseOwner(ownerId);
  
    return { ownerId: parsedOwner };
    
};
