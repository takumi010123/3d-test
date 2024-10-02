const req = require.context('../pages/', true, /\.pug/);
req.keys().forEach((fileName) => {
  req(fileName);
});
