package com.dietholesteric.app.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.dietholesteric.app.viewmodel.MainUiState
import com.dietholesteric.app.viewmodel.MainViewModel

@Composable
fun RecipesScreen(uiState: MainUiState, viewModel: MainViewModel, modifier: Modifier = Modifier) {
    Column(
        modifier = modifier.fillMaxSize().padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Рецепты", style = MaterialTheme.typography.titleLarge)
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = { viewModel.decreaseServings() }) {
                    Icon(Icons.Default.Remove, contentDescription = "Decrease servings")
                }
                Text("${uiState.servings} Порц.", modifier = Modifier.padding(horizontal = 8.dp))
                IconButton(onClick = { viewModel.increaseServings() }) {
                    Icon(Icons.Default.Add, contentDescription = "Increase servings")
                }
            }
        }

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(uiState.recipes) { recipe ->
                Card(modifier = Modifier.fillMaxWidth()) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(recipe.title, style = MaterialTheme.typography.titleMedium)
                        Text("${recipe.cals * uiState.servings} ккал на порции", style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}
