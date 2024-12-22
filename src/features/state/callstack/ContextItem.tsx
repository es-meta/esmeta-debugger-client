import React from "react";
import { Context } from "@/store/reducers/IrState";
import { twMerge } from "tailwind-merge";

type ContextItemProps = {
  data: Context;
  highlight: boolean;
  idx: number;
  onItemClick: (idx: number) => void;
};

export default class ContextItem extends React.Component<ContextItemProps> {
  getClassName(): string {
    const { highlight } = this.props;
    return twMerge(
      "border-y border-y-neutral-300",
      "even:bg-white odd:bg-neutral-50",
      "hover:bg-neutral-100 hover:scale-[0.98] active:scale-95 transition-all cursor-pointer",
      highlight && "even:bg-green-200 odd:bg-green-200 hover:bg-green-300",
    );
  }
  render() {
    const { data, idx, onItemClick } = this.props;
    const { name, steps } = data;
    // TODO beautify steps
    const content = steps.length === 0 ? name : `${steps} @ ${name}`;

    return (
      <tr className={this.getClassName()} onClick={() => onItemClick(idx)}>
        <th>{idx}</th>
        <th>{content}</th>
      </tr>
    );
  }
}
