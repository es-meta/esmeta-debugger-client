import { type PropsWithChildren, useState, useRef } from "react";

const UNIT = 8; // Define the height of one unit in rem.

export default function Card({ children }: PropsWithChildren) {
  const [height] = useState(8); // Initial height in units.
  const cardRef = useRef<HTMLDivElement | null>(null); // Ref for the card.

  // Handler for dragging.
  // const handleDrag = (event: React.MouseEvent<HTMLDivElement>) => {
  //   if (cardRef.current) {
  //     const cardTop = cardRef.current.getBoundingClientRect().top;
  //     const newHeightInPx = event.clientY - cardTop; // Calculate new height.
  //     const newHeightInUnits = Math.max(1, Math.round(newHeightInPx / (UNIT * 16))); // Convert px to unit (1rem = 16px).
  //     setHeight(newHeightInUnits); // Update the height state.
  //   }
  // };

  // // Prevent text selection while dragging.
  // const handleDragStart = () => {
  //   document.body.style.userSelect = "none";
  //   document.addEventListener("mouseup", handleDragEnd);
  //   document.addEventListener("mousemove", handleDrag);
  // };

  // const handleDragEnd = () => {
  //   document.body.style.userSelect = "auto";
  //   document.removeEventListener("mouseup", handleDragEnd);
  //   document.removeEventListener("mousemove", handleDrag);
  // };

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl border border-neutral-300 flex flex-col overflow-hidden relative"
      style={{ height: `${height * UNIT}rem` }}
    >
      {children}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 cursor-row-resize bg-neutral-200"
        // onMouseDown={handleDragStart}
      />
    </div>
  );
}