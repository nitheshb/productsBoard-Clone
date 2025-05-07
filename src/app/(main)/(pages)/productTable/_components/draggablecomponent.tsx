
import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableFeature } from "./dragabblefeature";
import { TableItem } from "@/app/types";

interface DroppableComponentProps {
  component: TableItem;
  isExpanded: boolean;
  onFeatureClick: (feature: TableItem) => void;
  componentId: string;
}

export const DroppableComponent: React.FC<DroppableComponentProps> = ({
  component,
  isExpanded,
  onFeatureClick,
  componentId,
}) => {
  const componentFeatures = component.children || [];
  const droppableId = `component-${componentId}`;
  
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    data: {
      componentId: componentId,
      accepts: ["feature"],
      type: "component",
    },
  });

  if (!isExpanded) {
    return null;
  }

  // Make sure we have valid feature IDs for the sortable context
  const featureIds = componentFeatures.map(feature => `feature-${feature.id}`);

  return (
    <div 
      ref={setNodeRef} 
      className={`feature-list ${isOver ? "bg-blue-50" : ""}`}
      style={{ minHeight: componentFeatures.length > 0 ? "auto" : "20px" }}
      data-droppable-type="component" // Add data attribute for debugging
      data-component-id={componentId}
    >
      <SortableContext items={featureIds} strategy={verticalListSortingStrategy}>
        {componentFeatures.map((feature, index) => (
          <DraggableFeature
            key={feature.id}
            feature={feature}
            index={index}
            onClick={onFeatureClick}
          />
        ))}
      </SortableContext>
    </div>
  );
};