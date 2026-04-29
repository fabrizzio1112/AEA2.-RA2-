# detection-overlay Specification

## Purpose
TBD - created by archiving change on-device-object-detection. Update Purpose after archive.
## Requirements
### Requirement: Canvas overlay positioning
The system SHALL position a `<canvas>` element absolutely over the `<video>` element to display detection results, matching video dimensions.

#### Scenario: Overlay sizing
- **WHEN** the video metadata loads and dimensions are known
- **THEN** the system SHALL set the canvas width and height to match the video dimensions

#### Scenario: Pointer events passthrough
- **WHEN** the canvas overlay is active
- **THEN** the canvas SHALL have `pointer-events: none` to allow interaction with video underneath

### Requirement: Bounding box rendering
The system SHALL draw bounding boxes around detected objects on the canvas overlay with distinct, valid CSS colors per object class.

#### Scenario: Valid colors
- **WHEN** a detection result is received with bounding box coordinates (x, y, width, height)
- **THEN** the system SHALL draw a rectangle on the canvas using `ctx.strokeRect(x, y, width, height)` with a valid CSS color

#### Scenario: Color array
- **WHEN** the colors array is defined
- **THEN** all colors SHALL be valid 6-digit hex values (e.g., '#FF0000' not '#FF0000')

### Requirement: Label and confidence display
The system SHALL display the object class label and confidence percentage above each bounding box.

#### Scenario: Label rendering
- **WHEN** a detection result includes a label and confidence score
- **THEN** the system SHALL render text in format "label confidence%" above the bounding box using `ctx.fillText()`

