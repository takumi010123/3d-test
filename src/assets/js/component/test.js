const test = () => {
  console.log('hello');
  const others = 'success!'
  // polyfillが必要
  new Promise((resolve, rejects) => {
    setTimeout(() => {
      resolve(others);
    }, 2000);
  }).then((data) => {
    console.log(data);
  });
};

export { test };
