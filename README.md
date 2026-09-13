# TeleForge

**The Power User Telegram Client.**

TeleForge is an unofficial third-party Telegram Android client built on top of the official open-source Telegram Android source, with a focus on advanced customization, power-user tools, privacy controls, performance, and optional user-triggered AI features.

> TeleForge is an unofficial third-party Telegram client and is not affiliated with Telegram.

## Current baseline

- Official Telegram Android source is used as the upstream foundation.
- GitHub Actions builds the Android APK from a fresh upstream checkout.
- TeleForge API credentials are supplied through GitHub Actions secrets.
- Public builds use TeleForge app branding and launcher artwork.
- The upstream debug-only **Test Backend** selector is hidden from public builds.
- The first production identity/package migration is intentionally held until TeleForge has its own Firebase configuration, so push notifications are not accidentally tied to Telegram's Firebase application.

## Next build

The next build bundles the first TeleForge power-user hub directly into Settings:

- **TeleForge Control Center** for power-user tools and feature flags.
- **Power Folders** entry connected to Telegram's existing folder manager.
- **Theme Studio** entry connected to Telegram's existing theme editor.
- Persistent **Experimental features** and **Privacy-first mode** switches as the foundation for TeleForge-native behavior.
- A TeleForge-owned settings surface that can be expanded without replacing Telegram's core messaging implementation.

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

Run **Actions → Build TeleForge → Run workflow**. The workflow creates the current TeleForge debug APK as the `TeleForge-debug` artifact.

## Licensing

The upstream Telegram Android project is GPL-2.0-or-later. TeleForge will preserve applicable upstream license and attribution requirements and publish corresponding source for modifications as required.

## Branding

TeleForge has its own name, application branding and visual identity and clearly identifies itself as an unofficial Telegram client.
