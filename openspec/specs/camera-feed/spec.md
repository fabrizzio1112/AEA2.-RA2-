# camera-feed Specification

## Purpose
TBD - created by archiving change on-device-object-detection. Update Purpose after archive.
## Requirements
### Requirement: Camera stream access
The system SHALL access the device camera using `navigator.mediaDevices.getUserMedia`. It SHALL first try `facingMode: 'environment'` for mobile rear camera, then fallback to `{ video: true }` for PC webcams.

#### Scenario: Mobile camera access
- **WHEN** the component mounts on a mobile device with rear camera
- **THEN** the system SHALL call `getUserMedia({ video: { facingMode: 'environment' } })` and connect the stream to the `<video>` element

#### Scenario: PC webcam fallback
- **WHEN** `getUserMedia({ video: { facingMode: 'environment' } })` fails (e.g., PC without rear camera)
- **THEN** the system SHALL fallback to `getUserMedia({ video: true })` to use the default webcam

#### Scenario: Camera permission denied
- **WHEN** both camera access attempts fail
- **THEN** the system SHALL log an error and stop execution

### Requirement: Video stream configuration
The system SHALL configure the video stream and connect it to the video element with autoplay, playsinline, and muted attributes.

#### Scenario: Video element setup
- **WHEN** the camera stream is obtained
- **THEN** the video element SHALL have the stream assigned to `video.srcObject` with `autoplay`, `playsinline`, and `muted` attributes

#### Scenario: Stream cleanup
- **WHEN** the component unmounts
- **THEN** the system SHALL stop all video tracks by iterating over `stream.getTracks()` and calling `track.stop()`

