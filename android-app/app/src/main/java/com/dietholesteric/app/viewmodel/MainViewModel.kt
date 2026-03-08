package com.dietholesteric.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.dietholesteric.app.data.models.PlansData
import com.dietholesteric.app.data.models.Recipe
import com.dietholesteric.app.data.models.ShoppingCategory
import com.dietholesteric.app.data.repository.DataRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class MainUiState(
    val recipes: List<Recipe> = emptyList(),
    val plans: PlansData? = null,
    val shoppingLists: Map<String, List<ShoppingCategory>> = emptyMap(),
    val servings: Int = 1,
    val isLoading: Boolean = true
)

class MainViewModel(private val repository: DataRepository) : ViewModel() {

    private val _uiState = MutableStateFlow(MainUiState())
    val uiState: StateFlow<MainUiState> = _uiState.asStateFlow()

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val recipes = repository.getRecipes()
            val plans = repository.getPlans()
            val shopping = repository.getShopping()
            _uiState.update {
                it.copy(
                    recipes = recipes,
                    plans = plans,
                    shoppingLists = shopping,
                    isLoading = false
                )
            }
        }
    }

    fun increaseServings() {
        _uiState.update { it.copy(servings = it.servings + 1) }
    }

    fun decreaseServings() {
        _uiState.update {
            if (it.servings > 1) it.copy(servings = it.servings - 1) else it
        }
    }
}

class MainViewModelFactory(private val repository: DataRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(MainViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return MainViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
