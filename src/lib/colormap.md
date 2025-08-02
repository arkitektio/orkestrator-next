# Instance Segmentation Colormap

This module provides utilities for generating visually distinct colors for instance segmentation masks using HSV color space.

## Features

- **HSV-based color generation**: Colors are distributed evenly around the hue circle for maximum visual distinction
- **Configurable parameters**: Adjust saturation, brightness, and starting hue
- **Multiple output formats**: RGB, RGBA, and colormap library compatible formats
- **TypeScript support**: Full type safety with comprehensive interfaces
- **Integration ready**: Works seamlessly with the existing mikro-next image rendering system

## Usage

### Basic Usage

```typescript
import { generateInstanceSegmentationColors } from "@/lib/utils";

// Generate 8 distinct colors for instance segmentation
const colors = generateInstanceSegmentationColors(8);
// Returns: [{ r: 230, g: 69, b: 69 }, { r: 230, g: 189, b: 69 }, ...]
```

### Advanced Usage

```typescript
import { 
  generateInstanceSegmentationColors,
  generateInstanceSegmentationColorsRGBA,
  getInstanceColor 
} from "@/lib/utils";

// Custom saturation and brightness
const colors = generateInstanceSegmentationColors(5, 80, 95);

// With alpha channel
const colorsWithAlpha = generateInstanceSegmentationColorsRGBA(5, 128, 80, 95);

// Get color for specific instance
const instanceColor = getInstanceColor(2, 8); // Get color for instance 2 out of 8 total
```

### Integration with Mikro-Next

The colormap is automatically available in the mikro-next image rendering system:

```typescript
// Use "instance-segmentation" as a colormap option
const imageData = await renderImageView(view, "instance-segmentation");
```

## API Reference

### Core Functions

#### `generateInstanceSegmentationColors(numInstances, saturation?, value?, startHue?)`

Generates N equidistant colors for instance segmentation.

- `numInstances`: Number of instances to generate colors for
- `saturation`: Saturation value (0-100), defaults to 70
- `value`: Brightness value (0-100), defaults to 90  
- `startHue`: Starting hue offset (0-360), defaults to 0

#### `getInstanceColor(instanceId, totalInstances, saturation?, value?, startHue?)`

Get a specific color for an instance ID.

- `instanceId`: The instance ID (0-indexed)
- `totalInstances`: Total number of instances
- Other parameters same as above

### Utility Functions

- `hsvToRgb(h, s, v)`: Convert HSV to RGB
- `generateInstanceSegmentationColorsRGBA()`: Generate colors with alpha channel
- `generateInstanceSegmentationColormapFormat()`: Generate colors in colormap library format

## Color Distribution

The colormap distributes colors evenly around the HSV hue circle:

- **3 instances**: Red, Green, Blue (120° apart)
- **8 instances**: Red, Orange, Yellow-Green, Green, Cyan, Blue, Purple, Magenta (45° apart)
- **N instances**: 360°/N apart for maximum visual distinction

## Integration Points

1. **Mikro-Next Provider**: Added as "instance-segmentation" colormap option
2. **Library Utils**: Available through `@/lib/utils` exports
3. **Type Safety**: Full TypeScript interfaces for all color formats

## Examples

See the demo component `InstanceSegmentationColormapDemo.tsx` for interactive examples and usage patterns.