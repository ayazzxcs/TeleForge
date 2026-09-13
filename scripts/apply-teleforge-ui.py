from pathlib import Path

ROOT = Path('.')


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Expected {label} was not found: {path}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


# Keep the public app name deterministic in every upstream locale resource.
for strings in (ROOT / 'TMessagesProj/src/main/res').glob('values*/strings.xml'):
    text = strings.read_text(encoding='utf-8')
    text = text.replace('<string name="AppName">Telegram</string>', '<string name="AppName">TeleForge</string>')
    text = text.replace('<string name="AppNameBeta">Telegram Beta</string>', '<string name="AppNameBeta">TeleForge Beta</string>')
    if 'name="TeleForgeFolders"' not in text:
        text = text.replace('</resources>', '    <string name="TeleForgeFolders">Folders</string>\n</resources>', 1)
    strings.write_text(text, encoding='utf-8')


# The current Telegram main screen is hosted by MainTabsActivity. Its child
# DialogsActivity owns the visible ActionBar, so enforce the TeleForge title
# after the pager has resumed instead of guessing a DialogsActivity source line.
main_tabs = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/MainTabsActivity.java'
text = main_tabs.read_text(encoding='utf-8')

resume_marker = '''    @Override
    public void onResume() {
        super.onResume();
        blur3_updateColors();
'''
resume_replacement = '''    @Override
    public void onResume() {
        super.onResume();
        BaseFragment visibleFragment = getCurrentVisibleFragment();
        if (visibleFragment instanceof DialogsActivity && visibleFragment.getActionBar() != null) {
            visibleFragment.getActionBar().setTitle("TeleForge");
        }
        blur3_updateColors();
'''
if 'visibleFragment.getActionBar().setTitle("TeleForge")' not in text:
    replace_once(main_tabs, resume_marker, resume_replacement, 'MainTabsActivity onResume branding anchor')

field_marker = '    private View fadeView;\n'
if 'private GlassTabView teleForgeFoldersTab;' not in text:
    replace_once(main_tabs, field_marker, field_marker + '    private GlassTabView teleForgeFoldersTab;\n', 'MainTabsActivity folder-tab field anchor')

add_marker = '''            tabsView.addView(tabs[index]);
            tabsView.setViewVisible(view, true, false);
'''
add_replacement = '''            tabsView.addView(tabs[index]);
            tabsView.setViewVisible(view, true, false);

            if (index == INDEX_CHATS && teleForgeFoldersTab == null) {
                teleForgeFoldersTab = GlassTabView.createIconTab(context, resourceProvider, R.drawable.msg_folders, R.string.TeleForgeFolders);
                teleForgeFoldersTab.setOnClickListener(v -> presentFragment(new TeleForgeFoldersActivity()));
                tabsView.addTabToIgnoreClick(teleForgeFoldersTab);
                tabsView.addView(teleForgeFoldersTab);
                tabsView.setViewVisible(teleForgeFoldersTab, true, false);
            }
'''
if 'teleForgeFoldersTab.setOnClickListener' not in text:
    replace_once(main_tabs, add_marker, add_replacement, 'MainTabsActivity tab insertion anchor')

main_tabs.write_text(text, encoding='utf-8')


# Static icon factory for the additional navigation item. It intentionally uses
# Telegram's existing GlassTabView so selection, typography and theme behavior
# remain native to the upstream client.
glass = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/Components/glass/GlassTabView.java'
text = glass.read_text(encoding='utf-8')
factory_marker = '''    public static GlassTabView createAvatar(Context context, Theme.ResourcesProvider resourcesProvider, int currentAccount, @StringRes int stringRes) {
'''
factory = '''    public static GlassTabView createIconTab(Context context, Theme.ResourcesProvider resourcesProvider, @DrawableRes int drawableRes, @StringRes int stringRes) {
        GlassTabView tab = new GlassTabView(context);
        tab.resourcesProvider = resourcesProvider;
        tab.textView.setText(LocaleController.getString(stringRes));
        tab.imageView.setImageResource(drawableRes);
        tab.imageView.setLayoutParams(LayoutHelper.createFrame(24, 24, Gravity.CENTER_HORIZONTAL | Gravity.TOP, 0, 4, 0, 0));
        tab.colorDefault = Theme.getColor(Theme.key_glass_tabUnselected, resourcesProvider);
        tab.colorSelected = Theme.getColor(Theme.key_glass_tabSelected, resourcesProvider);
        tab.colorSelectedText = Theme.getColor(Theme.key_glass_tabSelectedText, resourcesProvider);
        tab.updateColors();
        return tab;
    }

'''
if 'createIconTab(Context context' not in text:
    replace_once(glass, factory_marker, factory + factory_marker, 'GlassTabView factory anchor')


