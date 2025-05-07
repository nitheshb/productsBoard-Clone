
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { TableItem, Feature } from "@/app/types";

interface DraggableFeatureProps {
  feature: TableItem;
  index: number;
  onClick: (feature: TableItem) => void;
}

export const DraggableFeature: React.FC<DraggableFeatureProps> = ({
  feature,
  index,
  onClick,
}) => {

  const featureData = feature.data as Feature;
  const originalComponentId = featureData.component_id || "";
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `feature-${feature.id}`,
    data: {
      type: "feature", // Always set the type to feature for clarity
      feature: feature,
      originalComponentId: originalComponentId,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}

      data-feature-id={feature.id} // Add data attribute for debugging
      data-component-id={originalComponentId}
      className={`flex py-2 px-1 items-center bg-[#fff] border-b-[0.5px] border-dashed border-[rgb(212,219,225)] ${
        isDragging ? "shadow-lg bg-blue-50 opacity-70 z-10" : ""
      }`}
    >
      <div
        className="w-[563px] min-w-[433px] max-w-[433px] flex items-center gap-2"
        style={{ paddingLeft: `${16 + feature.level * 16}px` }}
      >
        <div className="flex items-center gap-2 cursor-pointer w-full">
          <div
            className="flex items-center gap-2 cursor-move w-full text-gray-500 text-[14px]"
            onClick={(e) => {
              e.stopPropagation();
              onClick(feature);
            }}
          >
            <span {...listeners} className="cursor-grab">
              <GripVertical size={16} className="text-gray-400" />
            </span>
            
            <div
              className={`${
                feature.data.status === "Completed" && "text-[#79ce17]"
              } ${feature.data.status === "In Progress" && "text-[#ffc600]"} ${
                feature.data.status === "Todo" && ""
              } ${
                feature.data.status === "Todo" &&
                new Date(feature.data.completedOn ?? new Date().toISOString()) >
                  new Date(feature.data.startDate ?? new Date().toISOString()) &&
                "text-[#ff4747]"
              }`}
            >
              <svg
                height="16px"
                width="16px"
                viewBox="0 0 16 16"
                role="img"
                aria-label="TaskFilledIcon"
              >
                <path
                  fill="currentColor"
                  d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"
                ></path>
              </svg>
            </div>

            <span
              className="cursor-pointer hover:text-blue-600 border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%] w-[100%] whitespace-nowrap overflow-hidden text-ellipsis"
            >
              {feature.name}
            </span>
          </div>
        </div>
      </div>

      <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
        {feature?.data?.status || "-"}
      </div>
      <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
        {`${feature?.data?.progress}%` || "-"}
      </div>
      <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
        {feature?.data?.team || "-"}
      </div>
      <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
        {feature?.data?.days || "-"}
      </div>
      <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
        {feature?.data?.startDate || ""}-{feature?.data?.targetDate || ""}
      </div>
      <div
        className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
      >
        {feature.data.completedOn || "-"}
      </div>
      <div
        className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
      >
        <span>{feature.data.remarks || "-"}</span>
      </div>
    </div>
  );
};
