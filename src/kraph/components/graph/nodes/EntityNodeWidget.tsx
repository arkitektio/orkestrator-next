import React, { memo } from 'react';
import {  EntityNodeWidgetProps } from '@/kraph/components/graph/types';
import { Handle, Position } from 'reactflow';
 
export default memo(({ data, isConnectable }: EntityNodeWidgetProps) => {
  return (
    <>
      <Handle
            type="target"
            position={Position.Top}
            style={{ left: '50%', top: "50%" }}
            onConnect={(params) => console.log('handle onConnect', params)}
            isConnectable={isConnectable}
            />
            <div style={{ padding: 10 }}>{data.label}</div>
            <Handle
            type="source"
            position={Position.Bottom}
            style={{ left: '50%', top: "50%" }}
            isConnectable={isConnectable}
            />
    </>
  );
});