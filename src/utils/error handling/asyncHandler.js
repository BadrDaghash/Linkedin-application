export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if(Object.keys(error)==0){
        return next(new Error(error.message))
      }
      return next(error)
    });
  };
};
