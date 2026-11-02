package com.terminalacademy.app

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader

/**
 * Terminal Academy — native shell.
 *
 * The whole learning app (HTML/JS/CSS + all course content) is bundled in
 * app/src/main/assets and served through WebViewAssetLoader on a fake https
 * origin. That gives the page a secure context — localStorage for progress,
 * service worker support — with zero network access and zero permissions.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        val assetLoader = createAssetLoader(this)

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest,
            ): WebResourceResponse? = assetLoader.shouldInterceptRequest(request.url)
        }

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true // localStorage = the learner's save file
            databaseEnabled = true
            allowFileAccess = false
            cacheMode = WebSettings.LOAD_DEFAULT
        }

        // Dark background so the app never flashes white on launch
        webView.setBackgroundColor(0xFF060A08.toInt())

        // Back gesture navigates in-app history when there is one
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) webView.goBack() else finish()
            }
        })

        webView.loadUrl(START_URL)
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }

    companion object {
        /**
         * The one true origin of the bundled app.
         *
         * WebViewAssetLoader serves assets on a single, fixed host. If the
         * [START_URL] host and this domain ever diverge, not a single request
         * is intercepted and the app dies with net::ERR_CACHE_MISS — exactly
         * the v1.0.0 launch bug. AssetServingTest fails the build if that
         * ever happens again.
         *
         * `appassets.androidplatform.net` is the documented default domain
         * (reserved by the AndroidX team, never resolves on the real web),
         * so we use it explicitly.
         */
        internal const val HOST = "appassets.androidplatform.net"
        internal const val START_URL = "https://$HOST/index.html"

        internal fun createAssetLoader(context: Context): WebViewAssetLoader =
            WebViewAssetLoader.Builder()
                .setDomain(HOST) // MUST match START_URL's host — see AssetServingTest
                .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(context))
                .build()
    }
}
