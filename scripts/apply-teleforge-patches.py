from pathlib import Path
import re

ROOT = Path(".")


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding="utf-8")
    if old not in text:
        raise SystemExit(f"Expected {label} was not found: {path}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")


# User-facing branding.
for path in ROOT.glob("TMessagesProj/src/main/res/**/strings.xml"):
    text = path.read_text(encoding="utf-8")
    text = re.sub(r'(<string\s+name="AppName">)Telegram(</string>)', r"\1TeleForge\2", text)
    text = re.sub(r'(<string\s+name="AppNameBeta">)Telegram Beta(</string>)', r"\1TeleForge Beta\2", text)
    text = re.sub(r'(<string\s+name="Page1Title">)Telegram(</string>)', r"\1TeleForge\2", text)
    path.write_text(text, encoding="utf-8")


# Public builds do not expose Telegram's separate test backend selector.
login = ROOT / "TMessagesProj/src/main/java/org/telegram/ui/LoginActivity.java"
replace_once(
    login,
    "final boolean allowTestBackend = (BuildVars.DEBUG_VERSION || TEST_BACKEND_IN_STORE && !BuildConfig.BUNDLE) || getConnectionsManager().isTestBackend();",
    "final boolean allowTestBackend = false;",
    "Test Backend gate",
)


# TeleForge launcher artwork.
drawable_dir = ROOT / "TMessagesProj/src/main/res/drawable"
drawable_dir.mkdir(parents=True, exist_ok=True)
(drawable_dir / "ic_teleforge_launcher.xml").write_text(
    '''<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path android:fillColor="#111827" android:pathData="M14,4 L94,4 C99.5,4 104,8.5 104,14 L104,94 C104,99.5 99.5,104 94,104 L14,104 C8.5,104 4,99.5 4,94 L4,14 C4,8.5 8.5,4 14,4 Z" />
    <path android:fillColor="#5EEAD4" android:pathData="M18,25 L64,25 L64,36 L47,36 L47,82 L35,82 L35,36 L18,36 Z" />
    <path android:fillColor="#FFFFFF" android:pathData="M58,25 L91,25 L91,36 L70,36 L70,48 L88,48 L88,59 L70,59 L70,82 L58,82 Z" />
</vector>
''',
    encoding="utf-8",
)

for path in list((ROOT / "TMessagesProj/config").rglob("*.xml")) + list((ROOT / "TMessagesProj/src/main").rglob("*.xml")):
    if path.name not in {"AndroidManifest.xml", "AndroidManifest_debug.xml", "auth.xml", "contacts.xml"} and "AndroidManifest" not in path.name:
        continue
    text = path.read_text(encoding="utf-8")
    text = text.replace("@mipmap/ic_launcher_sa", "@drawable/ic_teleforge_launcher")
    text = text.replace("@mipmap/ic_launcher_round", "@drawable/ic_teleforge_launcher")
    text = text.replace("@mipmap/ic_launcher", "@drawable/ic_teleforge_launcher")
    text = text.replace("@drawable/ic_launcher_dr", "@drawable/ic_teleforge_launcher")
    path.write_text(text, encoding="utf-8")


# Replace the first onboarding icon/title with TeleForge branding while keeping
# Telegram's remaining onboarding pages and animation system intact.
intro = ROOT / "TMessagesProj/src/main/java/org/telegram/ui/IntroActivity.java"
text = intro.read_text(encoding="utf-8")
if "import android.widget.ImageView;" not in text:
    marker = "import android.widget.FrameLayout;"
    if marker not in text:
        raise SystemExit("Expected IntroActivity FrameLayout import was not found")
    text = text.replace(marker, marker + "\nimport android.widget.ImageView;", 1)

needle = "        viewPager = new ViewPager(context);"
if needle not in text:
    raise SystemExit("Expected IntroActivity ViewPager creation was not found")
