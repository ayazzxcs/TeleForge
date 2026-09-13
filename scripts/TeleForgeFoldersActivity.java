package org.telegram.ui;

import android.content.Context;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TextView;
import android.widget.Toast;

import org.telegram.messenger.AndroidUtilities;
import org.telegram.messenger.R;
import org.telegram.ui.ActionBar.BaseFragment;
import org.telegram.ui.ActionBar.Theme;
import org.telegram.ui.Components.LayoutHelper;

public class TeleForgeFoldersActivity extends BaseFragment {

    private int bg() {
        return getThemedColor(Theme.key_windowBackgroundWhite);
    }

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

    private View card(Context context, String title, String subtitle, int icon, View.OnClickListener listener) {
        LinearLayout row = new LinearLayout(context);
        row.setOrientation(LinearLayout.HORIZONTAL);
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(AndroidUtilities.dp(16), AndroidUtilities.dp(14), AndroidUtilities.dp(16), AndroidUtilities.dp(14));
        row.setBackground(rounded(cardColor(), 18));
        row.setOnClickListener(listener);

        TextView iconView = text(context, icon == 0 ? "▦" : "＋", 25, false);
        iconView.setGravity(Gravity.CENTER);
        iconView.setTextColor(Theme.getColor(Theme.key_windowBackgroundWhiteBlueText, resourceProvider));
        row.addView(iconView, LayoutHelper.createLinear(42, 42));

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

    @Override
    public View createView(Context context) {
        actionBar.setBackButtonImage(R.drawable.ic_ab_back);
        actionBar.setTitle("Power Folders");
        actionBar.setAllowOverlayTitle(false);

        LinearLayout root = new LinearLayout(context);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(bg());

        ScrollView scroll = new ScrollView(context);
        scroll.setFillViewport(true);
        LinearLayout content = new LinearLayout(context);
        content.setOrientation(LinearLayout.VERTICAL);
        content.setPadding(AndroidUtilities.dp(18), AndroidUtilities.dp(20), AndroidUtilities.dp(18), AndroidUtilities.dp(30));

        TextView hero = text(context, "Your chats, your way.", 27, true);
        content.addView(hero, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 4));
        TextView intro = text(context, "Organize conversations into focused spaces without changing Telegram's underlying chat data.", 14, false);
        intro.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteGrayText));
        content.addView(intro, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 18));

        content.addView(card(context, "Manage folders", "Create, rename and configure Telegram folders", 0,
                v -> presentFragment(new FiltersSetupActivity())), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 10));

        content.addView(card(context, "Quick folder setup", "Jump directly into the mature Telegram folder editor", 1,
                v -> presentFragment(new FiltersSetupActivity())), LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 18));

        TextView section = text(context, "TeleForge layout", 15, true);
        content.addView(section, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 8));

        LinearLayout compact = new LinearLayout(context);
        compact.setGravity(Gravity.CENTER_VERTICAL);
        compact.setPadding(AndroidUtilities.dp(16), AndroidUtilities.dp(12), AndroidUtilities.dp(12), AndroidUtilities.dp(12));
        compact.setBackground(rounded(cardColor(), 18));
        LinearLayout compactLabels = new LinearLayout(context);
        compactLabels.setOrientation(LinearLayout.VERTICAL);
        compactLabels.addView(text(context, "Compact navigation", 16, true));
        TextView compactSub = text(context, "Use a denser layout when TeleForge adds advanced navigation controls.", 13, false);
        compactSub.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteGrayText));
        compactLabels.addView(compactSub, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 3, 0, 0));
        compact.addView(compactLabels, LayoutHelper.createLinear(0, LayoutHelper.WRAP_CONTENT, 1f));
        Switch compactSwitch = new Switch(context);
        compactSwitch.setChecked(getPreferences().getBoolean("compact_navigation", false));
        compactSwitch.setOnCheckedChangeListener((buttonView, checked) -> getPreferences().edit().putBoolean("compact_navigation", checked).apply());
        compact.addView(compactSwitch, LayoutHelper.createLinear(LayoutHelper.WRAP_CONTENT, LayoutHelper.WRAP_CONTENT));
        content.addView(compact, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT, 0, 0, 0, 18));

        TextView note = text(context, "Power Folders is being built on top of Telegram's existing folder engine, so your chats remain compatible with normal Telegram clients.", 12, false);
        note.setTextColor(getThemedColor(Theme.key_windowBackgroundWhiteGrayText));
        note.setPadding(AndroidUtilities.dp(4), 0, AndroidUtilities.dp(4), 0);
        content.addView(note, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, LayoutHelper.WRAP_CONTENT));

        scroll.addView(content, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        root.addView(scroll, LayoutHelper.createLinear(LayoutHelper.MATCH_PARENT, 0, 1f));
        fragmentView = root;
        return fragmentView;
    }
}
