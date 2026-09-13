# TeleForge

**An unofficial, power-user Telegram Android client.**

TeleForge is built on top of the official open-source Telegram Android client, with a focus on advanced customization, power-user tools, privacy controls, performance, and optional user-triggered AI features.

> TeleForge is an unofficial third-party Telegram client and is not affiliated with Telegram.

## Project direction

The foundation is the official Telegram Android source. Features from other Telegram clients may be studied and reimplemented only after checking their licenses and dependencies. We will not blindly merge unrelated forks.

### Planned feature areas

- Advanced chat folders and navigation
- Theme Studio and deep UI customization
- Download and media management
- Bulk message actions
- Connection and proxy diagnostics
- Privacy Center, app lock and session controls
- Translation, transcription, OCR and other user-triggered AI tools
- Developer / experimental mode
- Performance and stability improvements

We will not implement features that violate Telegram's API Terms, such as ghost-mode behavior that tampers with read/typing status or self-destructing content.

## Build

GitHub Actions is the build environment. The workflow fetches the official Telegram Android source with its required submodules and builds TeleForge without storing the large upstream source tree in this repository.

### Required repository secrets

Add:

- `TELEGRAM_API_ID` — your own Telegram API ID
- `TELEGRAM_API_HASH` — your own Telegram API hash

Never commit either credential to source control.

Run **Actions → Build TeleForge → Run workflow**. The first workflow run is a toolchain/upstream validation build; feature work follows after the baseline APK builds successfully.

## Licensing

The upstream Telegram Android project is GPL-2.0-or-later. TeleForge will preserve applicable upstream license and attribution requirements and publish corresponding source for modifications as required.

## Branding

TeleForge has its own name, application branding and visual identity and must clearly identify itself as an unofficial Telegram client.
