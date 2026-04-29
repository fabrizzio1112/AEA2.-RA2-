# object-detection Specification

## Purpose
TBD - created by archiving change on-device-object-detection. Update Purpose after archive.
## Requirements
### Requirement: Model loading
The system SHALL load the COCO-SSD model from `@tensorflow-models/coco-ssd` on component mount and display "Cargando IA..." loading state until complete. TensorFlow.js core SHALL be imported first to register backends.

#### Scenario: TensorFlow import
- **WHEN** CameraView.vue script imports are loaded
- **THEN** `import '@tensorflow/tfjs'` SHALL appear before `import * as cocoSsd from '@tensorflow-models/coco-ssd'` to register WebGL/CPU backends

#### Scenario: Initial model load
- **WHEN** the component mounts
- **THEN** the system SHALL set a loading state to true, display "Cargando IA..." in the UI, and call `cocoSsd.load()`

#### Scenario: Model load complete
- **WHEN** the model finishes loading
- **THEN** the system SHALL set loading state to false and begin camera initialization

#### Scenario: Model load error
- **WHEN** the model fails to load
- **THEN** the system SHALL log the error to console

### Requirement: Real-time object detection
The system SHALL run object detection on video frames at 5-10 FPS using the loaded COCO-SSD model via requestAnimationFrame loop.

#### Scenario: Detection execution
- **WHEN** the camera feed is active and model is loaded
- **THEN** the system SHALL start the detection loop using requestAnimationFrame

#### Scenario: Detection results
- **WHEN** an object is detected
- **THEN** the system SHALL receive bounding box coordinates, class label, and confidence score from `model.detect(video)`

### Requirement: Detection throttling
The system SHALL throttle detection requests to maintain 5-10 FPS and prevent performance degradation.

#### Scenario: Frame rate management
- **WHEN** detection loop is running
- **THEN** the system SHALL track timestamps and only execute detect() every 100-200ms

