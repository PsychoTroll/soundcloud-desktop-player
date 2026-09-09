# SoundCloud Desktop Player

A standalone, off-browser desktop audio player for SoundCloud on Windows.

## Quick Launch: Executable (.exe)

You can launch the player directly by double-clicking:
👉 **`SoundCloud-Player.exe`** (located right in this root folder!)

No command prompt window will appear. It starts the desktop player instantly.

---

## Highlights & Features

- **Off-Browser Playback**: Runs natively in its own lightweight Electron desktop window, free from browser tabs and memory bloat.
- **Sleek Dark UI**: Built with SoundCloud signature orange accents, smooth transitions, and responsive track cards.
- **Direct Link Support**: Paste any SoundCloud URL (tracks, albums, sets, or artist profiles) into the search bar or sidebar to play immediately.
- **Curated Discover Library**: Browse and play curated mixes across Lo-Fi, Electronic/EDM, Synthwave, Hip-Hop, Gaming & NCS, and Ambient.
- **Full Player Controls**:
  - Play, Pause, Next, Previous
  - Interactive waveform scrubber with elapsed / total time
  - Volume control with mute toggle
  - Shuffle and Repeat modes (Repeat All / Repeat One / Off)
  - Animated live audio visualizer
- **Queue & Playlist Management**: Reorder, add to queue, and clear queue with live badges.
- **Local Favorites & History**: Like tracks to save them to your library and view recent history (persisted locally).
- **Windows Desktop Native Integrations**:
  - **Mini-Player Mode (Picture-in-Picture)**: Compact floating widget that stays "Always On Top" while multitasking or gaming.
  - **System Tray Support**: Minimizes to tray, with a tray menu for Play/Pause, Next/Prev, and quick show/hide.
  - **Global Media Keys**: Control music with your keyboard's hardware media keys (`Play/Pause`, `Next`, `Previous`) even while in other games or full-screen apps.
  - **In-App Shortcuts**:
    - `Space`: Play / Pause
    - `Left / Right Arrow`: Seek 5 seconds backward / forward
    - `Up / Down Arrow`: Volume +/- 5%
    - `M`: Mute / Unmute
    - `N`: Next Track
    - `P`: Previous Track

## Standalone Distribution Folder

A completely self-contained, standalone distribution build (containing all Chromium/Node runtimes and libraries) is also pre-built in:
`build\SoundCloud-Player-win32-x64\SoundCloud-Player.exe`

You can zip and move that folder to any other Windows PC without requiring Node.js to be installed.
