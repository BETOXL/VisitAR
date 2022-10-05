package app.web.visitar;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.capacitorjs.plugins.preferences.PreferencesPlugin;
import com.capacitorjs.plugins.geolocation.GeolocationPlugin;
import com.capacitorjs.plugins.network.NetworkPlugin;
import com.capacitorjs.plugins.device.DevicePlugin;
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PreferencesPlugin.class);
        registerPlugin(GeolocationPlugin.class);
        registerPlugin(NetworkPlugin.class);
        registerPlugin(DevicePlugin.class);
        super.onCreate(savedInstanceState);
    }
}