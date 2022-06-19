export const getFullTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

export const hexToInt = (hex) => parseInt(hex, 16);
