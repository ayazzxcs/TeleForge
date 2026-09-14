package teleforge.core;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * TeleForgePreferences
 *
 * Lifecycle-safe, lazily initialized preferences storage for TeleForge client.
 * Never throws during app startup if context or preference file is temporarily unready.
 */
public final class TeleForgePreferences {

    private static final String PREF_NAME = "teleforge_prefs";
    private static volatile TeleForgePreferences instance;

    private static final String KEY_BRANDING_ENABLED = "branding_enabled";
    private static final String KEY_CUSTOM_THEME = "custom_theme";
    private static final String KEY_PRIVACY_MODE = "privacy_mode";
    private static final String KEY_EXPERIMENTAL = "experimental_features";

    private final SharedPreferences preferences;

    private TeleForgePreferences(Context context) {
        if (context != null) {
            this.preferences = context.getApplicationContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        } else {
            this.preferences = null;
        }
    }

    /**
     * Thread-safe singleton getter with null safety.
     */
    public static TeleForgePreferences getInstance(Context context) {
        if (instance == null) {
            synchronized (TeleForgePreferences.class) {
                if (instance == null && context != null) {
                    instance = new TeleForgePreferences(context.getApplicationContext());
                }
            }
        }
        return instance;
    }

    public boolean isBrandingEnabled() {
        if (preferences == null) {
            return TeleForgeFeatureFlags.BRANDING_OVERRIDE;
        }
        return preferences.getBoolean(KEY_BRANDING_ENABLED, TeleForgeFeatureFlags.BRANDING_OVERRIDE);
    }

    public void setBrandingEnabled(boolean enabled) {
        if (preferences != null) {
            preferences.edit().putBoolean(KEY_BRANDING_ENABLED, enabled).apply();
        }
    }

    public boolean isPrivacyModeEnabled() {
        if (preferences == null) {
            return false;
        }
        return preferences.getBoolean(KEY_PRIVACY_MODE, false);
    }

    public void setPrivacyModeEnabled(boolean enabled) {
        if (preferences != null) {
            preferences.edit().putBoolean(KEY_PRIVACY_MODE, enabled).apply();
        }
    }

    public String getCustomTheme() {
        if (preferences == null) {
            return "teleforge_cyber";
        }
        return preferences.getString(KEY_CUSTOM_THEME, "teleforge_cyber");
    }

    public void setCustomTheme(String themeKey) {
        if (preferences != null && themeKey != null) {
            preferences.edit().putString(KEY_CUSTOM_THEME, themeKey).apply();
        }
    }
}
