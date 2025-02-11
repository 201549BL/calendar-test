export const topCornersCollisionDetection: CollisionDetection = ({
  collisionRect,
  droppableRects,
  droppableContainers,
}) => {
  const collisions = [];

  // Get the top corners of the draggable
  const dragTopLeft = {
    x: collisionRect.left,
    y: collisionRect.top
  };
  const dragTopRight = {
    x: collisionRect.right,
    y: collisionRect.top
  };

  for (const droppableContainer of droppableContainers) {
    const { id } = droppableContainer;
    const droppableRect = droppableRects.get(id);

    if (droppableRect) {
      // Calculate distances from both top corners of draggable
      // to the droppable's top edge
      const distanceFromTopLeft = Math.sqrt(
        (dragTopLeft.x - droppableRect.left) ** 2 +
        (dragTopLeft.y - droppableRect.top) ** 2
      );

      const distanceFromTopRight = Math.sqrt(
        (dragTopRight.x - droppableRect.right) ** 2 +
        (dragTopRight.y - droppableRect.top) ** 2
      );

      // Use the minimum distance of the two corners
      const minDistance = Math.min(distanceFromTopLeft, distanceFromTopRight);

      collisions.push({
        id,
        data: {
          droppableContainer,
          value: minDistance,
        },
      });
    }
  }

  // Sort by shortest distance
  return collisions.sort((a, b) => a.data.value - b.data.value);
};