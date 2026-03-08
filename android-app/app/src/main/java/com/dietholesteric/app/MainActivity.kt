package com.dietholesteric.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.RestaurantMenu
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.dietholesteric.app.data.repository.DataRepository
import com.dietholesteric.app.ui.screens.DashboardScreen
import com.dietholesteric.app.ui.screens.PlanScreen
import com.dietholesteric.app.ui.screens.RecipesScreen
import com.dietholesteric.app.ui.screens.ShoppingScreen
import com.dietholesteric.app.viewmodel.MainViewModel
import com.dietholesteric.app.viewmodel.MainViewModelFactory

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Обзор", Icons.Filled.Dashboard)
    object Plan : Screen("plan", "План", Icons.Filled.CalendarMonth)
    object Recipes : Screen("recipes", "Рецепты", Icons.Filled.RestaurantMenu)
    object Shopping : Screen("shopping", "Покупки", Icons.Filled.ShoppingCart)
}

class MainActivity : ComponentActivity() {

    private val repository by lazy { DataRepository(applicationContext) }
    private val viewModel: MainViewModel by viewModels { MainViewModelFactory(repository) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MainScreen(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun MainScreen(viewModel: MainViewModel) {
    val navController = rememberNavController()
    val uiState by viewModel.uiState.collectAsState()

    val items = listOf(
        Screen.Dashboard,
        Screen.Plan,
        Screen.Recipes,
        Screen.Shopping
    )

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination

                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(screen.title) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        if (uiState.isLoading) {
            Text(
                "Loading...",
                modifier = Modifier.padding(innerPadding)
            )
        } else {
            NavHost(
                navController = navController,
                startDestination = Screen.Recipes.route,
                modifier = Modifier.padding(innerPadding)
            ) {
                composable(Screen.Dashboard.route) { DashboardScreen(uiState) }
                composable(Screen.Plan.route) { PlanScreen(uiState) }
                composable(Screen.Recipes.route) { RecipesScreen(uiState, viewModel) }
                composable(Screen.Shopping.route) { ShoppingScreen(uiState) }
            }
        }
    }
}
