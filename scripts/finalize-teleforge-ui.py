from pathlib import Path

ROOT = Path('.')


def patch(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding='utf-8')
    if old not in text:
        raise SystemExit(f'Expected {label} was not found: {path}')
    path.write_text(text.replace(old, new, 1), encoding='utf-8')


# The first UI script intentionally keeps the upstream source as the base, but
# its final in-memory write can overwrite the MainTabs/GlassTab edits it made.
# Reapply those two generated-source edits in one final pass and write each
# file exactly once.
main_tabs = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/MainTabsActivity.java'
text = main_tabs.read_text(encoding='utf-8')

if 'private MainTabsLayout teleForgeTabsView;' not in text:
    marker = '    private View fadeView;\n'
    if marker not in text:
        raise SystemExit('MainTabsActivity field insertion point was not found')
    text = text.replace(marker, marker + '    private MainTabsLayout teleForgeTabsView;\n    private GlassTabView[] teleForgeTabs;\n', 1)

if 'private void createTeleForgeNavigation(Context context)' not in text:
    marker = '    private void checkContactsTabBadge() {\n'
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
    if marker not in text:
        raise SystemExit('MainTabsActivity method insertion point was not found')
    text = text.replace(marker, method + marker, 1)

create_marker = '''        tabsViewWrapper.addView(tabsView, LayoutHelper.createFrame(LayoutHelper.MATCH_PARENT, DialogsActivity.MAIN_TABS_HEIGHT_WITH_MARGINS, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL));
        tabsViewWrapper.setClipToPadding(false);
'''
create_replacement = '''        tabsViewWrapper.addView(tabsView, LayoutHelper.createFrame(LayoutHelper.MATCH_PARENT, DialogsActivity.MAIN_TABS_HEIGHT_WITH_MARGINS, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL));
        tabsView.setVisibility(View.GONE);
        createTeleForgeNavigation(context);
        tabsViewWrapper.addView(teleForgeTabsView, LayoutHelper.createFrame(LayoutHelper.MATCH_PARENT, DialogsActivity.MAIN_TABS_HEIGHT_WITH_MARGINS, Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL));
        tabsViewWrapper.setClipToPadding(false);
'''
if 'tabsViewWrapper.addView(teleForgeTabsView' not in text:
    if create_marker not in text:
        raise SystemExit('MainTabsActivity wrapper insertion point was not found')
    text = text.replace(create_marker, create_replacement, 1)

background_marker = '''        tabsView.setBackground(tabsViewBackground);

        BlurredBackgroundDrawableViewFactory iBlur3FactoryFade ='''
background_replacement = '''        tabsView.setBackground(tabsViewBackground);
        tabsView.setVisibility(View.GONE);
        teleForgeTabsView.setBackground(tabsViewBackground);

        BlurredBackgroundDrawableViewFactory iBlur3FactoryFade ='''
if 'teleForgeTabsView.setBackground(tabsViewBackground)' not in text:
    if background_marker not in text:
        raise SystemExit('MainTabsActivity background insertion point was not found')
    text = text.replace(background_marker, background_replacement, 1)

onresume_marker = '''        checkContactsTabBadge();
        checkUnreadCount(true);
'''
onresume_replacement = '''        checkContactsTabBadge();
        checkUnreadCount(true);
        selectTeleForgeTab(viewPager != null ? viewPager.getCurrentPosition() : POSITION_CHATS, false);
'''
if 'selectTeleForgeTab(viewPager != null ? viewPager.getCurrentPosition() : POSITION_CHATS, false);' not in text:
    if onresume_marker not in text:
        raise SystemExit('MainTabsActivity resume insertion point was not found')
    text = text.replace(onresume_marker, onresume_replacement, 1)

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
if 'setGestureSelectedOverride(0, false);\n            selectTeleForgeTab' not in text:
    if scroll_marker not in text:
        raise SystemExit('MainTabsActivity pager insertion point was not found')
    text = text.replace(scroll_marker, scroll_replacement, 1)

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
if 'teleForgeTabs[0].setCounter' not in text:
    if unread_marker not in text:
        raise SystemExit('MainTabsActivity unread insertion point was not found')
    text = text.replace(unread_marker, unread_replacement, 1)

main_tabs.write_text(text, encoding='utf-8')


glass = ROOT / 'TMessagesProj/src/main/java/org/telegram/ui/Components/glass/GlassTabView.java'
text = glass.read_text(encoding='utf-8')
if 'createIconTab(Context context' not in text:
    marker = '    public static GlassTabView createAvatar(Context context, Theme.ResourcesProvider resourcesProvider, int currentAccount, @StringRes int stringRes) {\n'
    factory = '''    public static GlassTabView createIconTab(Context context, Theme.ResourcesProvider resourcesProvider, int drawableRes, int stringRes) {
        GlassTabView tab = new GlassTabView(context);
        tab.resourcesProvider = resourcesProvider;
        tab.tabAnimation = TabAnimation.CALLS;
        tab.textView.setText(LocaleController.getString(stringRes));
        tab.imageView.setImageResource(drawableRes);
        return tab;
    }

'''
    if marker not in text:
        raise SystemExit('GlassTabView factory insertion point was not found')
    text = text.replace(marker, factory + marker, 1)
    glass.write_text(text, encoding='utf-8')

print('TeleForge UI finalization applied successfully')
