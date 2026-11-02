package com.terminalacademy.app

import android.annotation.SuppressLint
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

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

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

        webView.loadUrl("https://appassets.androidxfs.net/index.html")
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
