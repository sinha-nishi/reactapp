import * as React from "react";

export function GridLayout() {
    return (
        <div className="grid grid-cols-3 gap-4 p-4">
            <div className="bg-blue-500 text-white p-4">Item 1</div>
            <div className="bg-green-500 text-white p-4">Item 2</div>
            <div className="bg-red-500 text-white p-4">Item 3</div>
            <div className="bg-yellow-500 text-white p-4">Item 4</div>
            <div className="bg-purple-500 text-white p-4">Item 5</div>
            <div className="bg-pink-500 text-white p-4">Item 6</div>
        </div>
    );
}