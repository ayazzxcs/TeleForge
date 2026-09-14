package teleforge.branding;

import android.content.Context;
import teleforge.core.TeleForgeConfig;
import teleforge.core.TeleForgeFeatureFlags;

/**
 * TeleForgeBrandManager
 *
 * Provides lifecycle-safe access to TeleForge branding assets and strings.
 * Enforces the brand rule: user-facing labels display "TeleForge" and
 * "The Power User Telegram Client.", while internal protocol references
 * remain unmodified.
 */
public final class TeleForgeBrandManager {

    private TeleForgeBrandManager() {
        // Prevent instantiation
    }

    /**
     * Resolves the user-facing application name.
     */
    public static String getApplicationName() {
        if (!TeleForgeFeatureFlags.BRANDING_OVERRIDE) {
            return "Telegram";
        }
        return TeleForgeConfig.APP_NAME;
    }

    /**
     * Resolves the user-facing application tagline.
     */
    public static String getTagline() {
        if (!TeleForgeFeatureFlags.BRANDING_OVERRIDE) {
            return "Fast. Secure. Powerful.";
        }
        return TeleForgeConfig.APP_TAGLINE;
    }

    /**
     * Resolves intro / onboarding headline text.
     */
    public static String getIntroTitle() {
        if (!TeleForgeFeatureFlags.BRANDING_OVERRIDE) {
            return "Telegram";
        }
        return TeleForgeConfig.APP_NAME;
    }

    /**
     * Resolves intro / onboarding description text.
     */
    public static String getIntroSubtitle() {
        if (!TeleForgeFeatureFlags.BRANDING_OVERRIDE) {
            return "The world's fastest messaging app. It is free and secure.";
        }
        return TeleForgeConfig.APP_TAGLINE + " Powered by Telegram's proven core.";
    }

    /**
     * Returns formatted version info for settings "About" display.
     */
    public static String getVersionDisplayString() {
        return TeleForgeConfig.APP_NAME + " v" + TeleForgeConfig.VERSION_NAME +
            " (Core: " + TeleForgeConfig.COMPAT_PACKAGE_ID + ")";
    }
}
