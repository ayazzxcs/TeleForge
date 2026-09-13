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


# Patch the actual main-dialog title path. DialogsActivity builds the title as a
# Telegram-logo ImageSpan + AppName, so changing only MainTabsActivity is not
# sufficient. Replace that exact block with a plain TeleForge title.
dialogs = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/DialogsActivity.java'
text = dialogs.read_text(encoding='utf-8')
title_old = '''                statusDrawable = new AnimatedEmojiDrawable.SwapAnimatedEmojiDrawable(null, dp(26));
                statusDrawable.center = true;
                logoDrawable = context.getResources().getDrawable(R.drawable.telegram_logo_2).mutate();
                logoDrawable.setBounds(0, dp(2), logoDrawable.getIntrinsicWidth(), dp(2) + logoDrawable.getIntrinsicHeight());
                logoDrawable.setColorFilter(getThemedColor(Theme.key_telegram_color_dialogsLogo), PorterDuff.Mode.MULTIPLY);
                SpannableStringBuilder ssb = new SpannableStringBuilder(getString(R.string.AppName));
                ssb.setSpan(new ImageSpan(logoDrawable), 0, ssb.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
                actionBar.setTitle(ssb, statusDrawable);
                updateStatus(UserConfig.getInstance(currentAccount).getCurrentUser(), false);
'''
title_new = '''                statusDrawable = new AnimatedEmojiDrawable.SwapAnimatedEmojiDrawable(null, dp(26));
                statusDrawable.center = true;
                actionBar.setTitle("TeleForge", statusDrawable);
                updateStatus(UserConfig.getInstance(currentAccount).getCurrentUser(), false);
'''
replace_once(dialogs, title_old, title_new, 'DialogsActivity main title block')


# MainTabsActivity gets a dedicated five-item TeleForge navigation bar. We keep
# Telegram's existing ViewPager and four-page navigation underneath, while the
# custom bar provides a real Folders destination without abusing the hidden
# Calls slot or adding an unsupported sixth pager position.
main_tabs = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/MainTabsActivity.java'
text = main_tabs.read_text(encoding='utf-8')

field_marker = '    private View fadeView;\n'
fields = '''    private MainTabsLayout teleForgeTabsView;
    private GlassTabView[] teleForgeTabs;
'''
if 'private MainTabsLayout teleForgeTabsView;' not in text:
    replace_once(main_tabs, field_marker, field_marker + fields, 'MainTabsActivity TeleForge navigation fields')

method_marker = '''    private void checkContactsTabBadge() {
'''
method = '''    private void createTeleForgeNavigation(Context context) {
        teleForgeTabsView = new MainTabsLayout(context, resourceProvider);
        teleForgeTabsView.setClipChildren(false);
        teleForgeTabsView.setPadding(dp(DialogsActivity.MAIN_TABS_MARGIN + 4), dp(DialogsActivity.MAIN_TABS_MARGIN + 4), dp(DialogsActivity.MAIN_TABS_MARGIN + 4), dp(DialogsActivity.MAIN_TABS_MARGIN + 4));
        teleForgeTabsView.setMaxWidth(dp(328 + DialogsActivity.MAIN_TABS_MARGIN * 2));

        teleForgeTabs = new GlassTabView[5];
        teleForgeTabs[0] = GlassTabView.createMainTab(context, resourceProvider, GlassTabView.TabAnimation.CHATS, R.string.MainTabsChats);
        teleForgeTabs[1] = GlassTabView.createIconTab(context, resourceProvider, R.drawable.msg_folders, R.string.TeleForgeFolders);
        teleForgeTabs[2] = GlassTabView.createMainTab(context, resourceProvider, GlassTabView.TabAnimation.CONTACTS, R.string.MainTabsContacts);
        teleForgeTabs[3] = GlassTabView.createMainTab(context, resourceProvider, GlassTabView.TabAnimation.SETTINGS, R.string.Settings);
        teleForgeTabs[4] = GlassTabView.createAvatar(context, resourceProvider, currentAccount, R.string.MainTabsProfile);

        for (GlassTabView tab : teleForgeTabs) {
            teleForgeTabsView.addTabToIgnoreClick(tab);
            teleForgeTabsView.addView(tab);
        }

        teleForgeTabs[0].setOnClickListener(v -> {
            selectTab(POSITION_CHATS, true);
            viewPager.scrollToPosition(POSITION_CHATS);
            selectTeleForgeTab(POSITION_CHATS, true);
        });
        teleForgeTabs[1].setOnClickListener(v -> presentFragment(new TeleForgeFoldersActivity()));
        teleForgeTabs[2].setOnClickListener(v -> {
            selectTab(POSITION_CONTACTS, true);
            viewPager.scrollToPosition(POSITION_CONTACTS);
            selectTeleForgeTab(POSITION_CONTACTS, true);
        });
        teleForgeTabs[3].setOnClickListener(v -> {
            selectTab(POSITION_CALLS_OR_SETTINGS, true);
            viewPager.scrollToPosition(POSITION_CALLS_OR_SETTINGS);
            selectTeleForgeTab(POSITION_CALLS_OR_SETTINGS, true);
        });
        teleForgeTabs[4].setOnClickListener(v -> {
            selectTab(POSITION_PROFILE, true);
            viewPager.scrollToPosition(POSITION_PROFILE);
            selectTeleForgeTab(POSITION_PROFILE, true);
        });

        selectTeleForgeTab(viewPager.getCurrentPosition(), false);
    }

    private void selectTeleForgeTab(int position, boolean animated) {
        if (teleForgeTabs == null) {
            return;
        }
        for (int i = 0; i < teleForgeTabs.length; i++) {
            boolean selected;
            if (i == 0) {
                selected = position == POSITION_CHATS;
            } else if (i == 1) {
                selected = false;
            } else if (i == 2) {
                selected = position == POSITION_CONTACTS;
            } else if (i == 3) {
                selected = position == POSITION_CALLS_OR_SETTINGS;
            } else {
                selected = position == POSITION_PROFILE;
            }
            teleForgeTabs[i].setSelected(selected, animated);
        }
    }

'''
if 'private void createTeleForgeNavigation(Context context)' not in text:
    replace_once(main_tabs, method_marker, method + method_marker, 'MainTabsActivity TeleForge navigation methods')

