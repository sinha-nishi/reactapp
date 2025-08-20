export interface StackView {

}

export interface GridView {
    columns: number;
    rows: number;
}

export interface View {
    id: string;
    layout: "stack" | "grid" | "list";
    view?: React.ReactNode; // if view property is present, render it inside a default view, all the logic is expected to be present inside view value
    stack?: StackView;
    grid?: GridView;
}