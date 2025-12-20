import { CssBuilder, BuilderPlugin } from "../../core/builder";
import type { BuilderOptions } from "../../@types/styleOptions";
import { buttonStyles } from "./button";
import { cardStyles } from "./card";
import { inputStyles } from "./input";
import { badgeStyles } from "./badge";
import { alertStyles } from "./alert";

export const componentsPlugin =
  (opts: BuilderOptions = {}): BuilderPlugin =>
  (b: CssBuilder) => {
    const { theme } = b.ctx;
    const focusRing = opts?.a11y?.focusRing ?? true;

    opts.components?.alert === true &&
      alertStyles(
        b,
        opts.components?.alert === true
          ? { focusRing }
          : opts.components?.alert || {},
      );
    opts.components?.badge === true &&
      badgeStyles(
        b,
        opts.components?.badge === true
          ? { focusRing }
          : opts.components?.badge || {},
      );
    opts.components?.button === true &&
      buttonStyles(
        b,
        opts.components?.button === true
          ? { focusRing }
          : opts.components?.button || {},
      );
    opts.components?.card === true &&
      cardStyles(
        b,
        opts.components?.card === true
          ? { focusRing }
          : opts.components?.card || {},
      );
    opts.components?.input === true &&
      inputStyles(
        b,
        opts.components?.input === true
          ? { focusRing }
          : opts.components?.input || {},
      );

    return b;
  };