# Keep the existing upstream navigation implementation intact, but make the
# TeleForge bar the visible bottom navigation surface.
create_marker = '''        tabsViewWrapper.addView(tabsView, LayoutHelper.createFrame(LayoutHelper.MATCH_PARENT, DialogsActivity.MAIN_TABS_HEIGHT_WITH_MARGINS, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL));
        tabsViewWrapper.setClipToPadding(false);
'''
create_replacement = '''        tabsViewWrapper.addView(tabsView, LayoutHelper.createFrame(LayoutHelper.MATCH_PARENT, DialogsActivity.MAIN_TABS_HEIGHT_WITH_MARGINS, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL));
        tabsView.setVisibility(View.GONE);
        createTeleForgeNavigation(context);
        tabsViewWrapper.addView(teleForgeTabsView, LayoutHelper.createFrame(LayoutHelper.MATCH_PARENT, DialogsActivity.MAIN_TABS_HEIGHT_WITH_MARGINS, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL));
        tabsViewWrapper.setClipToPadding(false);
'''
replace_once(main_tabs, create_marker, create_replacement, 'MainTabsActivity navigation wrapper')

# Reuse Telegram's glass background for the TeleForge navigation after the
# upstream background is created.
background_marker = '''        tabsView.setBackground(tabsViewBackground);

        BlurredBackgroundDrawableViewFactory iBlur3FactoryFade ='''
background_replacement = '''        tabsView.setBackground(tabsViewBackground);
        tabsView.setVisibility(View.GONE);
        teleForgeTabsView.setBackground(tabsViewBackground);

        BlurredBackgroundDrawableViewFactory iBlur3FactoryFade ='''
replace_once(main_tabs, background_marker, background_replacement, 'MainTabsActivity glass background transfer')

# Update the custom bar whenever the pager settles or the activity resumes.
onresume_marker = '''        checkContactsTabBadge();
        checkUnreadCount(true);
'''
onresume_replacement = '''        checkContactsTabBadge();
        checkUnreadCount(true);
        selectTeleForgeTab(viewPager != null ? viewPager.getCurrentPosition() : POSITION_CHATS, false);
'''
replace_once(main_tabs, onresume_marker, onresume_replacement, 'MainTabsActivity TeleForge navigation resume update')

scroll_marker = '''        if (tabsView != null) {
            selectTab(viewPager.getCurrentPosition(), true);
            setGestureSelectedOverride(0, false);
        }
'''
scroll_replacement = '''        if (tabsView != null) {
            selectTab(viewPager.getCurrentPosition(), true);
            setGestureSelectedOverride(0, false);
            selectTeleForgeTab(viewPager.getCurrentPosition(), true);
        }
'''
replace_once(main_tabs, scroll_marker, scroll_replacement, 'MainTabsActivity TeleForge navigation pager update')

# Keep the unread counter on the visible TeleForge Chats tab too.
unread_marker = '''        if (unreadCount > 0) {
            final String unreadCountFmt = LocaleController.formatNumber(unreadCount, ',');
            tabs[INDEX_CHATS].setCounter(unreadCountFmt, false, animated);
        } else {
            tabs[INDEX_CHATS].setCounter(null, false, animated);
        }
'''
unread_replacement = '''        if (unreadCount > 0) {
            final String unreadCountFmt = LocaleController.formatNumber(unreadCount, ',');
            tabs[INDEX_CHATS].setCounter(unreadCountFmt, false, animated);
            if (teleForgeTabs != null) teleForgeTabs[0].setCounter(unreadCountFmt, false, animated);
        } else {
            tabs[INDEX_CHATS].setCounter(null, false, animated);
            if (teleForgeTabs != null) teleForgeTabs[0].setCounter(null, false, animated);
        }
'''
replace_once(main_tabs, unread_marker, unread_replacement, 'MainTabsActivity unread counter')

main_tabs.write_text(text, encoding='utf-8')


# Static drawable-tab factory used by the custom five-item bar.
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
    replace_once(glass, factory_marker, factory + factory_marker, 'GlassTabView icon factory')
glass.write_text(text, encoding='utf-8')


# Custom TeleForge Power Folders screen. Folder data remains backed by
# Telegram's existing folder engine for compatibility.
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
        if (bold) view.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
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

        content.addView(card(context, "Manage folders", "Create, rename and configure your Telegram folders", "▦", v -> presentFragment(new FiltersSetupActivity())), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 10));
        content.addView(card(context, "Advanced rules", "TeleForge-ready control surface for future smart rules", "✦", v -> presentFragment(new FiltersSetupActivity())), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 20));

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


# Keep debug/release app labels deterministic.
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

print('TeleForge UI v3 patches applied successfully')