# Custom TeleForge Power Folders screen. The actual folder data remains backed
# by Telegram's mature folder engine for compatibility; this screen is the
# TeleForge-native control surface we can extend with advanced folder rules.
folders = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/TeleForgeFoldersActivity.java'
folders.parent.mkdir(parents=True, exist_ok=True)
folders.write_text(r'''package org.telegram.ui;

import android.content.Context;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TextView;

import org.telegram.messenger.AndroidUtilities;
import org.telegram.messenger.R;
import org.telegram.ui.ActionBar.BaseFragment;
import org.telegram.ui.ActionBar.Theme;
import org.telegram.ui.Components.LayoutHelper;

public class TeleForgeFoldersActivity extends BaseFragment {

    private int cardColor() {
        return getThemedColor(Theme.key_windowBackgroundGray);
    }

    private TextView text(Context context, String value, float size, boolean bold) {
        TextView view = new TextView(context);
        view.setText(value);
        view.setTextSize(size);
        view.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteBlackText));
        if (bold) {
            view.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        }
        return view;
    }

    private GradientDrawable rounded(int color, float radius) {
        GradientDrawable drawable = new GradientDrawable();
        drawable.setColor(color);
        drawable.setCornerRadius(AndroidUtilities.dp(radius));
        return drawable;
    }

    private View card(Context context, String title, String subtitle, String symbol, View.OnClickListener listener) {
        LinearLayout row = new LinearLayout(context);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(AndroidUtilities.dp(16), AndroidUtilities.dp(14), AndroidUtilities.dp(16), AndroidUtilities.dp(14));
        row.setBackground(rounded(cardColor(), 18));
        row.setOnClickListener(listener);

        TextView icon = text(context, symbol, 24, false);
        icon.setGravity(Gravity.CENTER);
        icon.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteBlueText, resourceProvider));
        row.addView(icon, LayoutHelper.createLinear(42, 42));

        LinearLayout labels = new LinearLayout(context);
        labels.setOrientation(LinearLayout.VERTICAL);
        labels.setPadding(AndroidUtilities.dp(12), 0, 0, 0);
        labels.addView(text(context, title, 16, true), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT));
        TextView sub = text(context, subtitle, 13, false);
        sub.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteGrayText));
        labels.addView(sub, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 3, 0, 0));
        row.addView(labels, LayoutHelper.createLinear(0, LayoutHelper.WRAP_CONTENT, 1f));
        return row;
    }

    private View toggle(Context context, String title, String subtitle, String key, boolean defaultValue) {
        LinearLayout row = new LinearLayout(context);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(AndroidUtilities.dp(16), AndroidUtilities.dp(12), AndroidUtilities.dp(12), AndroidUtilities.dp(12));
        row.setBackground(rounded(cardColor(), 18));

        LinearLayout labels = new LinearLayout(context);
        labels.setOrientation(LinearLayout.VERTICAL);
        labels.addView(text(context, title, 16, true), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT));
        TextView sub = text(context, subtitle, 13, false);
        sub.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteGrayText));
        labels.addView(sub, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 3, 0, 0));
        row.addView(labels, LayoutHelper.createLinear(0, LayoutHelper.WRAP_CONTENT, 1f));

        Switch toggle = new Switch(context);
        boolean checked = getContext().getSharedPreferences("teleforge_ui", Context.MODE_PRIVATE).getBoolean(key, defaultValue);
        toggle.setChecked(checked);
        toggle.setOnCheckedChangeListener((CompoundButton button, boolean value) -> getContext().getSharedPreferences("teleforge_ui", Context.MODE_PRIVATE).edit().putBoolean(key, value).apply());
        row.addView(toggle, LayoutHelper.createLinear(LayoutHelper.WRAP_CONTENT, LayoutHelper.WRAP_CONTENT));
        return row;
    }

    @Override
    public View createView(Context context) {
        actionBar.setBackButtonImage(R.drawable.ic_ab_back);
        actionBar.setTitle("Power Folders");
        actionBar.setAllowOverlayTitle(false);

        LinearLayout root = new LinearLayout(context);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(getThemedColor(Theme.key_windowBackgroundWhite));

        ScrollView scroll = new ScrollView(context);
        scroll.setFillViewport(true);
        LinearLayout content = new LinearLayout(context);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(AndroidUtilities.dp(18), AndroidUtilities.dp(20), AndroidUtilities.dp(18), AndroidUtilities.dp(30));

        TextView hero = text(context, "Your chats, your way.", 27, true);
        content.addView(hero, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 5));
        TextView intro = text(context, "Build focused spaces for work, gaming, communities and everything in between.", 14, false);
        intro.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteGrayText));
        content.addView(intro, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 20));

        content.addView(card(context, "Manage folders", "Create, rename and configure your Telegram folders", "▦",
                v -> presentFragment(new FiltersSetupActivity())), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 10));
        content.addView(card(context, "Advanced rules", "TeleForge-ready control surface for future smart rules", "✦",
                v -> presentFragment(new FiltersSetupActivity())), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 20));

        TextView section = text(context, "TeleForge layout", 15, true);
        content.addView(section, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 8));
        content.addView(toggle(context, "Compact navigation", "Use a denser navigation layout for power users.", "compact_navigation", false), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 12));
        content.addView(toggle(context, "Folder-first workflow", "Keep Power Folders as the primary organization surface.", "folder_first", true), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 18));

        TextView note = text(context, "Power Folders uses Telegram's existing folder engine underneath, keeping your organization compatible with normal Telegram clients.", 12, false);
        note.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteGrayText));
        note.setPadding(AndroidUtilities.dp(4), 0, AndroidUtilities.dp(4), 0);
        content.addView(note, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT));

        scroll.addView(content, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        root.addView(scroll, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, 0, 1f));
        fragmentView = root;
        return fragmentView;
    }
}
''', encoding='utf-8')


# Keep debug/release app labels deterministic as well as the AppName resource.
for manifest in (
    ROOT / 'TMessagesProj/config/debug/AndroidManifest.xml',
    ROOT / 'TMessagesProj/config/debug/AndroidManifest_SDK23.xml',
    ROOT / 'TMessagesProj/config/release/AndroidManifest.xml',
    ROOT / 'TMessagesProj/config/release/AndroidManifest_SDK23.xml',
    ROOT / 'TMessagesProj/config/release/AndroidManifest_standalone.xml',
):
    if manifest.exists():
        text = manifest.read_text(encoding='utf-8')
        text = text.replace('android:label="@string/AppNameBeta"', 'android:label="@string/AppName"')
        manifest.write_text(text, encoding='utf-8')

print('TeleForge UI v2 patches applied successfully')
