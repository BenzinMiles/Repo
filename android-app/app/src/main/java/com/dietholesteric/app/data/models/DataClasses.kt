package com.dietholesteric.app.data.models

import kotlinx.serialization.Serializable

@Serializable
data class Recipe(
    val id: String,
    val title: String,
    val tags: List<String>,
    val time: String,
    val prepTime: String,
    val cookTime: String,
    val cals: Int,
    val sections: List<RecipeSection>,
    val steps: List<RecipeStep>,
    val medical: String,
    val chefSecret: String? = null
)

@Serializable
data class RecipeSection(
    val title: String,
    val items: List<Ingredient>
)

@Serializable
data class Ingredient(
    val name: String,
    val amount: Double,
    val unit: String
)

@Serializable
data class RecipeStep(
    val title: String,
    val desc: String
)

@Serializable
data class PlansData(
    val weeks: Map<String, WeekInfo>,
    val menuPlan: Map<String, List<DayPlan>>
)

@Serializable
data class WeekInfo(
    val title: String,
    val desc: String,
    val focus: String
)

@Serializable
data class DayPlan(
    val day: String,
    val meals: List<String>
)

@Serializable
data class ShoppingCategory(
    val category: String,
    val items: List<ShoppingItem>
)

@Serializable
data class ShoppingItem(
    val name: String,
    val price: Double
)
