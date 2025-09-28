import * as React from "react";
import { View } from "@/@types/View";
import { DefaultComponentView } from "@/views/DefaultComponentView";

export function routes(views: View[], context: string = "/", home: string = "home") {
    const components = views
      .map((view) => {
        function ViewComponent() {
          return (
            <div key={view.id}>
              {view.view ? (
                <DefaultComponentView view={view}>
                  {view.view}
                </DefaultComponentView>
              ) : null}
            </div>
          );
        }

        return {
          [context + view.id]: ViewComponent,
        };
      })
      .reduce((acc, curr) => ({ ...acc, ...curr }), {});

    if (home) {
      components[context] = components[context + home];
    }
    return components;
  }