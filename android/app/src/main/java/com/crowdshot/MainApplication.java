package com.crowdshot;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.beefe.picker.PickerViewPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.smixx.reactnativeicons.ReactNativeIcons;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.brentvatne.react.ReactVideoPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.cmcewen.blurview.BlurViewPackage;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerViewPackage(),
            new PhotoViewPackage(),
            new BlurViewPackage(),
            new MapsPackage(),
            new ReactNativeIcons(),
            new RNFetchBlobPackage(),
            new RCTCameraPackage(),
            new ReactVideoPackage(),
            new LinearGradientPackage(),
            new RNGeocoderPackage(),
            new FIRMessagingPackage(),
            new FBSDKPackage(mCallbackManager)
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
  }
}
