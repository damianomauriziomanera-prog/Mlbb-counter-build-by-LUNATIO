package com.lunatio.mlbbcounter;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PipPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