if "teleForgeIntroIcon.setImageResource" not in text:
    overlay = """        ImageView teleForgeIntroIcon = new ImageView(context);\n        teleForgeIntroIcon.setImageResource(R.drawable.ic_teleforge_launcher);\n        teleForgeIntroIcon.setScaleType(ImageView.ScaleType.CENTER_INSIDE);\n        frameLayout2.addView(teleForgeIntroIcon, LayoutHelper.createFrame(160, 160, Gravity.CENTER));\n        teleForgeIntroIcon.setVisibility(View.VISIBLE);\n\n"""
    text = text.replace(needle, overlay + needle, 1)

selected_old = "            public void onPageSelected(int i) {\n                currentViewPagerPage = i;\n            }"
selected_new = "            public void onPageSelected(int i) {\n                currentViewPagerPage = i;\n                teleForgeIntroIcon.setVisibility(i == 0 ? View.VISIBLE : View.GONE);\n            }"
if selected_old not in text:
    raise SystemExit("Expected IntroActivity page-selection block was not found")
text = text.replace(selected_old, selected_new, 1)
intro.write_text(text, encoding="utf-8")


# TeleForge power-user hub.
hub = ROOT / "TMessagesProj/src/main/java/org/telegram/ui/TeleForgeHubActivity.java"
hub.write_text(
    '''package org.telegram.ui;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.view.Gravity;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Switch;
import android.widget.TextView;

import org.telegram.messenger.AndroidUtilities;
import org.telegram.messenger.R;
import org.telegram.ui.ActionBar.BaseFragment;
import org.telegram.ui.ActionBar.Theme;

public class TeleForgeHubActivity extends BaseFragment {
    private static final String PREFS = "teleforge_features";
    private static final String EXPERIMENTAL = "experimental";
    private static final String PRIVACY_MODE = "privacy_mode";

    private SharedPreferences prefs;

    @Override
    public View createView(Context context) {
        actionBar.setBackButtonImage(R.drawable.ic_ab_back);
        actionBar.setTitle("TeleForge");
        actionBar.setAllowOverlayTitle(true);

        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);

        LinearLayout root = new LinearLayout(context);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setPadding(AndroidUtilities.dp(18), AndroidUtilities.dp(18), AndroidUtilities.dp(18), AndroidUtilities.dp(24));
        root.setBackgroundColor(Theme.getColor(Theme.key_windowBackgroundWhite));

        TextView header = text(context, "Power User Control Center", 24, true);
        root.addView(header, new LinearLayout.LayoutParams(-1, -2));

        TextView subtitle = text(context, "TeleForge tools and customization in one place.", 14, false);
        subtitle.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteGrayText));
        LinearLayout.LayoutParams subLp = new LinearLayout.LayoutParams(-1, -2);
        subLp.topMargin = AndroidUtilities.dp(6);
        root.addView(subtitle, subLp);

        root.addView(section(context, "POWER TOOLS"));
        root.addView(action(context, "Power Folders", "Open Telegram's folder manager with TeleForge controls planned around it.", v -> presentFragment(new FiltersSetupActivity())));
        root.addView(action(context, "Theme Studio", "Open Telegram's theme editor from the TeleForge hub.", v -> presentFragment(new ThemeActivity(ThemeActivity.THEME_TYPE_BASIC))));

        root.addView(section(context, "TELEFORGE MODES"));
        root.addView(toggle(context, "Experimental features", "Enable TeleForge experimental feature flags.", EXPERIMENTAL, false));
        root.addView(toggle(context, "Privacy-first mode", "Enable TeleForge privacy-oriented feature flags.", PRIVACY_MODE, false));

        TextView info = text(context, "More TeleForge-native controls will be added here as they are implemented.", 13, false);
        info.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteGrayText));
        LinearLayout.LayoutParams infoLp = new LinearLayout.LayoutParams(-1, -2);
        infoLp.topMargin = AndroidUtilities.dp(20);
        root.addView(info, infoLp);

        fragmentView = root;
        return root;
    }

    private TextView text(Context context, String value, int size, boolean bold) {
        TextView view = new TextView(context);
        view.setText(value);
        view.setTextSize(size);
        view.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteBlackText));
        view.setGravity(Gravity.CENTER_VERTICAL);
        if (bold) {
            view.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        }
        return view;
    }

    private TextView section(Context context, String value) {
        TextView view = text(context, value, 12, true);
        view.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteBlueText));
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, AndroidUtilities.dp(36));
        lp.topMargin = AndroidUtilities.dp(16);
        view.setLayoutParams(lp);
        return view;
    }

    private View action(Context context, String title, String description, View.OnClickListener listener) {
        LinearLayout row = new LinearLayout(context);
        row.setOrientation(LinearLayout.VERTICAL);
        row.setPadding(AndroidUtilities.dp(14), AndroidUtilities.dp(12), AndroidUtilities.dp(14), AndroidUtilities.dp(12));
        row.setBackground(Theme.createRoundRectDrawable(AndroidUtilities.dp(14), Theme.getColor(Theme.key_windowBackgroundGray)));
        row.setOnClickListener(listener);
        row.addView(text(context, title, 16, true), new LinearLayout.LayoutParams(-1, -2));
        TextView desc = text(context, description, 13, false);
        desc.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteGrayText));
        LinearLayout.LayoutParams dlp = new LinearLayout.LayoutParams(-1, -2);
        dlp.topMargin = AndroidUtilities.dp(4);
        row.addView(desc, dlp);
        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.topMargin = AndroidUtilities.dp(6);
        row.setLayoutParams(lp);
        return row;
    }

    private View toggle(Context context, String title, String description, String key, boolean defaultValue) {
        LinearLayout row = new LinearLayout(context);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(AndroidUtilities.dp(14), AndroidUtilities.dp(10), AndroidUtilities.dp(8), AndroidUtilities.dp(10));
        row.setBackground(Theme.createRoundRectDrawable(AndroidUtilities.dp(14), Theme.getColor(Theme.key_windowBackgroundGray)));

        LinearLayout labels = new LinearLayout(context);
        labels.setOrientation(LinearLayout.VERTICAL);
        labels.addView(text(context, title, 16, true), new LinearLayout.LayoutParams(-1, -2));
        TextView desc = text(context, description, 12, false);
        desc.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteGrayText));
        LinearLayout.LayoutParams dlp = new LinearLayout.LayoutParams(-1, -2);
        dlp.topMargin = AndroidUtilities.dp(3);
        labels.addView(desc, dlp);
        row.addView(labels, new LinearLayout.LayoutParams(0, -2, 1f));

        Switch toggle = new Switch(context);
        toggle.setChecked(prefs.getBoolean(key, defaultValue));
        toggle.setOnCheckedChangeListener((buttonView, isChecked) -> prefs.edit().putBoolean(key, isChecked).apply());
        row.addView(toggle, new LinearLayout.LayoutParams(-2, -2));

        LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(-1, -2);
        lp.topMargin = AndroidUtilities.dp(6);
        row.setLayoutParams(lp);
        return row;
    }
}
''',
    encoding="utf-8",
)


