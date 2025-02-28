export const generateEmployeeRanges = (maxlimit = 100000) => {
  const ranges = [];
  let start = 1;
  let step = 10;

  while (start < maxlimit) {
    let end = start + step - 1;
    if (end >= maxlimit) {
      ranges.push(`${start}+`);
      break;
    }
    ranges.push(`${start}-${end}`);
    
    start = end + 1;
    if (start >= 101) step = 50;
    if (start >= 501) step = 500;
    if (start >= 5001) step = 5000;
  }

  return ranges;
};

export const numberOfEmployees = generateEmployeeRanges();
