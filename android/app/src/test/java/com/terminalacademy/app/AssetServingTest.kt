package com.terminalacademy.app

import android.net.Uri
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.annotation.Config

/**
 * Regression tests for what the WebView actually gets served.
 *
 * v1.0.0 shipped a launch-blocking bug here: MainActivity loaded
 * `https://appassets.androidxfs.net/index.html` while WebViewAssetLoader was
 * still on its DEFAULT domain (`appassets.androidplatform.net`). The hosts
 * never matched, `shouldInterceptRequest` returned null for every request,
 * and the WebView fell through to the network stack — which the app
 * deliberately forbids by not declaring INTERNET — so the app showed
 * "Webpage not available … net::ERR_CACHE_MISS" on every device.
 *
 * These tests pin the contract: the exact URL MainActivity loads must be
 * intercepted, and core assets must be readable from the merged APK assets.
 */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class AssetServingTest {

    private val loader = MainActivity.createAssetLoader(RuntimeEnvironment.getApplication())

    private fun url(path: String) = Uri.parse(MainActivity.START_URL.substringBeforeLast('/') + path)

    @Test
    fun `the url MainActivity loads on launch is intercepted`() {
        val response = loader.shouldInterceptRequest(Uri.parse(MainActivity.START_URL))
        assertNotNull(
            "START_URL (${MainActivity.START_URL}) is NOT intercepted by the " +
                "asset loader — the WebView would fall through to the network " +
                "stack and die with net::ERR_CACHE_MISS (the v1.0.0 launch bug)",
            response,
        )
        assertEquals("text/html", response!!.mimeType)
    }

    @Test
    fun `core bundled assets are reachable`() {
        for (path in listOf("/index.html", "/sw.js", "/manifest.webmanifest", "/logo.svg")) {
            assertNotNull("$path is missing from app/src/main/assets", loader.shouldInterceptRequest(url(path)))
        }
    }

    @Test
    fun `javascript is served as javascript`() {
        val response = loader.shouldInterceptRequest(url("/sw.js"))
        assertNotNull("/sw.js was not intercepted", response)
        assertEquals("text/javascript", response!!.mimeType)
    }

    @Test
    fun `foreign hosts are never intercepted`() {
        assertNull(loader.shouldInterceptRequest(Uri.parse("https://example.com/index.html")))
    }
}
