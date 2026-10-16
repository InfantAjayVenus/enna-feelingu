const fs = require('fs');
const path = require('path');
const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');

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

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.RemoteViews;

public class QuickAddWidgetProvider extends AppWidgetProvider {
  private static final int[] BUTTON_IDS = {
    R.id.mood_1, R.id.mood_2, R.id.mood_3, R.id.mood_4, R.id.mood_5,
    R.id.mood_6, R.id.mood_7, R.id.mood_8, R.id.mood_9, R.id.mood_10
  };

  @Override
  public void onUpdate(Context context, AppWidgetManager manager, int[] widgetIds) {
    for (int widgetId : widgetIds) {
      RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.quick_add_widget);
      for (int index = 0; index < BUTTON_IDS.length; index++) {
        int mood = index + 1;
        Intent intent = new Intent(context, MainActivity.class);
        intent.setAction(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("ennafeelingu://quick-add?mood=" + mood));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
          context, mood, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(BUTTON_IDS[index], pendingIntent);
      }
      manager.updateAppWidget(widgetId, views);
    }
  }
}
`);

    fs.writeFileSync(path.join(layoutDir, 'quick_add_widget.xml'), `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  android:orientation="vertical"
  android:padding="12dp"
  android:background="#FFFFFFFF">
  <TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="How are you feeling?"
    android:textColor="#FF18212F"
    android:textSize="14sp"
    android:textStyle="bold"
    android:paddingBottom="8dp" />
  <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal">
    <TextView android:id="@+id/mood_1" style="@style/QuickAddMoodButton" android:text="1" />
    <TextView android:id="@+id/mood_2" style="@style/QuickAddMoodButton" android:text="2" />
    <TextView android:id="@+id/mood_3" style="@style/QuickAddMoodButton" android:text="3" />
    <TextView android:id="@+id/mood_4" style="@style/QuickAddMoodButton" android:text="4" />
    <TextView android:id="@+id/mood_5" style="@style/QuickAddMoodButton" android:text="5" />
  </LinearLayout>
  <LinearLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:orientation="horizontal">
    <TextView android:id="@+id/mood_6" style="@style/QuickAddMoodButton" android:text="6" />
    <TextView android:id="@+id/mood_7" style="@style/QuickAddMoodButton" android:text="7" />
    <TextView android:id="@+id/mood_8" style="@style/QuickAddMoodButton" android:text="8" />
    <TextView android:id="@+id/mood_9" style="@style/QuickAddMoodButton" android:text="9" />
    <TextView android:id="@+id/mood_10" style="@style/QuickAddMoodButton" android:text="10" />
  </LinearLayout>
</LinearLayout>
`);

    fs.writeFileSync(path.join(xmlDir, 'quick_add_widget_info.xml'), `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
  android:minWidth="250dp"
  android:minHeight="110dp"
  android:minResizeWidth="220dp"
  android:minResizeHeight="100dp"
  android:updatePeriodMillis="0"
  android:initialLayout="@layout/quick_add_widget"
  android:resizeMode="horizontal|vertical"
  android:widgetCategory="home_screen" />
`);

    const valuesDir = path.join(androidRoot, 'app', 'src', 'main', 'res', 'values');
    fs.mkdirSync(valuesDir, { recursive: true });
    fs.writeFileSync(path.join(valuesDir, 'quick_add_widget_styles.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <style name="QuickAddMoodButton">
    <item name="android:layout_width">0dp</item>
    <item name="android:layout_height">match_parent</item>
    <item name="android:layout_weight">1</item>
    <item name="android:layout_margin">2dp</item>
    <item name="android:gravity">center</item>
    <item name="android:background">#FFE8F4EC</item>
    <item name="android:textColor">#FF245B3B</item>
    <item name="android:textSize">14sp</item>
    <item name="android:textStyle">bold</item>
  </style>
</resources>
`);
    return modConfig;
  }]);
}

module.exports = withQuickAddWidget;
