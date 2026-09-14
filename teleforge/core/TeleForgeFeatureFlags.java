package teleforge.core;

/**
 * TeleForgeFeatureFlags
 *
 * All new TeleForge functionality must be protected by feature flags.
 * If any feature is disabled, the application falls back safely to
 * Telegram's proven stock implementation.
 *
 * Current Phase: PHASE 1 (Branding Only)
 */
public final class TeleForgeFeatureFlags {

    private TeleForgeFeatureFlags() {
        // Prevent instantiation
    }

    // Phase 1: Brand identity override (active)
    public static final boolean BRANDING_OVERRIDE = true;

    // Phase 2: Isolated 5-tab bottom navigation layer (Chats, Folders, Contacts, Settings, Profile)
    // Disabled in Phase 1 to ensure zero-risk baseline startup.
    public static final boolean POWER_NAVIGATION = false;

    // Phase 3: Dedicated Power Folders screen & filter customization
    public static final boolean POWER_FOLDERS = false;

    // Phase 4: Theme Studio palette selector & custom bubble radius
    public static final boolean THEME_STUDIO = false;

    // Phase 5: Power-User controls (MTProxy diagnostics, privacy phone masking, etc.)
    public static final boolean EXPERIMENTAL_FEATURES = false;

    /**
     * Runtime validation helper to verify feature flag integrity.
     */
    public static boolean isFeatureSafe(String featureKey) {
        if ("BRANDING".equals(featureKey)) {
            return BRANDING_OVERRIDE;
        }
        if ("POWER_NAVIGATION".equals(featureKey)) {
            return POWER_NAVIGATION;
        }
        if ("POWER_FOLDERS".equals(featureKey)) {
            return POWER_FOLDERS;
        }
        if ("THEME_STUDIO".equals(featureKey)) {
            return THEME_STUDIO;
        }
        return false;
    }
}
