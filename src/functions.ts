import { QueryOptions } from "genshin-db";
import type { ParsedUrlQuery } from "querystring";

export const accessByBracket = <S, T extends keyof S>(obj: S, key: T) => {
  return obj[key];
};

export function checkBoolean(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.toLowerCase() === "true" || value === "1";
}

export const checkOptions = (query: ParsedUrlQuery): QueryOptions => {
  const checkArray = [
    { name: "dumpResult", type: "boolean" },
    { name: "matchNames", type: "boolean" },
    { name: "matchAliases", type: "boolean" },
    { name: "matchAliases", type: "boolean" },
    { name: "matchCategories", type: "boolean" },
    { name: "verboseCategoriess", type: "boolean" },
    { name: "queryLanguages", type: "Language[]" },
    { name: "resultLanguage", type: "Language" },
  ];

  const queryArr = (Object.keys(query) as (keyof ParsedUrlQuery)[]).map(
    (value) => ({ name: value, value: query[value] })
  );

  const options: any = {};

  queryArr.forEach((value) => {
    const target = checkArray.find((el) => el.name === value.name);
    if (target === undefined || typeof value.value !== "string") return;

    const val: string = value.value;
    const funcs = [
      { name: "boolean", func: () => checkBoolean(val) },
      { name: "Language", func: () => val },
      { name: "Language[]", func: () => val.split(",") },
    ];

    const func = funcs.find((el) => el.name === target.type);
    if (func !== undefined) options[value.name] = func.func();
  });

  return options;
};
