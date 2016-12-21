package co.crowdshot;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.timhagn.rngloc.RNGLocation;
import cl.json.RNSharePackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

public class MainActivity extends ReactActivity {

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Crowdshot";
    }

    @Override
    public void onNewIntent (Intent intent) {
      super.onNewIntent(intent);
        setIntent(intent);
    }
}
