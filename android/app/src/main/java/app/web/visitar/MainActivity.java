package app.web.visitar;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.capacitorjs.plugins.preferences.PreferencesPlugin;
import com.capacitorjs.plugins.geolocation.GeolocationPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PreferencesPlugin.class);
        registerPlugin(GeolocationPlugin.class);
        super.onCreate(savedInstanceState);
    }
}