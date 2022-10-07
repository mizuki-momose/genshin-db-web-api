import Router from "koa-router";
import genshinDB, { Folder } from "genshin-db";
import { accessByBracket, checkOptions, checkBoolean } from "./functions";

const router = new Router();

router.get("/:folder/:query", (ctx, next) => {
  if (ctx.params.folder === undefined || ctx.params.query === undefined) {
    ctx.body = {
      status: "error",
      result: "Folder or Query not found",
    };
    next();
    return;
  }

  const prop: any = Object.keys(Folder).find((e) => e === ctx.params.folder);
  if (prop === undefined) {
    ctx.body = {
      status: "error",
      result: "Folder does not exist",
    };
    next();
    return;
  }

  const options = checkOptions(ctx.request.query);
  const func = accessByBracket(genshinDB, prop);
  const result = func(ctx.params.query, options);

  if (["characters", "enemies", "weapons"].includes(ctx.params.folder)) {
    if (ctx.request.query["stats"]) {
      const stats = Number(ctx.request.query["stats"]);
      if (0 < stats && stats < 91) {
        if (
          typeof ctx.request.query["ascend"] === "string" &&
          checkBoolean(ctx.request.query["ascend"])
        ) {
          result.stats = {
            status: "success",
            result: result.stats(stats, "+"),
          };
        } else {
          result.stats = {
            status: "success",
            result: result.stats(stats),
          };
        }
      } else {
        result.stats = {
          status: "error",
          result: "Not a number or out of range value",
        };
      }
    }
  }

  if (result) {
    ctx.body = {
      status: "success",
      result: result,
    };
  } else {
    ctx.body = {
      status: "empty",
      result: "Result is empty",
    };
  }

  next();
});

export { router };
