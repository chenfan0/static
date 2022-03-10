const Koa = require("koa");
const koaStatic = require("./index");

const app = new Koa();

app.use(
  koaStatic("./build/", {
    history: true,
    compress: true,
    maxage: {
      js: 10000,
    },
  })
);

app.listen(8080, () => {
  console.log("server in 8080");
});
