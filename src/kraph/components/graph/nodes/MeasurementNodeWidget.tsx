import React, { memo } from 'react';
import { MeasurementNodeWidgetProps } from '@/kraph/components/graph/types';
import { Handle, Position } from 'reactflow';
 
export default memo(({ data, isConnectable }: MeasurementNodeWidgetProps) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div style={{ padding: 10 }}>{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  );
});