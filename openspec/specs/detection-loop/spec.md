# detection-loop Specification

## Purpose
TBD - created by archiving change implement-object-detection-logic. Update Purpose after archive.
## Requirements
### Requirement: Non-blocking detection loop
The system SHALL implement a detection loop using requestAnimationFrame that does not block the UI thread.

#### Scenario: Animation frame detection
- **WHEN** the model is loaded and camera is active
- **THEN** the system SHALL use requestAnimationFrame to schedule detection cycles

#### Scenario: Throttled detection frequency
- **WHEN** detection is running
- **THEN** the system SHALL throttle detections to approximately 100-200ms intervals (5-10 FPS)

### Requirement: Detection frame passing
The system SHALL pass the current video frame to the COCO-SSD model's detect() method.

#### Scenario: Frame detection
- **WHEN** a detection cycle executes
- **THEN** the system SHALL call `model.detect(video)` with the current video element

#### Scenario: Prediction handling
- **WHEN** detect() returns predictions
- **THEN** the system SHALL process all detection results for canvas rendering

