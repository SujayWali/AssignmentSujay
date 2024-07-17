export const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z][a-z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2') 
      .replace(/(\d)([A-Z])/g, '$1 $2') 
      .replace(/^./, (str) => str.toUpperCase()); 
  };
  