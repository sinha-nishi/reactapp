import { RuleRegistry } from "@/core/runtime/RuleRegistry";
import type { Theme } from "../../@types";
import { util } from "./helper";

export function register(reg: RuleRegistry, theme: Theme) {
  //   reg.addPrefix("p-" /* UtilityRule */, "");
  //   reg.addExact("grid" /* UtilityRule */, "");

  const { propScale } = util(reg, theme);

  // padding
  propScale("p-", ["padding"]);
  propScale("px-", ["padding-left", "padding-right"]);
  propScale("py-", ["padding-top", "padding-bottom"]);
  propScale("pt-", "padding-top");
  propScale("pr-", "padding-right");
  propScale("pb-", "padding-bottom");
  propScale("pl-", "padding-left");

  // margin
  propScale("m-", ["margin"]);
  propScale("mx-", ["margin-left", "margin-right"]);
  propScale("my-", ["margin-top", "margin-bottom"]);
  propScale("mt-", "margin-top");
  propScale("mr-", "margin-right");
  propScale("mb-", "margin-bottom");
  propScale("ml-", "margin-left");
}
