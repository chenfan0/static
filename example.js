const Koa = require("koa");
const koaStatic = require("./index");
const history = require("koa-history-api-fallback");

const app = new Koa();
app.use(history());
app.use(
  koaStatic("./dist/", {
    // compress: true,
    maxage: {
      js: 100000,
    },
  })
);

app.listen(8080, () => {
  console.log("server in 8080");
});
