import re

with open('src/renderer/src/mikro-next/components/scene/Scene.tsx', 'r') as f:
    text = f.read()

if "import { DebugPanel } from" not in text:
    text = text.replace('import { LayerControlPanel } from "./panels/LayerControlPanel";', 'import { LayerControlPanel } from "./panels/LayerControlPanel";\nimport { DebugPanel } from "./panels/DebugPanel";')

if "<DebugPanel />" not in text:
    text = text.replace('<LayerControlPanel />', '<LayerControlPanel />\n            <DebugPanel />')

with open('src/renderer/src/mikro-next/components/scene/Scene.tsx', 'w') as f:
    f.write(text)

