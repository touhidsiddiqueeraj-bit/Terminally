import java.io.FileInputStream
import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

// ── Release signing ─────────────────────────────────────────────────────────
// Reads android/keystore.properties (gitignored). Generate a key once:
//
//   keytool -genkeypair -v \
//     -keystore android/keystores/terminal-academy-release.keystore \
//     -alias terminalacademy -keyalg RSA -keysize 2048 -validity 10000
//
// keystore.properties:
//   storeFile=keystores/terminal-academy-release.keystore
//   storePassword=…
//   keyAlias=terminalacademy
//   keyPassword=…
//
// Without keystore.properties, `gradle assembleRelease` still builds and
// produces an unsigned APK (app-release-unsigned.apk) that you can sign later.
val keystoreProperties = Properties()
val keystorePropertiesFile = rootProject.file("keystore.properties")
val hasReleaseSigning = keystorePropertiesFile.exists()
if (hasReleaseSigning) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    namespace = "com.terminalacademy.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.terminalacademy.app"
        minSdk = 24
        targetSdk = 34
        versionCode = 2
        versionName = "1.0.1"
    }

    signingConfigs {
        if (hasReleaseSigning) {
            create("release") {
                storeFile = rootProject.file(keystoreProperties.getProperty("storeFile"))
                storePassword = keystoreProperties.getProperty("storePassword")
                keyAlias = keystoreProperties.getProperty("keyAlias")
                keyPassword = keystoreProperties.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            if (hasReleaseSigning) {
                signingConfig = signingConfigs.getByName("release")
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    testOptions {
        unitTests {
            // Let Robolectric tests read the real merged assets (index.html,
            // _next/ chunks…) — the regression tests assert what the WebView
            // would actually be served.
            isIncludeAndroidResources = true
        }
    }

    androidResources {
        // Next.js emits all JS/CSS under `assets/_next/`, but aapt's DEFAULT
        // ignore pattern contains `<dir>_*`, which silently drops every
        // underscore-prefixed DIRECTORY while packaging — the app would ship
        // with a blank page. Keep the rest of the defaults, drop that rule.
        ignoreAssetsPattern =
            "!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.11.0")

    testImplementation("junit:junit:4.13.2")
    testImplementation("org.robolectric:robolectric:4.13")
}
