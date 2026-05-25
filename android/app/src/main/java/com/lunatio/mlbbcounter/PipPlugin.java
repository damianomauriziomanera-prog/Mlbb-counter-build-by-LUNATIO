package com.lunatio.mlbbcounter;

import android.app.PictureInPictureParams;
import android.os.Build;
import android.util.Rational;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Pip")
public class PipPlugin extends Plugin {
    @PluginMethod
    public void enterPip(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Rational aspectRatio = new Rational(9, 16);
            PictureInPictureParams params = new PictureInPictureParams.Builder()
                .setAspectRatio(aspectRatio)
                .build();
            getActivity().enterPictureInPictureMode(params);
            call.resolve();
        } else {
            call.reject("Picture-in-Picture is not supported on this Android version");
        }
    }
}
