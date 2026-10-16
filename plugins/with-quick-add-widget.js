const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod, withMainApplication } = require('@expo/config-plugins');

const receiverName = '.QuickAddWidgetProvider';

function withQuickAddWidget(config) {
  config = withAndroidManifest(config, (modConfig) => {
    const manifest = modConfig.modResults;
    const application = manifest.manifest.application?.[0];
    if (!application) throw new Error('Quick Add Widget requires an Android application entry.');
    application.receiver = application.receiver ?? [];
    application.receiver = application.receiver.filter((receiver) => receiver.$?.['android:name'] !== receiverName);
    application.receiver.push({
      $: {
        'android:name': receiverName,
        'android:label': 'Enna Feelingu quick add',
        'android:exported': 'true',
      },
      'intent-filter': [{ action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }] }],
      'meta-data': [{
        $: {
          'android:name': 'android.appwidget.provider',
          'android:resource': '@xml/quick_add_widget_info',
        },
      }],
    });
    return modConfig;
  });

  config = withMainApplication(config, (modConfig) => {
    const { contents } = modConfig.modResults;
    const packageList = 'PackageList(this).packages.apply {';
    const registration = `add(${modConfig.android?.package}.QuickAddWidgetPackage())`;
    if (!contents.includes(registration)) {
      if (!contents.includes(packageList)) {
        throw new Error('Could not find the package list in MainApplication to register the widget bridge.');
      }
      modConfig.modResults.contents = contents.replace(packageList, `${packageList}\n              ${registration}`);
    }
    return modConfig;
  });

  return withDangerousMod(config, ['android', async (modConfig) => {
    const packageName = modConfig.android?.package;
    if (!packageName) throw new Error('Set expo.android.package to generate the Quick Add Widget provider.');
    const androidRoot = modConfig.modRequest.platformProjectRoot;
    const javaDir = path.join(androidRoot, 'app', 'src', 'main', 'java', ...packageName.split('.'));
    const layoutDir = path.join(androidRoot, 'app', 'src', 'main', 'res', 'layout');
    const xmlDir = path.join(androidRoot, 'app', 'src', 'main', 'res', 'xml');
    fs.mkdirSync(javaDir, { recursive: true });
    fs.mkdirSync(layoutDir, { recursive: true });
    fs.mkdirSync(xmlDir, { recursive: true });

    fs.writeFileSync(path.join(javaDir, 'QuickAddWidgetProvider.java'), `package ${packageName};

import android.appwidget.AppWidgetManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.ComponentName;
import android.content.Intent;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.os.Bundle;
import android.util.TypedValue;
import android.widget.RemoteViews;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;
import java.util.TimeZone;

public class QuickAddWidgetProvider extends AppWidgetProvider {
  @Override
  public void onUpdate(Context context, AppWidgetManager manager, int[] widgetIds) {
    updateWidgets(context, manager, widgetIds);
  }

  @Override
  public void onAppWidgetOptionsChanged(Context context, AppWidgetManager manager, int widgetId, Bundle newOptions) {
    updateWidgets(context, manager, new int[] { widgetId });
  }

  private void updateWidgets(Context context, AppWidgetManager manager, int[] widgetIds) {
    if (widgetIds == null || widgetIds.length == 0) return;
    PendingResult result = goAsync();
    new Thread(() -> {
      try {
        Double average = getTodayAverage(context);
        for (int widgetId : widgetIds) {
          updateWidget(context, manager, widgetId, average);
        }
      } finally {
        result.finish();
      }
    }, "quick-add-widget-update").start();
  }

  private static Double getTodayAverage(Context context) {
    File databaseFile = new File(new File(context.getFilesDir(), "SQLite"), "checkins.db");
    if (!databaseFile.exists()) return null;

    Calendar start = Calendar.getInstance();
    start.set(Calendar.HOUR_OF_DAY, 0);
    start.set(Calendar.MINUTE, 0);
    start.set(Calendar.SECOND, 0);
    start.set(Calendar.MILLISECOND, 0);
    Calendar end = (Calendar) start.clone();
    end.add(Calendar.DAY_OF_YEAR, 1);
    SimpleDateFormat isoDate = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US);
    isoDate.setTimeZone(TimeZone.getTimeZone("UTC"));

    try (SQLiteDatabase database = SQLiteDatabase.openDatabase(
        databaseFile.getAbsolutePath(), null, SQLiteDatabase.OPEN_READWRITE)) {
      try (Cursor cursor = database.rawQuery(
          "SELECT AVG(mood) FROM check_in_entries WHERE skipped = 0 AND timestamp >= ? AND timestamp < ?",
          new String[] { isoDate.format(start.getTime()), isoDate.format(end.getTime()) })) {
        return cursor.moveToFirst() && !cursor.isNull(0) ? cursor.getDouble(0) : null;
      }
    } catch (Exception ignored) {
      return null;
    }
  }

  private static void updateWidget(Context context, AppWidgetManager manager, int widgetId, Double average) {
    RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.quick_add_widget);
    Bundle options = manager.getAppWidgetOptions(widgetId);
    int width = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_WIDTH, 0);
    int height = options.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0);
    boolean expanded = width >= 150 && height >= 60;
    int labelVisibility = average == null ? android.view.View.GONE : android.view.View.VISIBLE;
    String label = average == null ? "" : "Today's Mood";
    String mood;
    if (average == null) {
      mood = expanded ? "How are we feeling today?" : "❓";
    } else {
      mood = moodEmoji((int) Math.round(average));
    }

    views.setViewVisibility(R.id.widget_label, labelVisibility);
    views.setTextViewText(R.id.widget_label, label);
    views.setTextViewText(R.id.widget_mood, mood);
    views.setContentDescription(R.id.widget_mood,
      average == null ? "How are we feeling today?" : "Today's Mood, average " + String.format(Locale.US, "%.1f", average));
    views.setTextViewTextSize(R.id.widget_label, TypedValue.COMPLEX_UNIT_SP, expanded ? 14 : 8);
    views.setTextViewTextSize(R.id.widget_mood, TypedValue.COMPLEX_UNIT_SP,
      average == null && expanded ? 16 : expanded ? 36 : 24);
    Intent intent = new Intent(context, MainActivity.class);
    intent.setAction(Intent.ACTION_VIEW);
    intent.setData(Uri.parse("ennafeelingu://quick-add"));
    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    PendingIntent pendingIntent = PendingIntent.getActivity(
      context, widgetId, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
    );
    views.setOnClickPendingIntent(R.id.widget_mood, pendingIntent);
    manager.updateAppWidget(widgetId, views);
  }

  private static String moodEmoji(int score) {
    String[] emojis = { "😫", "😭", "😔", "😕", "😐", "🙂", "😊", "😁", "🤩", "🥳" };
    return emojis[Math.max(1, Math.min(10, score)) - 1];
  }

  static void refresh(Context context) {
    AppWidgetManager manager = AppWidgetManager.getInstance(context);
    int[] widgetIds = manager.getAppWidgetIds(new ComponentName(context, QuickAddWidgetProvider.class));
    Intent updateIntent = new Intent(context, QuickAddWidgetProvider.class);
    updateIntent.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
    updateIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, widgetIds);
    context.sendBroadcast(updateIntent);
  }
}
`);

    fs.writeFileSync(path.join(javaDir, 'QuickAddWidgetModule.java'), `package ${packageName};

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class QuickAddWidgetModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext context;

  QuickAddWidgetModule(ReactApplicationContext context) {
    super(context);
    this.context = context;
  }

  @Override
  public String getName() { return "QuickAddWidgetBridge"; }

  @ReactMethod
  public void refreshWidget() {
    QuickAddWidgetProvider.refresh(context.getApplicationContext());
  }
}
`);

    fs.writeFileSync(path.join(javaDir, 'QuickAddWidgetPackage.java'), `package ${packageName};

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.Collections;
import java.util.List;

public class QuickAddWidgetPackage implements ReactPackage {
  @Override
  public List<NativeModule> createNativeModules(ReactApplicationContext context) {
    return Collections.singletonList(new QuickAddWidgetModule(context));
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext context) {
    return Collections.emptyList();
  }
}
`);

    fs.writeFileSync(path.join(layoutDir, 'quick_add_widget.xml'), `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:background="#FFFFFFFF"
  android:orientation="vertical"
  android:gravity="center"
  android:padding="2dp">
  <TextView
    android:id="@+id/widget_label"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:gravity="center"
    android:maxLines="1"
    android:text="Today's Mood"
    android:textColor="#FF245B3B"
    android:textSize="8sp"
    android:textStyle="bold" />
  <TextView
    android:id="@+id/widget_mood"
    android:layout_width="match_parent"
    android:layout_height="0dp"
    android:layout_weight="1"
    android:background="#FFE8F4EC"
    android:gravity="center"
    android:padding="0dp"
    android:text="❓"
    android:textColor="#FF245B3B"
    android:textSize="26sp"
    android:textStyle="bold" />
</LinearLayout>
`);

    fs.writeFileSync(path.join(xmlDir, 'quick_add_widget_info.xml'), `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="48dp"
  android:minHeight="48dp"
  android:minResizeWidth="48dp"
  android:minResizeHeight="48dp"
  android:updatePeriodMillis="1800000"
  android:initialLayout="@layout/quick_add_widget"
  android:resizeMode="horizontal|vertical"
  android:widgetCategory="home_screen" />
`);

    const stylesFile = path.join(androidRoot, 'app', 'src', 'main', 'res', 'values', 'quick_add_widget_styles.xml');
    if (fs.existsSync(stylesFile)) fs.unlinkSync(stylesFile);
    return modConfig;
  }]);
}

module.exports = withQuickAddWidget;
