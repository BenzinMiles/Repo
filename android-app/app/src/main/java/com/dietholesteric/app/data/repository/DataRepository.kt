package com.dietholesteric.app.data.repository

import android.content.Context
import com.dietholesteric.app.data.models.PlansData
import com.dietholesteric.app.data.models.Recipe
import com.dietholesteric.app.data.models.ShoppingCategory
import kotlinx.serialization.json.Json
import kotlinx.serialization.decodeFromString
import java.io.InputStreamReader

class DataRepository(private val context: Context) {

    private val json = Json { ignoreUnknownKeys = true }

    fun getRecipes(): List<Recipe> {
        return try {
            val fileContent = context.assets.open("recipes.json").bufferedReader().use { it.readText() }
            json.decodeFromString(fileContent)
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    fun getPlans(): PlansData? {
        return try {
            val fileContent = context.assets.open("plans.json").bufferedReader().use { it.readText() }
            json.decodeFromString(fileContent)
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun getShopping(): Map<String, List<ShoppingCategory>> {
        return try {
            val fileContent = context.assets.open("shopping.json").bufferedReader().use { it.readText() }
            json.decodeFromString(fileContent)
        } catch (e: Exception) {
            e.printStackTrace()
            emptyMap()
        }
    }
}
