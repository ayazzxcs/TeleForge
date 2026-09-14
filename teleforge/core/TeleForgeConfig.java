package teleforge.core;

/**
 * TeleForgeConfig
 *
 * Central configuration registry for TeleForge Android client.
 * Preserves the upstream Telegram package identity for Firebase/Push
 * compatibility while establishing the TeleForge power-user brand identity.
 */
public final class TeleForgeConfig {

    private TeleForgeConfig() {
        // Prevent instantiation
    }

    // Visible Brand Identity
    public static final String APP_NAME = "TeleForge";
    public static final String APP_TAGLINE = "The Power User Telegram Client.";
    public static final String VERSION_NAME = "1.0.0";
    public static final int VERSION_CODE = 10001;

    // Upstream package compatibility
    // Retain "org.telegram.messenger" identity to preserve Firebase push
    // credentials, Google Play services, and MTProto routing integrity.
    public static final String COMPAT_PACKAGE_ID = "org.telegram.messenger";

    // TeleForge Branding Endpoints & Info
    public static final String TELEFORGE_CHANNEL_USERNAME = "teleforge_official";
    public static final String TELEFORGE_SUPPORT_BOT = "TeleForgeSupportBot";

    // Design Tokens - Cyan/Blue Power-User Palette
    public static final int COLOR_ACCENT_PRIMARY = 0xFF5EEAD4;   // Teal / Cyan #5EEAD4
    public static final int COLOR_ACCENT_MUTED = 0xFF0D9488;     // Deep Teal #0D9488
    public static final int COLOR_BACKGROUND_DARK = 0xFF090D16;  // Premium Dark #090D16
    public static final int COLOR_SURFACE_CARD = 0xFF0F172A;     // Slate 900 #0F172A
    public static final int COLOR_BORDER_SUBTLE = 0xFF1E293B;    // Slate 800 #1E293B

    /**
     * Replaces user-facing branding terms in text while leaving protocol
     * and API references untouched.
     */
    public static String formatBrandString(String original) {
        if (original == null) {
            return "";
        }
        if (!TeleForgeFeatureFlags.BRANDING_OVERRIDE) {
            return original;
        }
        return original
            .replace("Telegram", APP_NAME)
            .replace("telegram", "teleforge");
    }
}