# Add a TeleForge entry to Telegram's existing SettingsActivity.
settings = ROOT / "TMessagesProj/src/main/java/org/telegram/ui/SettingsActivity.java"
text = settings.read_text(encoding="utf-8")
row_text = '        items.add(SettingCell.Factory.of(9001, IconBackgroundColors.GREEN.top, IconBackgroundColors.GREEN.bottom, R.drawable.settings_power, "TeleForge", "Power tools and customization"));\n'
if "Power tools and customization" not in text:
    match = re.search(r"(?m)^([ \t]*items\.add\(SettingCell\.Factory\.of\(10,.*\);\n)", text)
    if not match:
        raise SystemExit("Could not find the SettingsActivity settings-row anchor")
    text = text[:match.end()] + row_text + text[match.end():]

if "item.id == 9001" not in text:
    method = re.search(r"@Override\s+protected void onClick\(UItem item, View view, int position, float x, float y\)\s*\{\n", text)
    if not method:
        raise SystemExit("Could not find the SettingsActivity onClick method")
    insertion = "        if (item.id == 9001) {\n            presentSettingFragment(new TeleForgeHubActivity());\n            return;\n        }\n"
    text = text[:method.end()] + insertion + text[method.end():]
settings.write_text(text, encoding="utf-8")

print("TeleForge source patches applied successfully")
