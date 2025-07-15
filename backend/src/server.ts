import app from "./app";
import { env } from "./env/index";

app.listen(env.PORT , () => {
  console.log("servidor rodando");
});
