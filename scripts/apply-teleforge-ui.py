from pathlib import Path
import re

ROOT = Path('.')


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Expected {label} was not found: {path}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


# TeleForge navigation label.
strings = ROOT / 'TMessagesProj/src/main/res/values/strings.xml'
text = strings.read_text(encoding='utf-8')
if 'name="TeleForgeFolders"' not in text:
    text = text.replace('</resources>', '    <string name="TeleForgeFolders">Folders</string>\n</resources>', 1)
strings.write_text(text, encoding='utf-8')


# Make the main chat screen identify itself as TeleForge even when the upstream
# activity uses AppName directly instead of the application label.
dialogs = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/DialogsActivity.java'
text = dialogs.read_text(encoding='utf-8')
for old in (
    'actionBar.setTitle(LocaleController.getString(R.string.AppName));',
    'actionBar.setTitle(getString(R.string.AppName));',
    'actionBar.setTitle(R.string.AppName);',
    'actionBar.setTitle("Telegram");',
):
    text = text.replace(old, 'actionBar.setTitle("TeleForge");')
dialogs.write_text(text, encoding='utf-8')


# Add a TeleForge-native Folders tab to the existing main navigation. It opens
# Telegram's mature folder manager for now; this gives us a safe navigation slot
# that can later be upgraded to a fully custom folder screen without changing
# the main chat pager architecture.
main_tabs = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/MainTabsActivity.java'
text = main_tabs.read_text(encoding='utf-8')

field_marker = '    private View fadeView;\n'
if 'private GlassTabView teleForgeFoldersTab;' not in text:
    if field_marker not in text:
        raise SystemExit('MainTabsActivity folder-tab field anchor was not found')
    text = text.replace(field_marker, field_marker + '    private GlassTabView teleForgeFoldersTab;\n', 1)

add_marker = '''            tabsView.addView(tabs[index]);
            tabsView.setViewVisible(view, true, false);
'''
add_replacement = '''            tabsView.addView(tabs[index]);
            tabsView.setViewVisible(view, true, false);

            if (index == INDEX_CHATS && teleForgeFoldersTab == null) {
                teleForgeFoldersTab = GlassTabView.createIconTab(context, resourceProvider, R.drawable.msg_folders, R.string.TeleForgeFolders);
                teleForgeFoldersTab.setOnClickListener(v -> presentFragment(new FiltersSetupActivity()));
                tabsView.addTabToIgnoreClick(teleForgeFoldersTab);
                tabsView.addView(teleForgeFoldersTab);
                tabsView.setViewVisible(teleForgeFoldersTab, true, false);
            }
'''
if 'teleForgeFoldersTab.setOnClickListener' not in text:
    if add_marker not in text:
        raise SystemExit('MainTabsActivity tab insertion anchor was not found')
    text = text.replace(add_marker, add_replacement, 1)

main_tabs.write_text(text, encoding='utf-8')


# Small factory for a static drawable tab icon. Keeping it inside the existing
# GlassTabView preserves Telegram's selection, typography and theme handling.
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
    if factory_marker not in text:
        raise SystemExit('GlassTabView factory anchor was not found')
    text = text.replace(factory_marker, factory + factory_marker, 1)
glass.write_text(text, encoding='utf-8')


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

print('TeleForge UI patches applied successfully')
