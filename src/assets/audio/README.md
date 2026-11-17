# Interface sounds

Drop the chosen ElevenLabs takes here, named:

- `snap.mp3`: the two halves of the logo landing together (under 0.4 s)
- `tick.mp3`: pointer onto a link or button (under 0.1 s, very quiet)
- `blip.mp3`: a pipeline log line printing, the chaos test (under 0.2 s)

`.ogg`, `.webm` and `.wav` work too. The build fingerprints them; a sound with
no file here plays a small synthesised version instead (src/lib/sound.js).
Sound is off until a visitor turns it on.
